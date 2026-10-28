"""Rebuild the TVIS logo SVGs from the original PNG.

Usage:  python3 scripts/trace-logo.py "<original logo>.png" src/assets/img/
Needs:  pip install numpy pillow scipy pypotrace

What it does (so the vector stays crisp at any size): splits the artwork into charcoal and olive using soft
colour masks, up-samples and smooths them, traces with potrace, then cleans the result: curves that are really
straight become lines, kinks are merged, near-horizontal and near-vertical edges are snapped exact, short
chamfers at corners become sharp corners, and the four window panes are redrawn as identical squares.
Writes logo.svg (full colour, for the white header) and logo-reverse.svg (white and light olive, for the dark footer).
"""
import sys, math, numpy as np
from PIL import Image
from scipy import ndimage as ndi
import potrace

SRC = sys.argv[1]; OUT = sys.argv[2]
UP = 6          # trace at 6x
BLUR = 2.6      # in up-sampled pixels
LINE_TOL = 0.4  # bezier -> line if control points are within this many px of the chord (source px)
MERGE_TOL = 0.55 # drop a vertex if it is within this of the line joining its neighbours
SNAP_ANG = 3.0  # degrees: near-H/V edges snap to exact

im = Image.open(SRC).convert('RGBA'); W, H = im.size
a = np.array(im).astype(float); r, g, b, al = a[...,0], a[...,1], a[...,2], a[...,3]/255.0
olive_frac = np.clip((g - b + 3) / 91.0, 0, 1)     # charcoal g-b is about -3, olive about 88: soft, so mixed edge pixels stay sub-pixel accurate
cov_olive = al * olive_frac
cov_char = al * (1 - olive_frac)
# fill olive panes sitting inside the charcoal house so the charcoal is solid under them
char_bin = cov_char > .5
filled = ndi.binary_fill_holes(char_bin)
holes = filled & ~char_bin
lab, n = ndi.label(holes)
for i in range(1, n+1):
    comp = lab == i
    if (cov_olive[comp] > .5).mean() > .5:
        cov_char = np.maximum(cov_char, comp.astype(float))

def mask(cov):
    big = ndi.zoom(cov, UP, order=3)
    big = ndi.gaussian_filter(big, BLUR)
    return big > .5

def segs_from_curve(curve, sc):
    """-> list of ('L',(x,y)) / ('C',(c1,c2,end)) with start point"""
    out = []
    for seg in curve:
        ep = (seg.end_point.x*sc, seg.end_point.y*sc)
        if seg.is_corner:
            c = (seg.c.x*sc, seg.c.y*sc); out.append(('L', c)); out.append(('L', ep))
        else:
            out.append(('C', ((seg.c1.x*sc, seg.c1.y*sc), (seg.c2.x*sc, seg.c2.y*sc), ep)))
    return (curve.start_point.x*sc, curve.start_point.y*sc), out

def dist_pt_line(p, a_, b_):
    ax, ay = a_; bx, by = b_; px, py = p
    dx, dy = bx-ax, by-ay; L = math.hypot(dx, dy)
    if L < 1e-9: return math.hypot(px-ax, py-ay)
    return abs((px-ax)*dy - (py-ay)*dx)/L

