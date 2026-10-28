// Cross-section drawings of the work, drawn in code so every page has a real picture of the
// subject before the jobsite photos arrive. One flat graphic language, in the brand's colours.
// Used by build.mjs for {{diagram ...}} tokens, for empty photo and before/after slots that name
// a drawing, and by make-samples.mjs to render the sample project photos.
//
//   diagram('driveway', 'before')  -> SVG string
//   diagram('pad', 'after', { animate: true })  -> the layers carry classes for the scroll build-up
//
// Each scene is 800x600 (4:3). "before" and "after" share the same ground so the compare slider lines up.

export const SCENES = {
  driveway: 'gravel driveway: washed-out ruts regraded with a compacted base, fresh crusher run and a culvert at the entrance',
  pad: 'shed or garage pad: a sloped yard cut and filled level, gravel base placed in lifts, the building set square on top',
  drainage: 'French drain: standing water against a house replaced by a stone-filled trench with a perforated pipe running to daylight',
  cleanup: 'yard cleanup: an old shed, brush and debris cleared, the ground leveled and seeded',
  siteprep: 'new home site: a sloped lot cut to a level building pad with footings in and a gravel construction drive',
  utilities: 'utility trench: a trench cut with bedding stone, water line and conduit, ready to backfill',
  concrete: 'concrete driveway: a compacted gravel base inside forms, then the finished slab and apron',
  finalgrade: 'final grading: spoil piles and ruts after construction graded smooth with topsoil, lawn and driveway gravel',
  dirtgravel: 'dirt and gravel work: a delivered pile spread into an even layer',
};

const W = 800, H = 600;
const C = {
  air: '#EEF1E2',     // the ground the drawing sits on
  grass: '#72852E',
  grass2: '#5E6E24',
  top: '#6B5A42',     // topsoil
  sub: '#9A8466',     // subsoil
  clay: '#A8765B',    // the red clay under Chattanooga
  wet: '#5B4E3C',
  water: '#7F9DB0',
  water2: '#6A8B9F',
  gravel: '#CFC8AF',
  gravelDot: '#A9A184',
  base: '#B8AF94',
  baseDot: '#8F8769',
  sand: '#D8CBA8',
  stone: '#C4BDA3',
  concrete: '#D6D4CC',
  concrete2: '#B9B7AF',
  road: '#4E5456',
  ink: '#232B2E',
  shed: '#5E6E24',
  shedDark: '#4F5D1E',
  roof: '#232B2E',
  old: '#8E8A80',
  oldRoof: '#5F5C55',
  wood: '#B08B5B',
  pipe: '#FFFFFF',
  conduit: '#8A8F92',
  tape: '#D6E59A',
};

// ---------- geometry helpers ----------
const n = v => Math.round(v * 10) / 10;
const pts = a => a.map(([x, y]) => `${n(x)} ${n(y)}`).join('L');
const poly = (a, fill, attrs = '') => `<path d="M${pts(a)}Z" fill="${fill}"${attrs ? ' ' + attrs : ''}/>`;
const line = (a, stroke, w = 3, attrs = '') => `<path d="M${pts(a)}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${attrs ? ' ' + attrs : ''}/>`;
const shift = (a, dy, dx = 0) => a.map(([x, y]) => [x + dx, y + dy]);
const below = a => [...a, [a.at(-1)[0], H + 120], [a[0][0], H + 120]];
const between = (top, bottom) => [...top, ...bottom.slice().reverse()];
const rect = (x, y, w, h, fill, attrs = '') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}"${attrs ? ' ' + attrs : ''}/>`;
const circle = (cx, cy, r, fill, attrs = '') => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${attrs ? ' ' + attrs : ''}/>`;
const g = (inner, attrs = '') => `<g${attrs ? ' ' + attrs : ''}>${inner}</g>`;

// y of a profile at x (linear between points)
function at(profile, x) {
  for (let i = 1; i < profile.length; i++) {
    const [x0, y0] = profile[i - 1], [x1, y1] = profile[i];
    if (x <= x1) return x0 === x1 ? y0 : y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }
  return profile.at(-1)[1];
}
// slice a profile to [x0, x1], interpolating the ends
function cut(profile, x0, x1) {
  const inner = profile.filter(([x]) => x > x0 && x < x1);
  return [[x0, at(profile, x0)], ...inner, [x1, at(profile, x1)]];
}

// ---------- fills ----------
function gravelDefs(id) {
  return `<defs>
