// Builds the TVIS website into dist/.
// - Pages in src/pages/*.html get the shared header, footer and head (src/partials).
// - Business details come from site.config.json; empty values show as yellow [PLACEHOLDERS].
// - Job folders in projects/ become the gallery: photos are resized, compressed and
//   stripped of GPS/camera data, and the project cards are written into the pages.
// - Site photos dropped into photos/site/ replace the labeled placeholder blocks.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { diagram, hasBefore, heroScene } from './diagrams.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, ''); // e.g. "/TVIS-Site-Work" before the custom domain is set
const config = JSON.parse(await fs.readFile(path.join(ROOT, 'site.config.json'), 'utf8'));
// "https://tvisconstruction.com" once site.config.json > domain is filled; empty until then
const siteOrigin = config.domain ? `https://${config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : '';
const YEAR = new Date().getFullYear();

// ---------- security: only accept safe values from site.config.json ----------
// Links must be https:// (never javascript: or http:), and tracking IDs must look like real IDs, because they are
// written straight into the pages' markup and scripts. A value that fails is left out and the build says why.
for (const k of ['facebook', 'instagram', 'googleBusinessProfile', 'formEndpoint']) {
  if (typeof config[k] === 'string' && config[k].trim() && !/^https:\/\/[^\s"'<>`]+$/i.test(config[k].trim())) {
    console.warn(`  ! site.config.json > ${k} must be a full https:// address; left out: ${config[k]}`);
    config[k] = '';
  }
}
{
  const t = config.tracking || {};
  const ID = { googleAnalyticsId: /^G-[A-Z0-9]{4,20}$/, googleAdsId: /^AW-\d{6,15}$/, googleAdsLeadLabel: /^[A-Za-z0-9_-]{4,40}$/, metaPixelId: /^\d{8,20}$/ };
  for (const [k, re] of Object.entries(ID)) {
    if (t[k] && !re.test(String(t[k]).trim())) { console.warn(`  ! site.config.json > tracking > ${k} doesn't look like a real ID; left out: ${t[k]}`); t[k] = ''; }
    else if (t[k]) t[k] = String(t[k]).trim();
  }
  config.tracking = t;
}
// JSON-LD inside <script>: escape "<" so text such as "</script>" in a project write-up can never end the tag early
const ldJson = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export const CATEGORIES = ['Driveways', 'Shed & Garage Pads', 'Drainage', 'New Construction Sitework', 'Concrete', 'Property Cleanup', 'Home Construction'];
const PHOTO_EXT = /\.(jpe?g|png|webp)$/i;
const WIDTHS = [480, 720, 960, 1200, 1600];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = s => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const tbd = label => `<span class="tbd">[${esc(label)}]</span>`;

// ---------- business details ----------
const digits = (config.phone || '').replace(/\D/g, '');
const tel = digits ? `tel:+${digits.length === 10 ? '1' + digits : digits}` : '';
const filled = k => typeof config[k] === 'string' && config[k].trim() !== '';
// launch mode: a blank optional detail is left out rather than shown as a yellow [PLACEHOLDER]
const LIVE = config.launchMode === true;
const show = (k, label) => (filled(k) ? esc(config[k]) : tbd(label));
const texts = config.phoneTakesTexts === true && digits !== '';
const sms = texts ? tel.replace('tel:', 'sms:') : '';
// "Call", "Call or text", "Call Jeremy", "Call or text Jeremy": the name only shows once it's filled in
const talk = (texts ? 'Call or text' : 'Call') + (filled('ownerFirstName') ? ` ${esc(config.ownerFirstName)}` : '');