def simplify_path(start, segs):
    # 1) straight-ish beziers -> lines
    cur = start; out = []
    for kind, v in segs:
        if kind == 'L':
            out.append(['L', v, None, None]); cur = v
        else:
            c1, c2, e = v
            if max(dist_pt_line(c1, cur, e), dist_pt_line(c2, cur, e)) < LINE_TOL:
                out.append(['L', e, None, None])
            else:
                out.append(['C', e, c1, c2])
            cur = e
    # 2) merge collinear consecutive lines
    changed = True
    while changed and len(out) > 3:
        changed = False
        pts = [start] + [s[1] for s in out[:-1]]  # start of each seg
        for i in range(len(out)):
            j = (i+1) % len(out)
            if out[i][0] == 'L' and out[j][0] == 'L':
                p0 = out[i-1][1] if i > 0 else out[-1][1]
                p1 = out[i][1]; p2 = out[j][1]
                a1 = math.atan2(p1[1]-p0[1], p1[0]-p0[0]); a2 = math.atan2(p2[1]-p1[1], p2[0]-p1[0]); turn = abs((a2-a1+math.pi)%(2*math.pi)-math.pi)
                if dist_pt_line(p1, p0, p2) < MERGE_TOL and turn < math.radians(2.5) and math.hypot(p2[0]-p0[0], p2[1]-p0[1]) > 0:
                    # keep geometry: remove vertex p1 (segment i), segment j now starts at p0
                    out.pop(i); changed = True; break
    # 3) sharpen corners: a short segment between two long lines becomes the lines' intersection
    def ln(i):
        e = out[i][1]; st = out[i-1][1]; return st, e
    def inter(p1, p2, p3, p4):
        x1,y1=p1;x2,y2=p2;x3,y3=p3;x4,y4=p4
        d=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)
        if abs(d)<1e-6: return None
        a_=x1*y2-y1*x2; b_=x3*y4-y3*x4
        return ((a_*(x3-x4)-(x1-x2)*b_)/d, (a_*(y3-y4)-(y1-y2)*b_)/d)
    changed = True
    while changed and len(out) > 4:
        changed = False
        n = len(out)
        for i in range(n):
            p, q = (i-1) % n, (i+1) % n
            if out[p][0] != 'L' or out[q][0] != 'L': continue
            s_i, e_i = ln(i)
            if math.hypot(e_i[0]-s_i[0], e_i[1]-s_i[1]) > 20: continue
            ps, pe = ln(p); qs, qe = out[i][1], out[q][1]
            if math.hypot(pe[0]-ps[0], pe[1]-ps[1]) < 8 or math.hypot(qe[0]-qs[0], qe[1]-qs[1]) < 8: continue
            X = inter(ps, pe, qs, qe)
            if X is None: continue
            if math.hypot(X[0]-s_i[0], X[1]-s_i[1]) > 16 and math.hypot(X[0]-e_i[0], X[1]-e_i[1]) > 16: continue
            out[p][1] = X
            out.pop(i); changed = True; break
    start2 = out[-1][1]
    return start2, out

def snap(paths):
    P = []
    for start, segs in paths:
        pts = [[*sg[1]] for sg in segs]; P.append((pts, segs))
    def dir_ang(a_, b_): return math.degrees(math.atan2(b_[1]-a_[1], b_[0]-a_[0]))
    def perp(a1, a2):
        d = abs((a1-a2+180) % 360 - 180); return 70 < d < 110
    for pts, segs in P:
        n = len(pts)
        for i in range(n):
            if segs[i][0] != 'L': continue
            p0 = pts[i-1]; p1 = pts[i]
            dx, dy = p1[0]-p0[0], p1[1]-p0[1]
            L = math.hypot(dx, dy)
            if L < 3: continue
            ang_v = math.degrees(math.atan2(abs(dx), abs(dy)))
            ang_h = math.degrees(math.atan2(abs(dy), abs(dx)))
            lim_v, lim_h = 3.0, 0.8
            if L < 30:   # short edge between two roughly perpendicular edges: a real square-off
                a_cur = dir_ang(p0, p1); a_prev = dir_ang(pts[i-2], p0); a_next = dir_ang(p1, pts[(i+1) % n])
                if perp(a_cur, a_prev) and perp(a_cur, a_next): lim_v = lim_h = 15
            if ang_v < lim_v and ang_v <= ang_h:
                m = (p0[0]+p1[0])/2; p0[0] = p1[0] = m
            elif ang_h < lim_h:
                m = (p0[1]+p1[1])/2; p0[1] = p1[1] = m
    return P

