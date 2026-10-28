import sys, re, numpy as np
from PIL import Image
import potrace
src, out, tol = sys.argv[1], sys.argv[2], float(sys.argv[3]); UP = float(sys.argv[4])
im = Image.open(src).convert('RGBA'); W,H = im.size
a = np.array(im).astype(int); r,g,b,al = a[...,0],a[...,1],a[...,2],a[...,3]
opaque = al > 128; olive = opaque & ((g-b) > 40) & (g > r-10); charcoal = opaque & ~olive
def up(mask):
    img = Image.fromarray((mask*255).astype(np.uint8)).resize((int(W*UP),int(H*UP)), Image.LANCZOS)
    return np.array(img) > 127
def fmt(v): 
    s = f"{v:.0f}"; return s
def trace(mask, scale):
    path = potrace.Bitmap(~up(mask)).trace(turdsize=8, alphamax=1.0, opttolerance=tol)
    d = []; n = 0
    for curve in path:
        sp = curve.start_point; d.append(f"M{fmt(sp.x*scale)} {fmt(sp.y*scale)}")
        for seg in curve:
            n += 1; ep = seg.end_point
            if seg.is_corner:
                c = seg.c; d.append(f"L{fmt(c.x*scale)} {fmt(c.y*scale)} {fmt(ep.x*scale)} {fmt(ep.y*scale)}")
            else:
                c1, c2 = seg.c1, seg.c2
                d.append(f"C{fmt(c1.x*scale)} {fmt(c1.y*scale)} {fmt(c2.x*scale)} {fmt(c2.y*scale)} {fmt(ep.x*scale)} {fmt(ep.y*scale)}")
        d.append("Z")
    return "".join(d), n
sc = 1/UP
dc, nc = trace(charcoal, sc); do, no = trace(olive, sc)
ys, xs = np.where(opaque); x0,x1,y0,y1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1-x0} {y1-y0}"><path fill="#232B2E" d="{dc}"/><path fill="#72852E" d="{do}"/></svg>'
open(out,'w').write(svg); print(out, 'segments', nc, no, 'bytes', len(svg))