<pattern id="${id}-cr" width="16" height="11" patternUnits="userSpaceOnUse"><rect width="16" height="11" fill="${C.gravel}"/><circle cx="4" cy="3" r="1.9" fill="${C.gravelDot}"/><circle cx="12" cy="8" r="1.6" fill="${C.gravelDot}"/><circle cx="9" cy="2" r="1.1" fill="${C.gravelDot}"/></pattern>
<pattern id="${id}-base" width="18" height="13" patternUnits="userSpaceOnUse"><rect width="18" height="13" fill="${C.base}"/><circle cx="5" cy="7" r="2.6" fill="${C.baseDot}"/><circle cx="14" cy="3" r="2.1" fill="${C.baseDot}"/><circle cx="12" cy="11" r="1.6" fill="${C.baseDot}"/></pattern>
<pattern id="${id}-stone" width="22" height="16" patternUnits="userSpaceOnUse"><rect width="22" height="16" fill="${C.stone}"/><circle cx="6" cy="8" r="3.6" fill="${C.baseDot}"/><circle cx="17" cy="4" r="3" fill="${C.gravelDot}"/><circle cx="15" cy="13" r="2.6" fill="${C.baseDot}"/></pattern>
</defs>`;
}
const crusher = id => `url(#${id}-cr)`;
const baseStone = id => `url(#${id}-base)`;
const washed = id => `url(#${id}-stone)`;

// soil under a surface: topsoil band, subsoil, red clay deeper down
function earth(profile, { grass = true, topsoil = true, patchy = false } = {}) {
  let out = poly(below(shift(profile, 150)), C.clay) + poly(between(profile, shift(profile, 150)), C.sub);
  if (topsoil) out += poly(between(profile, shift(profile, 26)), C.top);
  if (grass) {
    if (patchy) {
      for (let x = profile[0][0]; x < profile.at(-1)[0]; x += 70) {
        const seg = cut(profile, x, Math.min(x + 44, profile.at(-1)[0]));
        out += poly(between(seg, shift(seg, 7)), C.grass2);
      }
    } else out += poly(between(profile, shift(profile, 8)), C.grass);
  }
  return out;
}

// ---------- objects ----------
function shed(x, baseY, w, h, { tilt = 0, old = false } = {}) {
  const body = old ? C.old : C.shed, roof = old ? C.oldRoof : C.roof, door = old ? '#6E6A60' : C.shedDark;
  const inner = rect(x, baseY - h, w, h, body)
    + rect(x + w * 0.42, baseY - h * 0.78, w * 0.16, h * 0.78, door)
    + poly([[x - 14, baseY - h], [x + w / 2, baseY - h - w * 0.26], [x + w + 14, baseY - h]], roof);
  return g(inner, tilt ? `transform="rotate(${tilt} ${n(x + w / 2)} ${n(baseY)})"` : '');
}
function house(x, w, grade) {
  // a wall rising off the top of the picture, with its footing below grade
  return rect(x, 0, w, grade + 36, C.ink) + rect(x - 6, grade + 36, w + 36, 30, C.concrete) + rect(x, grade + 36, w, 30, C.concrete2);
}
function pipe(cx, cy, r, { perforated = false } = {}) {
  let out = circle(cx, cy, r, C.pipe, `stroke="${C.ink}" stroke-width="3"`);
  if (perforated) for (let a = 0; a < 6; a++) { const t = a * Math.PI / 3 + 0.4; out += circle(cx + Math.cos(t) * r * 0.62, cy + Math.sin(t) * r * 0.62, 1.8, C.ink); }
  return out;
}
function runPipe(x0, y0, x1, y1, r = 7) {
  return line([[x0, y0], [x1, y1]], C.ink, r * 2 + 4) + line([[x0, y0], [x1, y1]], C.pipe, r * 2);
}
function puddle(x0, x1, y, depth) {
  const top = [[x0, y], [x1, y]];
  return poly([[x0, y], [x1, y], [x1 - (x1 - x0) * 0.08, y + depth], [x0 + (x1 - x0) * 0.08, y + depth]], C.water) + poly(between(top, shift(top, 3)), C.water2);
}
function brush(x, y, s = 1, seed = 1) {
  // a clump of overgrowth: a few angular leaves in two olives and a dark stem
  const leaves = [
    [[0, 0], [-26, -34], [-8, -62], [6, -30]], [[0, 0], [10, -48], [34, -70], [26, -28]], [[0, 0], [-40, -20], [-54, -44], [-18, -22]],
    [[0, 0], [36, -14], [62, -36], [30, -10]], [[0, 0], [-6, -70], [10, -92], [14, -56]],
  ];
  let out = '';
  leaves.forEach((l, i) => { out += poly(l.map(([a, b]) => [x + a * s, y + b * s]), (i + seed) % 3 === 0 ? C.grass2 : (i + seed) % 3 === 1 ? C.grass : C.top); });
  return out;
}
function debris(x, y) {
  return poly([[x, y], [x + 48, y - 6], [x + 50, y + 2], [x + 2, y + 8]], C.wood)
    + poly([[x + 30, y - 2], [x + 92, y - 22], [x + 96, y - 15], [x + 34, y + 5]], C.wood)
    + circle(x + 120, y - 16, 18, C.ink) + circle(x + 120, y - 16, 8, C.sub)
    + rect(x - 30, y - 22, 26, 22, C.old);
}
function stakes(x0, x1, y0, y1) {
  let out = '';
  for (const [x, y] of [[x0, y0], [x1, y1]]) out += rect(x - 3, y - 54, 6, 54, C.wood) + rect(x - 3, y - 54, 6, 14, '#C9452E');
  out += line([[x0, y0 - 44], [x1, y1 - 44]], '#C9452E', 2);
  return out;
}
const dashed = (profile) => line(profile, C.ink, 2.5, 'stroke-dasharray="10 8" opacity=".55"');
const asphalt = (x, grade) => rect(x, grade - 2, W - x, 14, C.road) + rect(x, grade + 12, W - x, 10, C.base);

// ---------- scenes ----------
const scenes = {
  driveway(state, id) {
    const road = 720;
    const old = [[0, 384], [60, 390], [120, 410], [170, 378], [220, 402], [290, 384], [350, 412], [420, 382], [480, 406], [540, 384], [600, 418], [660, 392], [road, 390]];
    if (state === 'before') {
      let out = earth([...old, [800, 390]], { grass: false });
      // what's left of the gravel, in patches, and water sitting in the ruts
      for (const [a, b] of [[20, 90], [140, 200], [250, 320], [400, 460], [520, 560], [640, 700]]) { const seg = cut(old, a, b); out += poly(between(seg, shift(seg, 6)), crusher(id)); }
      out += puddle(90, 156, 404, 8) + puddle(314, 392, 405, 9) + puddle(556, 650, 410, 11);
      out += asphalt(road, 390);
      return out;
    }
    const top = [[0, 384], [road, 390]];
    let out = earth([[0, 392], [road, 398], [800, 398]], { grass: false, topsoil: false });
    out += dashed(old);
    // culvert at the entrance, bedded in stone
    out += poly([[560, 426], [700, 426], [700, 500], [560, 500]], washed(id));
    out += pipe(630, 466, 26);
    if (state === 'progress') {
      // ruts cut out and the base stone in; crusher run still to come
      out += poly(between(shift(top, 6), shift(top, 42)), baseStone(id));
      out += stakes(36, 684, at(top, 36) + 6, at(top, 684) + 6);
      out += asphalt(road, 390);
      return out;
    }
    out += poly(between(shift(top, 10), shift(top, 42)), baseStone(id));   // base stone, compacted
    out += poly(between(top, shift(top, 10)), crusher(id));                 // crusher run on top
    out += asphalt(road, 390);
    return out;
  },

  pad(state, id, { animate = false } = {}) {
    const slope = [[0, 326], [800, 438]];
    if (state === 'before') return earth(slope) + shed(300, at(slope, 400) - 1, 200, 112, { tilt: 7.5, old: true });
    const top = 352, padL = 230, padR = 570;
    const L = s => animate ? `class="layer ${s}"` : '';
    let out = earth(slope, { grass: false });
    out += poly(between(cut(slope, 0, 150), shift(cut(slope, 0, 150), 8)), C.grass) + poly(between(cut(slope, 650, 800), shift(cut(slope, 650, 800), 8)), C.grass);
    out += dashed(cut(slope, 120, 680));
    const finished = [[0, 326], [150, at(slope, 150)], [padL - 40, top + 28], [padR + 40, top + 28], [650, at(slope, 650)], [800, 438]];
    // 1: cut and fill, compacted level
    out += g(poly([[150, at(slope, 150)], [padL - 40, top + 28], [padR + 40, top + 28], [650, at(slope, 650)], [650, at(slope, 650) + 1], [150, at(slope, 150) + 1]], '#8C7B5E'), L('l1 layer-cut'));
    out += g(poly([[padL - 40, top + 28], [padR + 40, top + 28], [padR + 24, top + 14], [padL - 24, top + 14]], baseStone(id)), L('l2'));  // 2: first lift
    out += g(poly([[padL - 24, top + 14], [padR + 24, top + 14], [padR + 8, top], [padL - 8, top]], crusher(id)), L('l3'));              // 3: second lift
    if (state !== 'progress') out += g(shed(300, top, 200, 112), L('l4'));                                                                // 4: the building
    if (state === 'progress') out += stakes(padL, padR, top, top);
    void finished;
    return out;
  },

  drainage(state, id) {
    const wallW = 72;
    if (state === 'before') {
      const grade = [[wallW, 376], [300, 366], [800, 342]];
      let out = earth(grade, { patchy: true });
      out += poly(between(cut(grade, wallW, 330), shift(cut(grade, wallW, 330), 60)), C.wet);
      out += house(0, wallW, 366) + puddle(wallW, 330, 369, 10);
      return out;
    }
    const grade = [[wallW, 338], [300, 352], [800, 374]];
    let out = earth(grade) + house(0, wallW, 338);
    // the trench beside the footing: fabric, washed stone, perforated pipe, then the run to daylight
    out += rect(112, 346, 96, 108, washed(id));
    out += line([[112, 346], [112, 454], [208, 454], [208, 346]], C.ink, 2.5, 'stroke-dasharray="7 6"');
    out += runPipe(160, 430, 800, 458) + pipe(160, 430, 15, { perforated: true });
    out += poly(between(cut(grade, 112, 208), shift(cut(grade, 112, 208), 8)), C.grass);
    return out;
  },

  cleanup(state, id) {
    void id;
    const rough = [[0, 392], [120, 388], [260, 396], [400, 386], [540, 394], [680, 388], [800, 392]];
    if (state === 'before') {
      return earth(rough, { patchy: true }) + shed(110, 390, 210, 118, { tilt: -4, old: true }) + brush(470, 390, 1.1, 1) + brush(560, 392, .8, 2) + brush(690, 389, 1.2, 0) + debris(360, 392);
    }
    const flat = [[0, 390], [800, 390]];
    return earth(flat) + poly(between(flat, shift(flat, 8)), C.grass);
  },

  siteprep(state, id) {
    const slope = [[0, 296], [800, 446]];
    if (state === 'before') return earth(slope, { patchy: true }) + brush(150, at(slope, 150), 1.1, 2) + brush(420, at(slope, 420), 1.3, 1) + brush(640, at(slope, 640), .9, 0);
    const top = 380, padL = 150, padR = 640;
    const finished = [[0, 296], [90, at(slope, 90)], [padL, top], [padR, top], [720, at(slope, 720)], [800, 446]];
    let out = earth(finished, { grass: false });
    out += poly(between(cut(finished, 0, 90), shift(cut(finished, 0, 90), 8)), C.grass);
    out += dashed(cut(slope, 60, 760));
    out += poly([[padL, top], [padR, top], [720, at(slope, 720)], [720, at(slope, 720) + 2], [padL, top + 2]], '#8C7B5E');
    // footings and stem walls, ready for framing
    for (const x of [200, 540]) out += rect(x - 26, top - 2, 52, 26, C.concrete) + rect(x - 14, top - 50, 28, 48, C.concrete2);
    // construction drive in gravel on the low side
    const drive = cut(finished, 700, 800);
    out += poly(between(drive, shift(drive, 12)), crusher(id));
    return out;
  },

  utilities(state, id) {
    const flat = [[0, 372], [800, 372]];
    let out = earth(flat);
    out += rect(300, 372, 160, 150, C.sub);                      // the trench, open
    out += rect(300, 500, 160, 22, C.sand);                      // bedding
    out += line([[300, 372], [300, 522], [460, 522], [460, 372]], C.wet, 4);
    out += pipe(350, 488, 14) + circle(412, 490, 11, C.conduit) + circle(412, 490, 5, C.ink);
    out += rect(300, 438, 160, 4, C.tape);                       // warning tape, where the backfill will go
    const pile = [[470, 372], [520, 330], [600, 318], [680, 340], [730, 372]];
    out += poly(pile, C.sub) + poly(between(pile, shift(pile, 14)), C.top);
    return out;
  },

  concrete(state, id) {
    const road = 740, grade = 380;
    const flat = [[0, grade], [road, grade]];
    let out = earth([[0, grade + 2], [800, grade + 2]], { grass: false, topsoil: false });
    out += asphalt(road, grade - 8);
    if (state === 'before') {
      out += rect(72, grade - 28, 656, 30, baseStone(id));
      out += rect(60, grade - 46, 12, 48, C.wood) + rect(728, grade - 46, 12, 48, C.wood);
      out += stakes(60, 728, grade - 2, grade - 2);
      return out;
    }
    out += rect(72, grade - 28, 668, 30, baseStone(id));
    out += poly([[60, grade - 48], [740, grade - 48], [740, grade - 8], [720, grade - 8], [720, grade - 28], [80, grade - 28], [80, grade - 8], [60, grade - 8]], C.concrete);
    for (const x of [280, 500]) out += rect(x - 1.5, grade - 48, 3, 10, C.concrete2);   // control joints
    void flat;
    return out;
  },

  finalgrade(state, id) {
    const wallW = 72;
    if (state === 'before') {
      const rough = [[wallW, 362], [190, 384], [250, 338], [320, 386], [420, 374], [470, 346], [560, 388], [700, 372], [800, 380]];
      return earth(rough, { grass: false, topsoil: false }) + house(0, wallW, 362) + debris(600, 384);
    }
    const grade = [[wallW, 350], [800, 392]];
    let out = earth(grade) + house(0, wallW, 350);
    const drive = cut(grade, 600, 800);
    out += poly(between(drive, shift(drive, 12)), crusher(id));
    return out;
  },

  dirtgravel(state, id) {
    const flat = [[0, 388], [800, 388]];
    let out = earth(flat, { grass: false });
    const pile = [[40, 388], [120, 300], [220, 262], [330, 300], [400, 388]];
    out += poly(pile, baseStone(id));
    out += poly([[380, 388], [800, 388], [800, 370], [400, 372]], crusher(id));
    return out;
  },
};

// ---------- the homepage opening: the ground in cross-section, dark, until a hero photo exists ----------
// 1600x900, anchored bottom-right so a phone crop keeps the trench. Quiet on purpose: the headline carries the page.
export function heroScene() {
  const W2 = 1600, H2 = 900;
  const ground = [[0, 600], [260, 588], [520, 604], [800, 582], [1100, 568], [1350, 576], [1600, 560]];
  const dn = (a, dy) => a.map(([x, y]) => [x, y + dy]);
  const bottom = a => [...a, [a.at(-1)[0], H2 + 40], [a[0][0], H2 + 40]];
  const ridge = (pts, fill) => poly([...pts, [W2, 700], [0, 700]], fill);
  const tx0 = 1010, tx1 = 1190, tdepth = 250;                       // the French drain trench
  const gy = at(ground, 1100);
  let out = rect(0, 0, W2, H2, '#1B2225');
  // two ridgelines far off, the way the land lies around Chattanooga
  out += ridge([[0, 470], [180, 440], [380, 470], [620, 420], [860, 462], [1100, 430], [1340, 468], [1600, 436]], '#212A2D');
  out += ridge([[0, 530], [240, 505], [520, 535], [780, 500], [1060, 528], [1320, 508], [1600, 530]], '#1D2528');
  // strata: topsoil, subsoil, red clay
  out += poly(bottom(dn(ground, 0)), '#553C30');
  out += poly(between(ground, dn(ground, 190)), '#463B2F');
  out += poly(between(ground, dn(ground, 34)), '#3A3329');
  for (const d of [70, 120, 190]) out += line(dn(ground, d), '#000', 2, 'opacity=".18"');
  // the trench cut into it: void, stone bed, pipe, stone cover
  const trench = [[tx0, gy - 4], [tx1, gy - 4], [tx1 - 14, gy + tdepth], [tx0 + 14, gy + tdepth]];
  out += poly(trench, '#161B1D');
  out += `<defs><pattern id="hs" width="20" height="14" patternUnits="userSpaceOnUse"><rect width="20" height="14" fill="#4B4C46"/><circle cx="5" cy="4" r="2.3" fill="#62635B"/><circle cx="14" cy="10" r="2" fill="#383A35"/></pattern></defs>`;
  out += poly([[tx0 + 14, gy + 44], [tx1 - 14, gy + 44], [tx1 - 14, gy + tdepth], [tx0 + 14, gy + tdepth]], 'url(#hs)');
  out += poly([[tx0 + 3, gy + 4], [tx1 - 3, gy + 4], [tx1 - 13, gy + 44], [tx0 + 13, gy + 44]], '#2E2A24');
  out += circle((tx0 + tx1) / 2, gy + 150, 30, '#E9E6DA', 'stroke="#161B1D" stroke-width="4"');
  for (let a = 0; a < 6; a++) { const t = a * Math.PI / 3 + 0.4; out += circle((tx0 + tx1) / 2 + Math.cos(t) * 19, gy + 150 + Math.sin(t) * 19, 2.6, '#161B1D'); }
  // the grade line, in the logo's olive
  out += line(ground, '#72852E', 7);
  // survey stakes and a string line
  for (const sx of [760, 880, 1290]) { const sy = at(ground, sx); out += rect(sx - 4, sy - 84, 8, 84, '#8A7452') + rect(sx - 4, sy - 84, 8, 20, '#A3B654'); }
  out += line([[760, at(ground, 760) - 72], [880, at(ground, 880) - 72]], '#A3B654', 2, 'opacity=".8"');
  return `<svg class="dgm dgm-hero" viewBox="0 0 ${W2} ${H2}" preserveAspectRatio="xMaxYMax slice" role="img" aria-label="Cross-section of the ground: topsoil, subsoil and red clay, with a stone-filled French drain trench and perforated pipe, and survey stakes along the finished grade.">${out}</svg>`;
}

let uid = 0;
export function diagram(name, state = 'after', opts = {}) {
  const fn = scenes[name];
  if (!fn) throw new Error(`No diagram called "${name}". Have: ${Object.keys(scenes).join(', ')}`);
  const id = `d${name}${state}${++uid}`;
  const body = fn(state, id, opts);
  const label = opts.label || `${state === 'before' ? 'Before: ' : state === 'progress' ? 'In progress: ' : ''}${SCENES[name]}`;
  return `<svg class="dgm" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" role="img" aria-label="${label.replace(/"/g, '&quot;')}">${gravelDefs(id)}<rect width="${W}" height="${H}" fill="${C.air}"/><g transform="translate(0 -72)">${body}</g></svg>`;
}
export const hasBefore = name => ['driveway', 'pad', 'drainage', 'cleanup', 'siteprep', 'concrete', 'finalgrade'].includes(name);