def fmt(v): 
    s = f"{v:.2f}".rstrip('0').rstrip('.'); return s if s != '-0' else '0'

def to_d(P_item):
    pts, segs = P_item
    n = len(pts); d = [f"M{fmt(pts[-1][0])} {fmt(pts[-1][1])}"]
    for i in range(n):
        s = segs[i]; p = pts[i]
        if s[0] == 'L': d.append(f"L{fmt(p[0])} {fmt(p[1])}")
        else:
            c1, c2 = s[2], s[3]
            d.append(f"C{fmt(c1[0])} {fmt(c1[1])} {fmt(c2[0])} {fmt(c2[1])} {fmt(p[0])} {fmt(p[1])}")
    d.append('Z'); return ''.join(d)

def trace(cov):
    m = mask(cov)
    bm = potrace.Bitmap(~m)
    path = bm.trace(turdsize=60, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.3, opticurve=True, opttolerance=2.5)
    sc = 1.0/UP; paths = []
    for curve in path:
        st, segs = segs_from_curve(curve, sc)
        st2, segs2 = simplify_path(st, segs)
        paths.append((st2, segs2))
    P = snap(paths)
    return ''.join(to_d(p) for p in P), sum(len(p[0]) for p in P)

dc, nc = trace(cov_char)
do_all, no = trace(cov_olive)
# window panes: 4 identical squares on a grid (found as the small compact olive blobs)
lab_o, n_o = ndi.label(cov_olive > .5)
objs = ndi.find_objects(lab_o); panes = []
for k, sl in enumerate(objs):
    h_, w_ = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
    if 25 < w_ < 70 and 25 < h_ < 70 and (lab_o[sl] == k+1).sum() > .85*w_*h_:
        panes.append([sl[1].start, sl[0].start, sl[1].stop, sl[0].stop])
pane_d = ''
if len(panes) == 4:
    xs_ = sorted(panes, key=lambda p: p[0]); L_, R_ = xs_[:2], xs_[2:]
    ys_ = sorted(panes, key=lambda p: p[1]); T_, B_ = ys_[:2], ys_[2:]
    mx = lambda v: sum(v)/len(v)
    cx0, cx1 = mx([p[0] for p in L_]), mx([p[2] for p in L_]); dx0, dx1 = mx([p[0] for p in R_]), mx([p[2] for p in R_])
    ry0, ry1 = mx([p[1] for p in T_]), mx([p[3] for p in T_]); sy0, sy1 = mx([p[1] for p in B_]), mx([p[3] for p in B_])
    w0 = ((cx1-cx0)+(dx1-dx0))/2; h0 = ((ry1-ry0)+(sy1-sy0))/2
    for (xa, ya) in [(cx0, ry0), (dx0, ry0), (cx0, sy0), (dx0, sy0)]:
        pane_d += f"M{fmt(xa)} {fmt(ya)}H{fmt(xa+w0)}V{fmt(ya+h0)}H{fmt(xa)}Z"
    # remove the four traced squares: re-trace olive without them
    cov_o2 = cov_olive.copy()
    for p in panes: cov_o2[p[1]-3:p[3]+3, p[0]-3:p[2]+3] = 0
    do, no = trace(cov_o2); do = do + pane_d
else:
    do = do_all
    print('panes found', len(panes))
ys, xs = np.where(al > .5); x0, x1, y0, y1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
vb = f"{x0} {y0} {x1-x0} {y1-y0}"
def svg(c1, c2): return f'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="{vb}"><path fill="{c1}" d="{dc}"/><path fill="{c2}" d="{do}"/></svg>'
open(OUT + 'logo.svg', 'w').write(svg('#232B2E', '#72852E'))
open(OUT + 'logo-reverse.svg', 'w').write(svg('#FFFFFF', '#A3B654'))
print('nodes', nc, no, 'bytes', len(svg('#232B2E', '#72852E')), 'viewBox', vb)