// "1329 Gadd Rd, Hixson, TN 37343": the same string everywhere, to match the Google Business Profile
function addressLine(sep = ', ') {
  const cityLine = [config.addressCity, [config.addressState, config.postalCode].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  return [config.streetAddress, cityLine].filter(Boolean).map(esc).join(sep);
}

const vars = {
  name: esc(config.name),
  tagline: esc(config.tagline),
  phone: show('phone', 'PHONE'),
  phone_href: tel || '/estimate#contact',
  email: filled('email') ? `<a href="mailto:${esc(config.email)}">${esc(config.email)}</a>` : (LIVE ? '' : tbd('EMAIL')),
  email_footer: filled('email') ? `<span><a href="mailto:${esc(config.email)}">${esc(config.email)}</a></span>` : (LIVE ? '' : `<span>${tbd('EMAIL')}</span>`),
  email_dl: filled('email') ? `<div><dt>Email</dt><dd><a href="mailto:${esc(config.email)}">${esc(config.email)}</a></dd></div>` : (LIVE ? '' : `<div><dt>Email</dt><dd>${tbd('EMAIL')}</dd></div>`),
  base: show('baseLocation', 'CITY, TN'),
  service_area: show('serviceArea', 'TOWNS AND COUNTIES'),
  service_towns: show('serviceTowns', 'TOWNS AND COUNTIES'),
  // the same towns as a list (one item per town or county); the yellow placeholder stays a paragraph until Joey fills them in
  service_towns_block: filled('serviceTowns')
    ? `<ul class="towns">${config.serviceTowns.split(/,\s*|\s+and\s+/).map(t => t.trim()).filter(Boolean).map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
    : `<p class="towns">${show('serviceTowns', 'TOWNS AND COUNTIES')}</p>`,
  hours: show('hours', 'HOURS'),
  // hours are optional (Jeremy: not important); the line simply disappears while blank
  hours_footer: filled('hours') ? `<p>${esc(config.hours)}</p>` : '',
  hours_dl: filled('hours') ? `<div><dt>Hours</dt><dd>${esc(config.hours)}</dd></div>` : '',
  licensed_inline: filled('licensedLine') ? esc(config.licensedLine) : (LIVE ? '' : tbd('LICENSED AND INSURED LINE')),
  licensed: filled('licensedLine') ? `<p class="licensed">${esc(config.licensedLine)}</p>` : (LIVE ? '' : `<p class="licensed">${tbd('LICENSED AND INSURED LINE')}</p>`),
  response_time: show('responseTime', '1 BUSINESS DAY'),
  // "We'll get back to you within 1 business day." once a response time is promised; a plain line until then
  response_line: filled('responseTime') ? `We&rsquo;ll get back to you within ${esc(config.responseTime)}.` : (LIVE ? `We&rsquo;ll be in touch soon.` : `We&rsquo;ll get back to you within ${tbd('1 BUSINESS DAY')}.`),
  facebook: esc(config.facebook || '#facebook-url-needed'),
  instagram: esc(config.instagram || '#instagram-url-needed'),
  gbp: esc(config.googleBusinessProfile || '#google-business-profile-url-needed'),
  // the street address, exactly as the Google Business Profile shows it; links to the profile once its URL is in
  address_footer: filled('streetAddress') ? `<span>${config.googleBusinessProfile
    ? `<a href="${esc(config.googleBusinessProfile)}">${addressLine('<br>')}</a>`
    : addressLine('<br>')}</span>` : '',
  address_dl: filled('streetAddress') ? `<div><dt>Address</dt><dd>${addressLine()}</dd></div>` : '',
  // "Leave us a Google review": only once site.config.json > googleReviewUrl has the profile's review link
  review_footer: config.googleReviewUrl ? `<a href="${esc(config.googleReviewUrl)}">Leave us a Google review</a>` : '',
  review_link: config.googleReviewUrl ? `<a class="textlink" href="${esc(config.googleReviewUrl)}">Leave a review</a>` : '',
  // the small social marks in the header, footer and estimate page: shown only once the URL exists (always while building)
  fb_icon: config.facebook || !LIVE ? `<a href="${esc(config.facebook || '#facebook-url-needed')}" aria-label="${esc(config.name)} on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-fb"/></svg></a>` : '',
  // Instagram: TVIS has no account (Jeremy, 2026-11-05), so no mark at all while site.config.json > instagram is blank;
  // put the profile URL there one day and the linked mark comes back in the header, menu, footer and estimate card
  ig_icon: config.instagram ? `<a href="${esc(config.instagram)}" aria-label="${esc(config.name)} on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-ig"/></svg></a>` : '',
  // Google: a plain mark (not a link) until site.config.json > googleBusinessProfile is filled, then a link
  gbp_icon: config.googleBusinessProfile ? `<a href="${esc(config.googleBusinessProfile)}" aria-label="${esc(config.name)} on Google"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-g"/></svg></a>` : `<span class="soc-soon" role="img" aria-label="${esc(config.name)} on Google, coming soon" title="Google profile coming soon"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-g"/></svg></span>`,
  form_endpoint: esc(config.formEndpoint || ''),
  // Shown above the form until site.config.json > formEndpoint is filled, so requests never vanish silently
  form_notice: config.formEndpoint ? '' : `<p class="form-off" role="note"><b>The request form is being set up.</b> For now, call ${tel ? `<a href="${tel}" data-track="call">${esc(config.phone)}</a>` : tbd('PHONE')} or message us on <a href="${esc(config.facebook || '#facebook-url-needed')}">Facebook</a> and we'll take it from there.${LIVE ? '' : ' <small>(Site owner: add the Basin endpoint to site.config.json &gt; formEndpoint.)</small>'}</p>`,
  talk,
  talk_who: texts || filled('ownerFirstName') ? `<p class="talk-who">${talk}</p>` : '',
  text_link: texts ? `<a class="text-link" href="${sms}" data-track="call">Text ${esc(config.phone)}</a>` : '',
  // which sections are olive or charcoal fields (the header takes their ink while they are under it)

  mbar_text: texts ? `<a class="mbar-text" href="${sms}" data-track="call"><svg aria-hidden="true" viewBox="0 0 24 24"><use href="#i-text"/></svg>Text</a>` : '',
  year: String(YEAR),
};
if (digits) vars.form_notice = vars.form_notice.replace('<span class="tbd">[PHONE]</span>', `<a href="${tel}" data-track="call">${esc(config.phone)}</a>`);

// ---------- images ----------
async function newer(src, out) {
  if (!existsSync(out)) return false;
  const [a, b] = await Promise.all([fs.stat(src), fs.stat(out)]);
  return b.mtimeMs >= a.mtimeMs;
}

// Opening photos Jeremy judged soft on a desktop screen: their desktop-size files (960px and up) get a light
// sharpen and higher quality. Phone sizes stay as they are, so phone page weight and Lighthouse don't move.
const CRISP = new Set(['homeowners-hero', 'builders-hero', 'more-hero', 'home-hero']);

// Photos drawn wider than 1000px on a desktop (the home hero fills about 72% of the screen) also get a file at their full
// size (up to 2400px), so Retina laptops and big monitors get a sharp picture. Phones never ask for it.
const XL = new Set(['home-hero']);

// Resize one photo to webp at several widths; returns {srcset, src, w, h}.
// A light grade baked into named site photos at build time (the original in photos/site stays untouched):
// a touch more brightness, colour and contrast, then a mild sharpen. Used 2026-11-03 to 2026-11-07 for the old home hero
// (IMG_8314, shot under an overcast sky); the hero photo since then needs none. Example entry:
// 'home-hero': { brightness: 1.03, saturation: 1.14, contrast: [1.10, -12], sharpen: 0.8 }
const GRADE = {};
async function processPhoto(src, outDir, baseName) {
  await fs.mkdir(outDir, { recursive: true });
  const meta = await sharp(src).rotate().metadata();
  // .rotate() applies the phone's orientation; width/height may be swapped
  const rotated = (meta.orientation || 1) >= 5;
  const fullW = rotated ? meta.height : meta.width, fullH = rotated ? meta.width : meta.height;
  const widths = WIDTHS.filter(w => w < fullW).concat(fullW > WIDTHS.at(-1) ? [] : [fullW]);
  if (XL.has(baseName) && fullW > WIDTHS.at(-1)) widths.push(Math.min(fullW, 2400));
  const out = [];
  for (const w of widths.length ? widths : [fullW]) {
    const file = `${baseName}-${w}.webp`;
    const dest = path.join(outDir, file);
    if (!(await newer(src, dest))) {
      // sharp drops EXIF (including GPS) unless .withMetadata() is called, so location data never ships
      let img = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
      const grade = GRADE[baseName];
      if (grade) { img = img.modulate({ brightness: grade.brightness, saturation: grade.saturation }).linear(grade.contrast[0], grade.contrast[1]); if (w >= 960) img = img.sharpen({ sigma: grade.sharpen }); }
      const crisp = CRISP.has(baseName) && w >= 960;
      if (crisp) img = img.sharpen({ sigma: 0.7, m1: 0.6, m2: 2 });
      await img.webp({ quality: crisp ? 82 : 70 }).toFile(dest);
    }
    out.push({ file, w });
  }
  const largest = out.at(-1);
  const rel = path.relative(DIST, outDir).split(path.sep).join('/');
  return {
    src: `/${rel}/${out.find(o => o.w >= 960)?.file || largest.file}`,
    srcset: out.map(o => `/${rel}/${o.file} ${o.w}w`).join(', '),
    w: largest.w,
    h: Math.round(largest.w * fullH / fullW),
  };
}

const imgTag = (p, alt, { sizes = '100vw', eager = false, cls = '' } = {}) =>
  `<img${cls ? ` class="${cls}"` : ''} src="${p.src}" srcset="${p.srcset}" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;

// Site photos: photos/site/<slot>.jpg replaces the placeholder block for that slot.
const sitePhotos = {};
async function loadSitePhotos() {
  const dir = path.join(ROOT, 'photos', 'site');
  if (!existsSync(dir)) return;
  for (const f of await fs.readdir(dir)) {
    if (!PHOTO_EXT.test(f)) continue;
    const slot = f.replace(PHOTO_EXT, '');
    sitePhotos[slot] = await processPhoto(path.join(dir, f), path.join(DIST, 'img', 'site'), slugify(slot));
  }
}

// The note on an empty slot is hidden until the page is opened with ?slots (site.js adds body.show-slots),
// so Jeremy can see which file name each spot wants without placeholder boxes on the live site.
const slotNote = (slot, label) => `<span class="slot-note" hidden>photos/site/${esc(slot)}.jpg: ${esc(label)}</span>`;

function photoBlock(attrs) {
  const { slot, label = '', alt = label, sizes = '100vw', eager, kind = 'Photo', draw } = attrs;
  const p = sitePhotos[slot];
  if (p) return `<div class="photo" data-slot="${esc(slot)}">${imgTag(p, alt, { sizes, eager: eager !== undefined })}</div>`;
  if (draw === 'hero') return `<div class="photo photo-drawn photo-hero">${heroScene()}${slotNote(slot, label)}</div>`;
  if (draw) { const [name, state] = draw.split(':'); return `<div class="photo photo-drawn">${diagram(name, state || 'after')}${slotNote(slot, label)}</div>`; }
  // no photo and no drawing: the spot disappears from the page until the file exists
  return `<div class="photo photo-empty" hidden>${slotNote(slot, label)}</div>`;
}

// Before/after pair for a fixed spot: photos/site/<slot>-before.jpg and <slot>-after.jpg.
// Until both exist, shows the slider with labeled placeholder halves.
// Until both photos exist, a slot that names a drawing shows the drawn before and after instead,
// so the compare slider works from day one. With neither, the slot is hidden.
function baBlock(attrs) {
  const { slot, before = '', after = '', alt = '', sizes = '(min-width: 900px) 55vw, 100vw', draw } = attrs;
  const b = sitePhotos[`${slot}-before`], a = sitePhotos[`${slot}-after`];
  const notes = slotNote(`${slot}-before`, before) + slotNote(`${slot}-after`, after);
  if (!(b && a)) {
    if (!draw || !hasBefore(draw)) return `<div class="ba ba-empty" hidden>${notes}</div>`;
    return `<div class="ba ba-drawn" data-ba>
  <div class="ba-img ba-before">${diagram(draw, 'before')}</div>
  <div class="ba-img ba-after">${diagram(draw, 'after')}</div>
  <span class="ba-tag ba-tag-b">Before</span><span class="ba-tag ba-tag-a">After</span>
  <span class="ba-handle" aria-hidden="true"></span>
  <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare the drawn before and after: ${esc(alt || after)}">
  ${notes}
</div>`;
  }
  const half = (p, kind, label, cls) => `<div class="ba-img ${cls}">${imgTag(p, `${kind}: ${alt || label}`, { sizes })}</div>`;
  return `<div class="ba" data-ba>
  ${half(b, 'Before', before, 'ba-before')}
  ${half(a, 'After', after, 'ba-after')}
  <span class="ba-tag ba-tag-b">Before</span><span class="ba-tag ba-tag-a">After</span>
  <span class="ba-handle" aria-hidden="true"></span>
  <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after photos: ${esc(alt || after)}">
</div>`;
}

// ---------- gallery ----------
function parseProjectTxt(txt) {
  const out = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z ]+?)\s*:\s*(.*)$/);
    if (m) out[m[1].toLowerCase().trim()] = m[2].trim();
  }
  return out;
}

async function loadProjects() {
  const dir = path.join(ROOT, 'projects');
  if (!existsSync(dir)) return [];
  const projects = [];
  for (const folder of (await fs.readdir(dir)).sort()) {
    const pdir = path.join(dir, folder);
    if (!(await fs.stat(pdir)).isDirectory() || folder.startsWith('_')) continue;
    const txtFile = path.join(pdir, 'project.txt');
    if (!existsSync(txtFile)) { console.warn(`  ! ${folder}: no project.txt, skipped`); continue; }
    const info = parseProjectTxt(await fs.readFile(txtFile, 'utf8'));
    const files = (await fs.readdir(pdir)).filter(f => PHOTO_EXT.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    // Built photo files are named after the job and town (yard-drainage-and-rock-lined-swale-harrison-after-1-960.webp),
    // so the file name tells Google what the photo shows. The photos in the project folder keep their simple names.
    const photoName = slugify(`${info.title || folder} ${info.town && !info.town.startsWith('[') ? info.town : ''}`);
    const photos = { before: [], progress: [], after: [] };
    for (const f of files) {
      const kind = (f.match(/^(before|progress|after)/i) || [])[1]?.toLowerCase();
      if (!kind) { console.warn(`  ! ${folder}/${f}: name must start with before-, progress- or after-`); continue; }
      const p = await processPhoto(path.join(pdir, f), path.join(DIST, 'gallery', folder), `${photoName}-${f.replace(PHOTO_EXT, '').toLowerCase()}`);
      photos[kind].push({ ...p, file: path.join(pdir, f) });
    }
    let category = CATEGORIES.find(c => c.toLowerCase() === (info.category || '').toLowerCase());
    if (!category) { console.warn(`  ! ${folder}: category "${info.category}" is not one of: ${CATEGORIES.join(', ')}`); category = 'Property Cleanup'; }
    const statusRaw = (info.status || '').toLowerCase();
    const status = statusRaw.startsWith('complete') ? 'Completed' : statusRaw.startsWith('in') ? 'In Progress' : (photos.after.length ? 'Completed' : 'In Progress');
    projects.push({
      id: folder,
      title: info.title || folder,
      category,
      categorySlug: slugify(category),
      town: info.town || '',
      status,
      featured: /^y/i.test(info.featured || ''),
      description: (info.description || info.about || '').replace(/^\[CONFIRM\]\s*/i, m => (LIVE ? '' : m)),
      // A Google review this customer left about this job, copied exactly (optional). The quote shows on the
      // project page and in the homepage reviews section, linked to the profile. Never edit or invent one.
      review: (info.review || '').replace(/^["\u201C]+|["\u201D]+$/g, '').trim(),
      reviewer: info.reviewer || '',
      date: folder.slice(0, 7),
      photos,
    });
  }
  projects.sort((a, b) => (b.featured - a.featured) || b.id.localeCompare(a.id));
  return projects;
}

function baSlider(p, sizes, eager = false) {
  const b = p.photos.before[0], a = p.photos.after[0] || p.photos.progress.at(-1);
  const town = p.town && !p.town.startsWith('[') ? ` in ${p.town}, TN` : '';
  if (b && a) {
    return `<div class="ba" data-ba>
  <div class="ba-img ba-before">${imgTag(b, `Before: ${p.title}${town}`, { sizes, eager })}</div>
  <div class="ba-img ba-after">${imgTag(a, `After: ${p.title}${town}`, { sizes, eager })}</div>
  <span class="ba-tag ba-tag-b">Before</span><span class="ba-tag ba-tag-a">${p.photos.after[0] ? 'After' : 'Progress'}</span>
  <span class="ba-handle" aria-hidden="true"></span>
  <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after photos of ${esc(p.title)}">
</div>`;
  }
  const one = a || b;
  return one ? `<div class="ba ba-single">${imgTag(one, `${p.title}${town}`, { sizes, eager })}</div>` : '';
}

const townHtml = p => (p.town ? (p.town.startsWith('[') ? (LIVE ? '' : tbd(p.town.replace(/[\[\]]/g, ''))) : esc(p.town)) : '');
// Only a job that is still underway gets a chip; finished jobs just read "Town · Service".
const projectRow = p => `${p.status === 'In Progress' ? '<span class="badge badge-live">In Progress</span> ' : ''}<span>${townHtml(p) ? townHtml(p) + ' · ' : ''}${esc(p.category)}</span>`;

// Project type codes on the estimate form (keep in sync with data-type in src/partials/estimate-form.html)
// The service page that covers each project category; the project page links its category there.
const CATEGORY_PAGE = { 'Driveways': '/gravel-driveways', 'Shed & Garage Pads': '/shed-garage-pads', 'Drainage': '/drainage', 'New Construction Sitework': '/site-prep-excavation', 'Concrete': '/concrete', 'Property Cleanup': '/demolition-cleanup' };
const CATEGORY_TYPE = { 'Driveways': 'driveway', 'Shed & Garage Pads': 'pad', 'Drainage': 'drainage', 'New Construction Sitework': 'siteprep', 'Concrete': 'concrete', 'Property Cleanup': 'cleanup', 'Home Construction': 'home' };

// Body of the project detail page at /project/<folder>: every photo, grouped, plus the estimate button.
// The slider asks for 96vw on phones (it is drawn at 100vw): on most phones that picks the same file as the gallery
// photo of the same job below it, so each photo downloads once instead of twice at two sizes.
// A project with no before photo: true opens the page with the job's best photo on the right (where the slider would
// sit); false keeps the band to words only (title left, write-up and buttons right, lined up; the .pd-open rules).
// Jeremy picked the words-only band (2026-11-03) over the photo, so this stays false.
const PROJECT_OPEN_PHOTO = false;
function projectDetail(p, next) {
  const town = p.town && !p.town.startsWith('[') ? ` in ${p.town}, TN` : '';
  // Gallery tiles, matched by the .pd-grid rules in site.css. Every row is full: no photo count leaves an empty cell.
  // Desktop (six-column grid): 1 photo runs the full width at 16:9; 2 or 4 sit two across; 3 or more lead with a big
  // photo (two thirds wide, two rows tall) beside two thirds, then the rest go three across, finishing with pairs
  // when a row of three would leave a gap. Tablets and phones (two columns): an odd count leads with one full-width
  // photo; 2 or 4 sit two across; 6 or more open and close with a full-width photo. Two photos stack on phones only.
  // Each tile asks for a file as wide as it is drawn (content width 1208px from 1440px up).
  const galleryLayout = n => {
    if (n < 2) return n ? ['full'] : [];
    if (n === 2 || n === 4) return Array(n).fill('half');
    const rest = n - 3, tail = rest % 3 === 1 ? ['half', 'half', 'half', 'half'] : rest % 3 === 2 ? ['half', 'half'] : [];
    return ['lead', 'third', 'third', ...Array(rest - tail.length).fill('third'), ...tail];
  };
  const DESK = { full: '(min-width: 1440px) 1210px, (min-width: 900px) 92vw', lead: '(min-width: 1440px) 800px, (min-width: 900px) 62vw', half: '(min-width: 1440px) 600px, (min-width: 900px) 46vw', third: '(min-width: 1440px) 400px, (min-width: 900px) 31vw' };
  const tile = (n, i, d) => {
    const full = n === 1 || (n % 2 === 1 && i === 0) || (n % 2 === 0 && n >= 6 && (i === 0 || i === n - 1));
    const small = full ? 'calc(100vw - 40px)' : n === 2 ? '(min-width: 601px) 46vw, calc(100vw - 40px)' : '46vw';
    return { cls: `pd-photo g-${d}${full ? ' t-full' : ''}`, sizes: `${DESK[d]}, ${small}` };
  };
  // Without a before/after slider at the top, the first gallery photo is the biggest thing on the first screen,
  // so it loads right away (not lazily) and first: Google measures how fast that photo appears.
  const slider = p.photos.before.length && (p.photos.after.length || p.photos.progress.length);
  // No before photo to pair up: the job's best photo (the same one its card shows) opens the page on the right, where
  // the slider would sit, so every project page opens the same way: title on the left, the job on the right. That
  // photo leaves its group below (no repeat) but stays first in the photo viewer.
  const hero = slider || !PROJECT_OPEN_PHOTO ? null : (p.photos.after[0] || p.photos.progress.at(-1) || p.photos.before[0] || null);
  const heroLabel = hero ? (p.photos.after[0] === hero ? 'after' : p.photos.before[0] === hero ? 'before' : 'in progress') : '';
  let firstTile = !slider && !hero;
  const group = (kind, label) => {
    const list = p.photos[kind].filter(ph => ph !== hero), lay = galleryLayout(list.length);
    return list.length ? `<section class="pd-group" aria-labelledby="pd-${kind}">
  <h2 id="pd-${kind}">${label}</h2>
  <div class="pd-grid">${list.map((ph, i) => { const t = tile(list.length, i, lay[i]); const eager = firstTile; firstTile = false; return `<a class="${t.cls}" href="${ph.srcset.split(', ').at(-1).split(' ')[0]}">${imgTag(ph, `${p.title}${town}, ${label.toLowerCase()} (photo ${i + 1} of ${list.length})`, { sizes: t.sizes, eager })}</a>`; }).join('')}</div>
</section>` : '';
  };
  const who = p.category === 'New Construction Sitework' ? '&amp;who=builder' : '';
  const estimate = `/estimate?type=${CATEGORY_TYPE[p.category] || 'other'}${who}`;
  // The opening: the same warm band as the main pages, with the before/after slider framed on the right (desktop)
  const openingPhoto = slider ? `<div class="pd-ba">${baSlider(p, '(min-width: 1440px) calc(50vw - 36px), (min-width: 900px) 52vw, 96vw', true)}</div>`
    : hero ? `<div class="pd-ba"><div class="ba ba-single"><a class="pd-photo" href="${hero.srcset.split(', ').at(-1).split(' ')[0]}">${imgTag(hero, `${p.title}${town}, ${heroLabel}`, { sizes: '(min-width: 1440px) calc(50vw - 36px), (min-width: 900px) 52vw, 96vw', eager: true })}</a></div></div>` : '';
  const nextPhoto = next && (next.photos.after[0] || next.photos.progress.at(-1) || next.photos.before[0]);
  const nextJob = next && next.id !== p.id ? `<a class="pd-next" href="/project/${next.id}">
        ${nextPhoto ? `<span class="pd-next-pic">${imgTag(nextPhoto, '', { sizes: '140px' })}</span>` : ''}
        <span class="pd-next-text"><span class="pd-next-k">Next job</span><span class="pd-next-t">${esc(next.title)}</span><span class="pd-next-row">${townHtml(next) ? townHtml(next) + ' · ' : ''}${esc(next.category)}</span></span>
        <svg class="pd-next-arrow" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"/></svg>
      </a>` : '';
  return `<section class="pd-open${openingPhoto ? ' pd-open-ba' : ''}">
  <div class="wrap pd-top">
    <header class="pd-head">
      <p class="crumb"><a href="/projects"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"/></svg>All projects</a></p>
      <h1>${esc(p.title)}</h1>
      <p class="proj-row">${CATEGORY_PAGE[p.category] ? projectRow(p).replace(`${esc(p.category)}</span>`, `<a href="${CATEGORY_PAGE[p.category]}">${esc(p.category)}</a></span>`) : projectRow(p)}</p>
      <div class="pd-words">
        ${p.description ? `<p class="pd-desc">${esc(p.description)}</p>` : ''}
        <div class="hero-act"><a class="btn btn-primary" href="${estimate}">Get an Estimate</a><a class="hero-call" href="{{phone_href}}" data-track="call">Call us</a></div>
      </div>
    </header>
    ${openingPhoto}
  </div>
</section>
<section class="sec pd">
  <div class="wrap">
    ${group('before', 'Before')}${group('progress', 'In progress')}${group('after', 'After')}
    ${p.review ? `<section class="pd-rev" aria-labelledby="pd-rev-h"><h2 id="pd-rev-h">What the customer said</h2>${reviewQuote(p)}</section>` : ''}
    ${reviewUrl() ? `<p class="pd-ask">Was this your job? <a href="${reviewUrl()}">Tell others how it went on Google</a>.</p>` : ''}
    <div class="pd-cta">
      <a class="btn btn-primary" href="${estimate}">Get an Estimate for a job like this</a>
      <a class="call-link" href="{{phone_href}}" data-track="call"><svg aria-hidden="true" viewBox="0 0 24 24"><use href="#i-phone"/></svg>Or call us</a>
    </div>
    <div class="pd-more">
      ${nextJob}
      <span class="pd-share-wrap"><button class="pd-share" type="button" data-share hidden><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 13v7h14v-7"/></svg>Share this job</button></span>
    </div>
  </div>
</section>`;
}

// ---------- reviews ----------
// Real Google reviews, tied to the job they are about (project.txt > review: and reviewer:). No review schema:
// Google ignores reviews a business shows about itself, and marking them up can count against the site.
const reviewUrl = () => (config.googleReviewUrl ? '/review' : '');
function reviewQuote(p, { job = false } = {}) {
  if (!p.review) return '';
  const who = [esc(p.reviewer || 'Google review'), job ? townHtml(p) : ''].filter(Boolean).join(', ');
  return `<figure class="rev">
  <blockquote><p>${esc(p.review)}</p></blockquote>
  <figcaption><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-g"/></svg><span>${who}</span>${job ? `<a href="/project/${p.id}">See the job</a>` : ''}</figcaption>
</figure>`;
}
// The homepage section: every project with a review, newest first. Hidden until the first one is in.
function homeReviews() {
  const list = projects.filter(p => p.review).sort((a, b) => b.id.localeCompare(a.id)).slice(0, 6);
  if (!list.length) return '';
  return `<section class="sec reviews" aria-labelledby="rev-h">
  <div class="wrap">
    <div class="sec-head"><h2 id="rev-h">What customers say</h2></div>
    <div class="rev-grid">
${list.map(p => reviewQuote(p, { job: true })).join('\n')}
    </div>
    <p class="rev-links">${config.googleBusinessProfile ? `<a class="textlink" href="${esc(config.googleBusinessProfile)}">Read all reviews on Google</a>` : ''}${reviewUrl() ? `<a class="textlink" href="${reviewUrl()}">Leave a review</a>` : ''}</p>
  </div>
</section>`;
}

function projectDescription(p) {
  const town = p.town && !p.town.startsWith('[') ? ` ${p.town}, TN.` : '';
  const desc = (p.description || `${p.category} job by TVIS Construction.`).trim().replace(/([^.!?])$/, '$1.');
  const photos = p.photos.before.length && (p.photos.after.length || p.photos.progress.length) ? ' See the before and after photos.' : ' See every photo from the job.';
  for (const d of [desc + town + photos, desc + photos, desc + town, desc]) if (d.length <= 160) return d;
  return desc.slice(0, 157).replace(/\s+\S*$/, '') + '...';
}

// sizes: one column under 600px (the card is the screen width less the gutters), two columns to 900px, three above
function projectCard(p, { sizes = '(min-width: 900px) 33vw, (min-width: 600px) 45vw, calc(100vw - 40px)', heading = 'h3', eager = false, wide = false } = {}) {
  const live = p.status === 'In Progress';
  return `<article class="proj${wide ? ' proj-wide' : ''}" data-category="${p.categorySlug}">
${baSlider(p, sizes, eager)}
<div class="proj-meta">
  <${heading} class="proj-title"><a href="/project/${p.id}">${esc(p.title)}</a></${heading}>
  <p class="proj-row">${projectRow(p)}</p>
  ${p.description ? `<p class="proj-desc">${esc(p.description)}</p>` : ''}
  <a class="proj-more" href="/project/${p.id}" aria-label="See all photos: ${esc(p.title)}">See all photos</a>
</div>
</article>`;
}

// Some file transfers stamp SVG markup (standalone .svg files and inline <svg> in partials/pages) with a
// signed content-credential manifest. It is harmless but bulky, so the build strips it before shipping.
const stripCredentials = s => s.replace(/ xmlns:c2pa="[^"]*"/g, '').replace(/<metadata>\s*<c2pa:manifest>[\s\S]*?<\/c2pa:manifest>\s*<\/metadata>/g, '');

// ---------- templating ----------
async function readPartial(name) {
  return stripCredentials(await fs.readFile(path.join(ROOT, 'src', 'partials', `${name}.html`), 'utf8'));
}

function parseAttrs(s) {
  const out = {};
  for (const m of s.matchAll(/([a-z_]+)(?:="([^"]*)")?/g)) out[m[1]] = m[2] ?? '';
  return out;
}

async function render(tpl, ctx, depth = 0) {
  if (depth > 6) throw new Error('Partials nested too deeply');
  // partials
  const parts = [...tpl.matchAll(/\{\{>\s*([\w-]+)\s*\}\}/g)];
  for (const m of parts) tpl = tpl.replace(m[0], await render(await readPartial(m[1]), ctx, depth + 1));
  // photo slots
  tpl = tpl.replace(/\{\{photo ([^}]*)\}\}/g, (_, a) => photoBlock(parseAttrs(a)));
  tpl = tpl.replace(/\{\{ba ([^}]*)\}\}/g, (_, a) => baBlock(parseAttrs(a)));
  tpl = tpl.replace(/\{\{diagram ([^}]*)\}\}/g, (_, a) => { const d = parseAttrs(a); return diagram(d.name, d.state || 'after', { animate: 'animate' in d, label: d.label }); });
  // simple values
  return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => (k in ctx ? ctx[k] : m));
}

function frontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return [{}, src];
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return [meta, src.slice(m[0].length)];
}

// Service pages: the jobs in that category, or nothing (the section is left out until one exists)
let projects = []; // filled in main() before pages render
function relatedProjects(cats) {
  if (!cats) return '';
  const want = cats.split(',').map(c => c.trim());
  const list = projects.filter(p => want.includes(p.categorySlug));
  if (!list.length) return '';
  return `<section class="sec svc-projects" aria-labelledby="svc-proj-h">
  <div class="wrap">
    <div class="sec-head"><h2 id="svc-proj-h">Recent ${list.length === 1 ? 'job' : 'jobs'} like this</h2><a class="textlink" href="/projects">See all projects</a></div>
    <div class="proj-grid${list.length === 1 ? ' proj-grid-one' : list.length === 2 ? ' proj-grid-two' : ''}">${list.slice(0, 3).map(p => projectCard(p, list.length === 1 ? { sizes: '(min-width: 900px) 60vw, (min-width: 600px) 45vw, calc(100vw - 40px)' } : list.length === 2 ? { sizes: '(min-width: 1440px) 600px, (min-width: 600px) 46vw, calc(100vw - 40px)' } : {})).join('\n')}</div>
  </div>
</section>`;
}

// The service area for Google, typed so each name maps to a real place: towns and cities as City, Chattanooga
// neighbourhoods and communities as Place, counties and regions as AdministrativeArea. Names come from
// site.config.json > serviceTowns; a town not listed here still goes out, as a plain Place.
const AREA_TYPES = {
  'Chattanooga': ['City', 'Chattanooga, TN'], 'Downtown': ['Place', 'Downtown Chattanooga, TN'], 'St. Elmo': ['Place', 'St. Elmo, Chattanooga, TN'],
  'Red Bank': ['City', 'Red Bank, TN'], 'Signal Mountain': ['City', 'Signal Mountain, TN'], 'Hixson': ['Place', 'Hixson, TN'],
  'Soddy-Daisy': ['City', 'Soddy-Daisy, TN'], 'Highway 58': ['Place', 'Highway 58, Chattanooga, TN'], 'Brainerd': ['Place', 'Brainerd, Chattanooga, TN'],
  'East Brainerd': ['Place', 'East Brainerd, TN'], 'East Ridge': ['City', 'East Ridge, TN'], 'Ooltewah': ['Place', 'Ooltewah, TN'],
  'Cleveland': ['City', 'Cleveland, TN'], 'Jasper': ['City', 'Jasper, TN'], 'Sequatchie County': ['AdministrativeArea', 'Sequatchie County, TN'],
  'North Georgia': ['AdministrativeArea', 'North Georgia'],
};
function areaServed() {
  const towns = filled('serviceTowns') ? config.serviceTowns.split(/,\s*|\s+and\s+/).map(t => t.trim()).filter(Boolean) : [];
  if (!towns.length) return [{ '@type': 'City', name: 'Chattanooga, TN' }];
  return towns.map(t => { const [type, name] = AREA_TYPES[t] || ['Place', t]; return { '@type': type, name }; });
}

// Service card for Google: what the page offers, who offers it, where
function serviceJsonLd(meta, urlPath) {
  const data = { '@context': 'https://schema.org', '@type': 'Service', name: meta.crumb || shortTitle(meta.title), description: meta.description || '',
    provider: { '@type': 'HomeAndConstructionBusiness', '@id': siteOrigin ? siteOrigin + '/#business' : undefined, name: config.name, telephone: digits ? tel.replace('tel:', '') : undefined, url: siteOrigin ? siteOrigin + '/' : undefined },
    areaServed: areaServed(), url: siteOrigin ? siteOrigin + urlPath : undefined };
  return ldJson(data);
}

// A page's short name for Google (breadcrumbs, Service card): the crumb: line in its front matter, else the title without the town and brand
const shortTitle = t => String(t || '').split(' | ')[0].split(/ in Chattanooga|, Chattanooga/)[0];

// Home > Projects > <project>: tells Google how the inner pages hang together
function breadcrumbs(urlPath, title, crumb) {
  if (!siteOrigin || urlPath === '/' ) return '';
  const crumbs = [{ name: 'Home', item: siteOrigin + '/' }];
  if (urlPath.startsWith('/project/')) crumbs.push({ name: 'Projects', item: siteOrigin + '/projects' });
  crumbs.push({ name: crumb || shortTitle(title), item: siteOrigin + urlPath });
  return ldJson({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })) });
}

// The site's name for Google, so results say "TVIS Construction" above the address instead of the bare domain
function websiteJsonLd() {
  if (!siteOrigin) return '';
  // @id ties the site to the business below, so Google reads them as one brand (helps the site name and sitelinks)
  return ldJson({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': siteOrigin + '/#website', name: config.name, alternateName: 'TVIS', url: siteOrigin + '/', publisher: { '@id': siteOrigin + '/#business' } });
}

function localBusinessJsonLd() {
  const site = config.domain ? `https://${config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : undefined;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': site ? site + '/#business' : undefined,
    name: config.name,
    slogan: config.tagline,
    description: 'Site prep and excavation, drainage and culverts, gravel and concrete driveways, pads for sheds and garages, concrete flat work and demolition for homeowners, builders and contractors in Chattanooga, TN and surrounding communities.',
    // matches the Google Business Profile; the city alone while streetAddress is empty
    address: filled('streetAddress')
      ? { '@type': 'PostalAddress', streetAddress: config.streetAddress, addressLocality: config.addressCity, addressRegion: config.addressState || 'TN', postalCode: config.postalCode, addressCountry: 'US' }
      : { '@type': 'PostalAddress', addressLocality: 'Chattanooga', addressRegion: 'TN', addressCountry: 'US' },
    areaServed: [{ '@type': 'City', name: 'Chattanooga, TN' }],
    knowsAbout: ['Site preparation', 'Excavation', 'Drainage', 'Culverts', 'Gravel driveways', 'Concrete driveways', 'Shed and garage pads', 'Concrete flat work', 'Demolition'],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Sitework services', itemListElement: [
      ['Site Prep & Excavation', '/site-prep-excavation'], ['Drainage & Culverts', '/drainage'], ['Driveways & Gravel Work', '/gravel-driveways'],
      ['Concrete & Flat Work', '/concrete'], ['Pads for Sheds & Garages', '/shed-garage-pads'], ['Demolition & Removal', '/demolition-cleanup'],
    ].map(([n, u]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n, url: (site || '') + u } })) },
  };
  if (site) { data.url = site + '/'; data.logo = site + '/assets/img/logo-512.png'; data.image = site + '/assets/img/og-image.jpg'; }
  if (digits) data.telephone = tel.replace('tel:', '');
  if (filled('email')) data.email = config.email;
  if (filled('hours')) data.openingHours = config.hours; // free text until real hours are set; see README
  // the towns Joey listed; "Chattanooga and the surrounding counties" alone adds nothing Google can map
  const towns = filled('serviceTowns') ? config.serviceTowns.split(/,\s*|\s+and\s+/) : [];
  if (towns.length) data.areaServed = areaServed();
  const same = [config.facebook, config.instagram, config.googleBusinessProfile].filter(Boolean);
  if (same.length) data.sameAs = same;
  // the map pin and the Maps listing, so Google ties this site to the Business Profile
  const g = config.geo || {};
  if (filled('streetAddress') && Number.isFinite(g.latitude) && Number.isFinite(g.longitude)) data.geo = { '@type': 'GeoCoordinates', latitude: g.latitude, longitude: g.longitude };
  if (config.googleBusinessProfile) data.hasMap = config.googleBusinessProfile;
  return ldJson(data);
}

