"""Match the traced logo to Joey's new "TVIS CONSTRUCTION" artwork (NewLogo.jpg, 2026-10-29).

Run on the output of trace-logo.py (logo.svg and logo-reverse.svg). It drops the old
"SITE WORK AND" line, keeps the traced "CONSTRUCTION" letters, scales and spaces them
to sit under "TVIS" the way the new artwork does, and replaces the full-width olive bar
with the shorter, thinner bar from the new artwork. Positions were measured from
NewLogo.jpg and converted to this file's units at 1.535x (TVIS spans x 89-1693, bottom at y 722).
Then make-badge (in build.mjs) wraps it in the round badge for icons and the footer.
"""
import re, sys

K = 1.17                    # letter scale vs the traced letters
TOP = 768                   # top of the CONSTRUCTION line
LEFT, RIGHT = 235, 1573     # letter line span
BAR = (235, 1578, 850, 866) # olive bar x0, x1, y0, y1
OLD_TOP = 750
VIEWBOX = '79 97 1619 776'

def fmt(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')

def bbox(sp):
    n = list(map(float, re.findall(r'-?\d+\.?\d*', sp)))
    return min(n[0::2]), max(n[0::2]), min(n[1::2]), max(n[1::2])

def fix(path):
    s = open(path).read()
    paths = list(re.finditer(r'(<path fill="[^"]*"[^>]* d=")([^"]*)(")', s))
    dark, olive = paths[0], paths[1]
    subs = re.findall(r'M[^M]*', dark.group(2))
    keep, letters = [], []
    for sp in subs:
        x0, x1, y0, y1 = bbox(sp)
        if y0 < 740:
            keep.append(sp)
        elif x0 >= 930:
            letters.append((x0, x1, sp))
    assert letters, 'run this on the output of trace-logo.py'
    letters.sort()
    groups = []
    for x0, x1, sp in letters:
        if groups and x0 >= groups[-1][0] and x1 <= groups[-1][1]:
            groups[-1][2].append(sp)
        else:
            groups.append([x0, x1, [sp]])
    assert len(groups) == 12, len(groups)
    widths = [(g[1] - g[0]) * K for g in groups]
    gap = (RIGHT - LEFT - sum(widths)) / (len(groups) - 1)
    x, out = LEFT, []
    for (gx0, gx1, sps), w in zip(groups, widths):
        for sp in sps:
            def tr(mm):
                px, py = float(mm.group(1)), float(mm.group(2))
                return fmt(x + (px - gx0) * K) + ' ' + fmt(TOP + (py - OLD_TOP) * K)
            out.append(re.sub(r'(-?\d+\.?\d*)[ ,](-?\d+\.?\d*)', tr, sp))
        x += w + gap
    new_dark = ''.join(keep)
    fill = re.search(r'fill="([^"]*)"', dark.group(1)).group(1)
    letters_el = f'<path fill="{fill}" stroke="{fill}" stroke-width="4" stroke-linejoin="round" d="{"".join(out)}"/>'
    osubs = [sp for sp in re.findall(r'M[^M]*', olive.group(2)) if bbox(sp)[2] < 800]
    x0, x1, y0, y1 = BAR
    osubs.append(f'M{x0} {y0}L{x1} {y0}L{x1} {y1}L{x0} {y1}Z')
    new_olive = ''.join(osubs)
    end_dark = s.index('/>', dark.end(3)) + 2
    s = (s[:dark.start(2)] + new_dark + s[dark.end(2):end_dark] + letters_el + s[end_dark:olive.start(2)] + new_olive + s[olive.end(2):])
    s = re.sub(r'viewBox="[^"]*"', f'viewBox="{VIEWBOX}"', s, count=1)
    open(path, 'w').write(s)
    print('fixed', path)

for p in sys.argv[1:]:
    fix(p)