function trackingHead() {
  const t = config.tracking || {};
  let out = '';
  const gtagIds = [t.googleAnalyticsId, t.googleAdsId].filter(Boolean);
  if (gtagIds.length) {
    out += `<script async src="https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${gtagIds.map(id => `gtag('config','${id}');`).join('')}</script>`;
  }
  if (t.metaPixelId) {
    out += `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${t.metaPixelId}');fbq('track','PageView');</script>`;
  }
  out += `<script>window.TVIS_TRACKING=${JSON.stringify({ adsId: t.googleAdsId || '', adsLeadLabel: t.googleAdsLeadLabel || '' })}</script>`;
  return out || '<!-- Tracking tags: add IDs in site.config.json > tracking -->';
}

// ---------- favicon + social image ----------
// A 1200x630 share preview (Facebook, Messenger, texts): the photo under a dark scrim with the white logo.
async function shareImage(srcPhoto, outFile) {
  const photo = await sharp(srcPhoto).rotate().resize(1200, 630, { fit: 'cover', position: 'centre' }).toBuffer();
  const ogLogo = await sharp(path.join(ROOT, 'src', 'assets', 'img', 'logo-reverse.svg'), { density: 300 }).resize({ width: 540 }).png().toBuffer();
  const lm = await sharp(ogLogo).metadata();
  const scrim = Buffer.from(`<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#121618" stop-opacity=".9"/><stop offset=".55" stop-color="#121618" stop-opacity=".45"/><stop offset="1" stop-color="#121618" stop-opacity=".05"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="0" y="606" width="1200" height="24" fill="#72852E"/></svg>`);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await sharp(photo).composite([{ input: scrim, left: 0, top: 0 }, { input: ogLogo, left: 64, top: 606 - 48 - lm.height }])
    .jpeg({ quality: 84 }).toFile(outFile);
}

// Each page shares with its own hero photo: the slot named in `og_photo:` in the front matter, else the
// photo in the page's opening section, else (project pages) the job's finished photo. Pages without a
// photo keep the default og-image.jpg. Built into dist/img/og/ (kept between builds, like the resized photos).
async function sharePhotoFor(meta, body) {
  let src = meta.og_src;
  if (!src) {
    const slot = meta.og_photo || (body.match(/class="phero-pic">\s*\{\{(?:photo|ba) slot="([^"]+)"/) || [])[1];
    if (!slot) return '';
    const f = existsSync(path.join(ROOT, 'photos', 'site')) ? (await fs.readdir(path.join(ROOT, 'photos', 'site'))).find(x => PHOTO_EXT.test(x) && x.replace(PHOTO_EXT, '') === slot) : null;
    if (!f) return '';
    src = path.join(ROOT, 'photos', 'site', f);
  }
  const name = slugify(path.basename(src).replace(PHOTO_EXT, '')) + '.jpg';
  const outFile = path.join(DIST, 'img', 'og', meta.og_src ? slugify(path.basename(path.dirname(src))) + '-' + name : name);
  if (!(await newer(src, outFile))) await shareImage(src, outFile);
  return '/' + path.relative(DIST, outFile).split(path.sep).join('/');
}

async function brandImages() {
  const out = path.join(DIST, 'assets', 'img');
  await fs.mkdir(out, { recursive: true });
  // Round badge, as on Joey's new artwork (NewLogo.jpg): the logo inside an olive and charcoal ring.
  // Used for the browser tab, phone home-screen icon and the logo Google shows.
  const logoSvg = stripCredentials(await fs.readFile(path.join(ROOT, 'src', 'assets', 'img', 'logo.svg'), 'utf8'));
  const inner = logoSvg.replace(/<svg[^>]*>/, '<svg x="90" y="275" width="820" height="393" viewBox="79 97 1619 776" preserveAspectRatio="xMidYMid meet">');
  const badgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><circle cx="500" cy="500" r="488" fill="#FFFFFF"/><circle cx="500" cy="500" r="478" fill="none" stroke="#72852E" stroke-width="22"/><circle cx="500" cy="500" r="461" fill="none" stroke="#232B2E" stroke-width="12"/>${inner}</svg>`;
  await fs.writeFile(path.join(out, 'logo-badge.svg'), badgeSvg);
  // The round badge stays the logo Google can show for the business (structured data).
  const square = await sharp(Buffer.from(badgeSvg), { density: 144 }).resize(1024, 1024).png().toBuffer();
  await sharp(square).resize(512, 512).png().toFile(path.join(out, 'logo-512.png'));
  // Browser tab, Google results and phone home screens use the square TVIS mark in src/assets/img/favicon.svg:
  // white TVIS (Barlow Condensed 800, as outlines) over an olive bar on charcoal, readable down to 16px.
  // Google asks for a square icon in multiples of 48px; favicon.ico at the site root covers older browsers.
  const mark = Buffer.from(stripCredentials(await fs.readFile(path.join(ROOT, 'src', 'assets', 'img', 'favicon.svg'), 'utf8')));
  const icon = size => sharp(mark, { density: 72 * size / 512 * 4 }).resize(size, size).png().toBuffer();
  for (const [name, size] of [['favicon-48.png', 48], ['favicon-96.png', 96], ['favicon-192.png', 192], ['favicon-512.png', 512], ['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
    await fs.writeFile(path.join(out, name), await icon(size));
  }
  const icoSizes = [16, 32, 48], pngs = await Promise.all(icoSizes.map(icon));
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach((png, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(icoSizes[i], e); head.writeUInt8(icoSizes[i], e + 1); head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(png.length, e + 8); head.writeUInt32LE(offset, e + 12); offset += png.length;
  });
  await fs.writeFile(path.join(DIST, 'favicon.ico'), Buffer.concat([head, ...pngs]));
  // Android home-screen shortcut: name and icon
  await fs.writeFile(path.join(DIST, 'site.webmanifest'), JSON.stringify({ name: config.name, short_name: 'TVIS', start_url: '/', display: 'browser', background_color: '#FFFFFF', theme_color: '#FFFFFF',
    icons: [{ src: '/assets/img/favicon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/img/favicon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 1));
  // Share preview (Facebook, Messenger, texts): the home-page jobsite photo under a dark scrim with the
  // white logo, or the logo on warm gray until photos/site/home-hero.jpg exists
  const heroPhoto = path.join(ROOT, 'photos', 'site', 'home-hero.jpg');
  const hasHero = await fs.access(heroPhoto).then(() => true, () => false);
  if (hasHero) {
    await shareImage(heroPhoto, path.join(out, 'og-image.jpg'));
  } else {
    const ogLogo = await sharp(path.join(ROOT, 'src', 'assets', 'img', 'logo.svg'), { density: 300 }).resize({ width: 900 }).png().toBuffer();
    const ogMeta = await sharp(ogLogo).metadata();
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#F3F2EE' } })
      .composite([{ input: ogLogo, left: 150, top: Math.round((630 - ogMeta.height) / 2) - 20 },
        { input: Buffer.from(`<svg width="1200" height="630"><rect x="0" y="606" width="1200" height="24" fill="#72852E"/></svg>`), left: 0, top: 0 }])
      .jpeg({ quality: 82 }).toFile(path.join(out, 'og-image.jpg'));
  }
}

// The date a page's own content last changed, from git history (YYYY-MM-DD), for <lastmod> in the sitemap.
// Only the page's source counts (its file in src/pages, or its project folder), not the shared header and footer,
// because Google trusts lastmod only when it marks a real change. Without full git history (a shallow clone) the
// dates would all be the same day, so lastmod is left out instead.
let gitHistory = null;
function lastChanged(paths) {
  if (gitHistory === null) {
    try { gitHistory = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: ROOT, encoding: 'utf8' }).trim() === 'false'; }
    catch { gitHistory = false; }
  }
  if (!gitHistory || !paths.length) return '';
  try {
    // uncommitted local edits are left out: the date is the last commit that touched these files
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch { return ''; }
}

// ---------- main ----------
async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const e of await fs.readdir(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.name.endsWith('.svg')) await fs.writeFile(d, stripCredentials(await fs.readFile(s, 'utf8')));
    else await fs.copyFile(s, d);
  }
}

const withBase = html => (BASE ? html.replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`).replace(/(srcset="[^"]*)/g, s => s.replace(/(^srcset="|, )\//g, `$1${BASE}/`)) : html);

const ASSET_VERSIONS = [];
// ---------- security: content security policy ----------
// GitHub Pages can't send security headers, so the policy rides in a <meta> tag on every page. It lets the browser run
// only this site's own script plus the exact inline snippets the build wrote (by their sha256 hash), load files only
// from this site, and send the form only to Basin. The Google and Meta addresses are added only once their IDs are set
// in site.config.json > tracking (the addresses those companies list for their tags).
function contentSecurityPolicy(html) {
  const t = config.tracking || {};
  const ga = !!(t.googleAnalyticsId || t.googleAdsId), ads = !!t.googleAdsId, meta = !!t.metaPixelId;
  const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
  // style="" attributes (the icon sprite's position:absolute) are allowed one by one, by hash
  const styleHashes = [...new Set([...html.matchAll(/\sstyle="([^"]*)"/g)].map(m => m[1]))].map(v => `'sha256-${createHash('sha256').update(v).digest('base64')}'`);
  const form = config.formEndpoint ? new URL(config.formEndpoint).origin : '';
  const src = {
    'default-src': ["'self'"],
    'script-src': ["'self'", ...new Set(hashes), ga && 'https://*.googletagmanager.com', ads && 'https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net', meta && 'https://connect.facebook.net'],
    'style-src': ["'self'", ...(styleHashes.length ? ["'unsafe-hashes'", ...styleHashes] : [])],
    'img-src': ["'self'", 'data:', 'blob:', ga && 'https://*.google-analytics.com https://*.googletagmanager.com', ads && 'https://*.google.com https://googleads.g.doubleclick.net https://*.g.doubleclick.net', meta && 'https://www.facebook.com'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", form, ga && 'https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com', ads && 'https://*.g.doubleclick.net https://*.google.com https://pagead2.googlesyndication.com https://www.googleadservices.com', meta && 'https://www.facebook.com https://connect.facebook.net'],
    'frame-src': ads ? ['https://td.doubleclick.net https://www.googletagmanager.com'] : ["'none'"],
    'form-action': ["'self'", form],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'worker-src': ["'none'"],
    'manifest-src': ["'self'"],
  };
  return Object.entries(src).map(([k, v]) => `${k} ${v.filter(Boolean).join(' ')}`).join('; ') + '; upgrade-insecure-requests';
}
const versionAssets = html => ASSET_VERSIONS.reduce((h, [a, b]) => h.split(a).join(b), html);

async function main() {
  const t0 = Date.now();
  await fs.mkdir(DIST, { recursive: true });
  for (const f of await fs.readdir(DIST)) if (!['gallery', 'img'].includes(f)) await fs.rm(path.join(DIST, f), { recursive: true, force: true }); // keep resized photos as a cache
  await copyDir(path.join(ROOT, 'src', 'assets'), path.join(DIST, 'assets'));
  // Version the stylesheet and script by their content, so a browser that cached an old copy
  // always fetches the new one when the pages change (otherwise new pages render with old styles).
  for (const f of ['site.css', 'site.js']) {
    const v = createHash('sha1').update(await fs.readFile(path.join(DIST, 'assets', f))).digest('hex').slice(0, 10);
    ASSET_VERSIONS.push([`/assets/${f}"`, `/assets/${f}?v=${v}"`]);
  }
  await brandImages();
  await loadSitePhotos();
  projects = await loadProjects();
  console.log(`  ${projects.length} project folder(s)`);

  await fs.writeFile(path.join(DIST, 'projects.json'), JSON.stringify(projects.map(p => ({ ...p, photos: Object.fromEntries(Object.entries(p.photos).map(([k, v]) => [k, v.map(x => x.src)])) })), null, 2));

  const recent = projects.slice(0, 3);
  const ctx = {
    ...vars,
    recent_projects: recent.length ? recent.map(p => projectCard(p)).join('\n') : '<p class="empty">Projects appear here once a job folder is added. See HOW-TO-ADD-A-PROJECT.md.</p>',
    // When the count leaves one card alone on the last desktop row (4, 7, 10...), the newest project runs the full
    // width at the top instead (photo 7/12, words 5/12), so the grid below fills every row.
    // Projects page: ten cards load at once on a phone, so phones ask for 80vw (the card is drawn at about 90vw):
    // sharper than the 66vw it used to ask for, without sending 3x phones the next file size up for every card
    project_cards: projects.map((p, i) => {
      const wide = i === 0 && projects.length > 3 && projects.length % 3 === 1;
      return projectCard(p, { sizes: wide ? '(min-width: 900px) 60vw, (min-width: 600px) 45vw, 90vw' : '(min-width: 900px) 33vw, (min-width: 600px) 45vw, 90vw', heading: 'h2', eager: i === 0, wide });
    }).join('\n'),
    home_construction_cards: projects.filter(p => p.category === 'Home Construction').map(p => projectCard(p, { heading: 'h2' })).join('\n') || '<p class="empty">Home construction projects will appear here.</p>',
    tracking_head: trackingHead(),
    // Only categories that have a job get a filter button, decided here rather than by site.js after the page
    // has painted (hiding buttons later made the row shrink and the grid jump: a layout shift Google measures).
    project_filters: ['<li><button type="button" data-filter="all" aria-pressed="true">All</button></li>']
      .concat(CATEGORIES.filter(c => projects.some(p => p.category === c)).map(c => `<li><button type="button" data-filter="${slugify(c)}" aria-pressed="false">${esc(c)}</button></li>`)).join('\n      '),
    local_business: localBusinessJsonLd(),
    home_reviews: homeReviews(),
  };

  const layout = await readPartial('layout');
  const sitemap = [];
  const lastmods = {};
  async function renderPage(meta, body, urlPath, sources = []) {
    const pageCtx = {
      ...ctx,
      title: esc(meta.title || config.name),
      description: esc(meta.description || ''),
      url_path: urlPath,
      canonical: siteOrigin ? `${siteOrigin}${urlPath}` : '',
      // once site.config.json has the domain, every page says where it lives, so Facebook and Google get the right address
      canonical_tag: siteOrigin && meta.noindex !== 'yes' ? `<link rel="canonical" href="${siteOrigin}${urlPath}">` : '',
      og_url_tag: siteOrigin ? `<meta property="og:url" content="${siteOrigin}${urlPath}">` : '',
      og_image: `${siteOrigin}${(await sharePhotoFor(meta, body)) || '/assets/img/og-image.jpg'}`,
      robots: meta.noindex === 'yes' ? 'noindex, follow' : 'index, follow',
      body_class: meta.body_class || '',
      header: meta.layout === 'landing' ? 'header-landing' : 'header',
      footer: meta.layout === 'landing' ? 'footer-landing' : 'footer',
      // the business card for Google on every page visitors can land on from search
      structured_data: (urlPath === '/' ? websiteJsonLd() : '') + (meta.noindex !== 'yes' ? ctx.local_business : '') + breadcrumbs(urlPath, meta.title || config.name, meta.crumb) + (meta.service === 'yes' ? serviceJsonLd(meta, urlPath) : ''),
      verification_meta: filled('googleSiteVerification') ? `<meta name="google-site-verification" content="${esc(config.googleSiteVerification)}">` : '',
      // estimate form defaults for pages without ?type= / ?who= in the link (e.g. an ad landing page)
      // service pages: the real jobs in that category, and a Service card for Google
      related_projects: relatedProjects(meta.projects),
      form_type: esc(meta.form_type || ''),
      form_who: esc(meta.form_who || ''),
      [`nav_${(meta.nav || 'none').replace(/-/g, '_')}`]: ' aria-current="page"',
    };
    let html = layout.replace('{{content}}', body).replace('{{> header}}', `{{> ${pageCtx.header}}}`).replace('{{> footer}}', `{{> ${pageCtx.footer}}}`);
    html = await render(html, pageCtx);
    html = html.replace(/\{\{nav_[\w]+\}\}/g, '');
    // the service strip marks the page you are on (service pages carry it at the foot)
    html = html.replace(/(<nav class="svc-strip"[\s\S]*?<\/nav>)/, m => m.replace(`<a href="${urlPath}">`, `<a href="${urlPath}" aria-current="page">`));
    // After launch, a placeholder typed straight into a page (like the Home Construction intro) is left out instead of shown
    if (LIVE) html = html.replace(/<p>\s*<span class="tbd[^"]*">\[[^\]]*\]<\/span>\s*<\/p>\s*/g, '');
    html = withBase(html);
    const outFile = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '') + '.html';
    await fs.mkdir(path.dirname(path.join(DIST, outFile)), { recursive: true });
    html = versionAssets(html);
    html = html.replace('content="__CSP__"', `content="${contentSecurityPolicy(html)}"`);
    await fs.writeFile(path.join(DIST, outFile), html);
    if (meta.noindex !== 'yes' && meta.sitemap !== 'no') {
      sitemap.push(urlPath);
      // Pages that list projects also change when a project is added or edited
      const lists = [];
      if (/\{\{\s*(recent_projects|project_cards)\s*\}\}/.test(body)) lists.push('projects');
      if (meta.projects) { const want = meta.projects.split(',').map(c => c.trim()); lists.push(...projects.filter(p => want.includes(p.categorySlug)).map(p => `projects/${p.id}`)); }
      lastmods[urlPath] = lastChanged([...sources, ...lists]);
    }
    console.log(`  page ${urlPath}`);
  }
  for (const f of (await fs.readdir(path.join(ROOT, 'src', 'pages'))).filter(f => f.endsWith('.html'))) {
    const [meta, body] = frontMatter(stripCredentials(await fs.readFile(path.join(ROOT, 'src', 'pages', f), 'utf8')));
    await renderPage(meta, body, meta.path || '/' + f.replace(/\.html$/, '').replace(/^index$/, ''), [`src/pages/${f}`]);
  }
  for (const p of projects) {
    const town = p.town && !p.town.startsWith('[') ? ` in ${p.town}, TN` : '';
    await renderPage({
      // Titles Google can show whole (about 60 characters): the job and its town when they fit, else the job alone
      // (Google shows the site name "TVIS Construction" above every result anyway, so the town wins over the brand)
      title: [town && `${p.title}${town} | TVIS`, town && `${p.title}, ${p.town} | TVIS`, town && `${p.title}${town}`, town && `${p.title}, ${p.town}, TN`, town && `${p.title}, ${p.town}`, `${p.title} | TVIS Construction`, `${p.title} | TVIS`].filter(Boolean).find(t => t.length <= 60) || p.title,
      crumb: p.title,
      // Joey's write-up, then where and what the visitor will see; kept under about 160 characters
      description: projectDescription(p),
      nav: 'projects',
      body_class: 'page-project',
      sitemap: p.title.startsWith('Sample') ? 'no' : '',
      noindex: p.title.startsWith('Sample') ? 'yes' : '',
      og_src: (p.photos.after[0] || p.photos.progress.at(-1) || p.photos.before[0])?.file,
    }, projectDetail(p, projects[(projects.indexOf(p) + 1) % projects.length]), `/project/${p.id}`, [`projects/${p.id}`]);
  }

  const origin = config.domain ? `https://${config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : '';
  if (origin) {
    await fs.writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...sitemap].sort((a, b) => (b === '/') - (a === '/')).map(u => `  <url><loc>${origin}${u}</loc>${lastmods[u] ? `<lastmod>${lastmods[u]}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
    await fs.writeFile(path.join(DIST, 'CNAME'), config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '') + '\n');
  }
  // tvisconstruction.com/review: a short address for the review cards, QR code and texts. It forwards straight to
  // the Google review form, so the printed cards keep working if the profile's review link ever changes.
  if (config.googleReviewUrl) {
    const to = esc(config.googleReviewUrl);
    await fs.writeFile(path.join(DIST, 'review.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; base-uri 'none'; form-action 'none'">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${to}">
<link rel="icon" href="/favicon.ico">
<title>Review ${esc(config.name)} on Google</title>
</head><body>
<p>Taking you to Google to review ${esc(config.name)}&hellip;</p>
<p><a href="${to}">Tap here if nothing happens</a>. Thank you!</p>
</body></html>
`);
  }
  await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');
  console.log(`Built in ${((Date.now() - t0) / 1000).toFixed(1)}s → dist/`);
}

main().catch(e => { console.error(e); process.exit(1); });
