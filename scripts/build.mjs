// Builds the TVIS website into dist/.
// - Pages in src/pages/*.html get the shared header, footer and head (src/partials).
// - Business details come from site.config.json; empty values show as yellow [PLACEHOLDERS].
// - Job folders in projects/ become the gallery: photos are resized, compressed and
//   stripped of GPS/camera data, and the project cards are written into the pages.
// - Site photos dropped into photos/site/ replace the labeled placeholder blocks.
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, ''); // e.g. "/TVIS-Site-Work" before the custom domain is set
const config = JSON.parse(await fs.readFile(path.join(ROOT, 'site.config.json'), 'utf8'));
const YEAR = new Date().getFullYear();

export const CATEGORIES = ['Driveways', 'Shed & Garage Pads', 'Drainage', 'New Construction Sitework', 'Concrete', 'Property Cleanup', 'Home Construction'];
const PHOTO_EXT = /\.(jpe?g|png|webp)$/i;
const WIDTHS = [480, 960, 1600];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = s => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const tbd = label => `<span class="tbd">[${esc(label)}]</span>`;

// ---------- business details ----------
const digits = (config.phone || '').replace(/\D/g, '');
const tel = digits ? `tel:+${digits.length === 10 ? '1' + digits : digits}` : '';
const filled = k => typeof config[k] === 'string' && config[k].trim() !== '';
const show = (k, label) => (filled(k) ? esc(config[k]) : tbd(label));
const texts = config.phoneTakesTexts === true && digits !== '';
const sms = texts ? tel.replace('tel:', 'sms:') : '';
// "Call", "Call or text", "Call Jeremy", "Call or text Jeremy": the name only shows once it's filled in
const talk = (texts ? 'Call or text' : 'Call') + (filled('ownerFirstName') ? ` ${esc(config.ownerFirstName)}` : '');

const vars = {
  name: esc(config.name),
  tagline: esc(config.tagline),
  phone: show('phone', 'PHONE'),
  phone_href: tel || '/estimate#contact',
  email: filled('email') ? `<a href="mailto:${esc(config.email)}">${esc(config.email)}</a>` : tbd('EMAIL'),
  base: show('baseLocation', 'CITY, TN'),
  service_area: show('serviceArea', 'TOWNS AND COUNTIES'),
  hours: show('hours', 'HOURS'),
  licensed: filled('licensedLine') ? `<p class="licensed">${esc(config.licensedLine)}</p>` : `<p class="licensed">${tbd('LICENSED AND INSURED LINE')}</p>`,
  response_time: show('responseTime', '1 BUSINESS DAY'),
  facebook: config.facebook || '#facebook-url-needed',
  instagram: config.instagram || '#instagram-url-needed',
  gbp: config.googleBusinessProfile || '#google-business-profile-url-needed',
  form_endpoint: esc(config.formEndpoint || ''),
  // Shown above the form until site.config.json > formEndpoint is filled, so requests never vanish silently
  form_notice: config.formEndpoint ? '' : `<p class="form-off" role="note"><b>This form isn't connected yet,</b> so requests can't be sent from it. Please call <span class="tbd">[PHONE]</span> for now. <small>(Site owner: add the Basin endpoint to site.config.json &gt; formEndpoint.)</small></p>`,
  talk,
  talk_who: texts || filled('ownerFirstName') ? `<p class="talk-who">${talk}</p>` : '',
  text_link: texts ? `<a class="text-link" href="${sms}" data-track="call">Text ${esc(config.phone)}</a>` : '',
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

// Resize one photo to webp at several widths; returns {srcset, src, w, h}.
async function processPhoto(src, outDir, baseName) {
  await fs.mkdir(outDir, { recursive: true });
  const meta = await sharp(src).rotate().metadata();
  // .rotate() applies the phone's orientation; width/height may be swapped
  const rotated = (meta.orientation || 1) >= 5;
  const fullW = rotated ? meta.height : meta.width, fullH = rotated ? meta.width : meta.height;
  const widths = WIDTHS.filter(w => w < fullW).concat(fullW > WIDTHS.at(-1) ? [] : [fullW]);
  const out = [];
  for (const w of widths.length ? widths : [fullW]) {
    const file = `${baseName}-${w}.webp`;
    const dest = path.join(outDir, file);
    if (!(await newer(src, dest))) {
      // sharp drops EXIF (including GPS) unless .withMetadata() is called, so location data never ships
      await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest);
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

function photoBlock(attrs) {
  const { slot, label = '', alt = label, sizes = '100vw', eager, kind = 'Photo' } = attrs;
  const p = sitePhotos[slot];
  if (p) return `<div class="photo">${imgTag(p, alt, { sizes, eager: eager !== undefined })}</div>`;
  return `<div class="photo ph" role="img" aria-label="${esc(kind)} placeholder: ${esc(label)}"><span class="shot"><b>${esc(kind)}:</b> ${esc(label)}<small>Add photos/site/${esc(slot)}.jpg</small></span></div>`;
}

// Before/after pair for a fixed spot: photos/site/<slot>-before.jpg and <slot>-after.jpg.
// Until both exist, shows the slider with labeled placeholder halves.
function baBlock(attrs) {
  const { slot, before = '', after = '', alt = '', sizes = '(min-width: 900px) 55vw, 100vw' } = attrs;
  const b = sitePhotos[`${slot}-before`], a = sitePhotos[`${slot}-after`];
  const half = (p, kind, label, cls) => p
    ? `<div class="ba-img ${cls}">${imgTag(p, `${kind}: ${alt || label}`, { sizes })}</div>`
    : `<div class="ba-img ${cls} ph" role="img" aria-label="${kind} photo placeholder: ${esc(label)}"><span class="shot"><b>${kind}:</b> ${esc(label)}<small>Add photos/site/${esc(slot)}-${kind.toLowerCase()}.jpg</small></span></div>`;
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
    const photos = { before: [], progress: [], after: [] };
    for (const f of files) {
      const kind = (f.match(/^(before|progress|after)/i) || [])[1]?.toLowerCase();
      if (!kind) { console.warn(`  ! ${folder}/${f}: name must start with before-, progress- or after-`); continue; }
      const p = await processPhoto(path.join(pdir, f), path.join(DIST, 'gallery', folder), f.replace(PHOTO_EXT, '').toLowerCase());
      photos[kind].push(p);
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
      description: info.description || info.about || '',
      date: folder.slice(0, 7),
      photos,
    });
  }
  projects.sort((a, b) => (b.featured - a.featured) || b.id.localeCompare(a.id));
  return projects;
}

function baSlider(p, sizes) {
  const b = p.photos.before[0], a = p.photos.after[0] || p.photos.progress.at(-1);
  const town = p.town && !p.town.startsWith('[') ? ` in ${p.town}` : '';
  if (b && a) {
    return `<div class="ba" data-ba>
  <div class="ba-img ba-before">${imgTag(b, `Before: ${p.title}${town}`, { sizes })}</div>
  <div class="ba-img ba-after">${imgTag(a, `After: ${p.title}${town}`, { sizes })}</div>
  <span class="ba-tag ba-tag-b">Before</span><span class="ba-tag ba-tag-a">${p.photos.after[0] ? 'After' : 'Progress'}</span>
  <span class="ba-handle" aria-hidden="true"></span>
  <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after photos of ${esc(p.title)}">
</div>`;
  }
  const one = a || b;
  return one ? `<div class="ba ba-single">${imgTag(one, `${p.title}${town}`, { sizes })}</div>` : '';
}

const townHtml = p => (p.town ? (p.town.startsWith('[') ? tbd(p.town.replace(/[\[\]]/g, '')) : esc(p.town)) : '');
const projectRow = p => `<span class="badge${p.status === 'In Progress' ? ' badge-live' : ''}">${p.status}</span> <span>${p.town ? townHtml(p) + ' · ' : ''}${esc(p.category)}</span>`;

// Project type codes on the estimate form (keep in sync with data-type in src/partials/estimate-form.html)
const CATEGORY_TYPE = { 'Driveways': 'driveway', 'Shed & Garage Pads': 'pad', 'Drainage': 'drainage', 'New Construction Sitework': 'siteprep', 'Concrete': 'concrete', 'Property Cleanup': 'cleanup', 'Home Construction': 'home' };

// Body of the project detail page at /project/<folder>: every photo, grouped, plus the estimate button.
function projectDetail(p) {
  const town = p.town && !p.town.startsWith('[') ? ` in ${p.town}` : '';
  const group = (kind, label) => p.photos[kind].length ? `<section class="pd-group" aria-labelledby="pd-${kind}">
  <h2 id="pd-${kind}">${label}</h2>
  <div class="pd-grid">${p.photos[kind].map((ph, i) => `<a class="pd-photo" href="${ph.srcset.split(', ').at(-1).split(' ')[0]}">${imgTag(ph, `${label} photo ${i + 1}: ${p.title}${town}`, { sizes: '(min-width: 900px) 33vw, 100vw' })}</a>`).join('')}</div>
</section>` : '';
  const who = p.category === 'New Construction Sitework' ? '&amp;who=builder' : '';
  return `<section class="sec pd">
  <div class="wrap">
    <p class="crumb"><a href="/projects">&larr; All projects</a></p>
    <header class="pd-head">
      <h1>${esc(p.title)}</h1>
      <p class="proj-row">${projectRow(p)}</p>
      ${p.description ? `<p class="pd-desc">${esc(p.description)}</p>` : ''}
    </header>
    ${p.photos.before.length && (p.photos.after.length || p.photos.progress.length) ? `<div class="pd-ba">${baSlider(p, '(min-width: 900px) 70vw, 100vw')}</div>` : ''}
    ${group('before', 'Before')}${group('progress', 'In progress')}${group('after', 'After')}
    <div class="pd-cta">
      <a class="btn btn-primary" href="/estimate?type=${CATEGORY_TYPE[p.category] || 'other'}${who}">Get an estimate for a project like this</a>
      <a class="bigphone" href="{{phone_href}}" data-track="call">{{phone}}</a>
    </div>
  </div>
</section>`;
}

function projectCard(p, { sizes = '(min-width: 900px) 33vw, 84vw', heading = 'h3' } = {}) {
  const live = p.status === 'In Progress';
  return `<article class="proj" data-category="${p.categorySlug}">
${baSlider(p, sizes)}
<div class="proj-meta">
  <${heading} class="proj-title"><a href="/project/${p.id}">${esc(p.title)}</a></${heading}>
  <p class="proj-row">${projectRow(p)}</p>
  ${p.description ? `<p class="proj-desc">${esc(p.description)}</p>` : ''}
  <a class="proj-more" href="/project/${p.id}" aria-label="See all photos: ${esc(p.title)}">See all photos</a>
</div>
</article>`;
}

// ---------- templating ----------
async function readPartial(name) {
  return fs.readFile(path.join(ROOT, 'src', 'partials', `${name}.html`), 'utf8');
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

function localBusinessJsonLd() {
  const site = config.domain ? `https://${config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : undefined;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: config.name,
    slogan: config.tagline,
    description: 'Excavation, sitework, gravel driveways, shed and garage pads, and drainage for homeowners, builders and contractors in Chattanooga, TN and surrounding communities.',
    address: { '@type': 'PostalAddress', addressLocality: 'Chattanooga', addressRegion: 'TN', addressCountry: 'US' },
    areaServed: [{ '@type': 'City', name: 'Chattanooga, TN' }],
  };
  if (site) { data.url = site + '/'; data.logo = site + '/assets/img/logo-512.png'; data.image = site + '/assets/img/og-image.jpg'; }
  if (digits) data.telephone = tel.replace('tel:', '');
  if (filled('email')) data.email = config.email;
  if (filled('hours')) data.openingHours = config.hours; // free text until real hours are set; see README
  if (filled('serviceArea')) data.areaServed = config.serviceArea.split(',').map(t => ({ '@type': 'Place', name: t.trim() })).filter(t => t.name);
  const same = [config.facebook, config.instagram, config.googleBusinessProfile].filter(Boolean);
  if (same.length) data.sameAs = same;
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
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
async function brandImages() {
  const out = path.join(DIST, 'assets', 'img');
  await fs.mkdir(out, { recursive: true });
  const logo = path.join(ROOT, 'src', 'assets', 'img', 'logo-clean.png');
  const rev = path.join(ROOT, 'src', 'assets', 'img', 'logo-reverse.png');
  await sharp(logo).resize({ width: 440 }).png({ compressionLevel: 9, palette: true }).toFile(path.join(out, 'logo.png'));
  await sharp(rev).resize({ width: 440 }).png({ compressionLevel: 9, palette: true }).toFile(path.join(out, 'logo-reverse.png'));
  // Square icon: the houses-and-excavator mark from the top of the logo
  const m = await sharp(logo).metadata();
  const markH = Math.round(m.height * 0.62);
  const mark = await sharp(logo).extract({ left: 0, top: 0, width: m.width, height: markH }).toBuffer();
  const square = await sharp({ create: { width: m.width, height: m.width, channels: 4, background: '#ffffff' } })
    .composite([{ input: mark, top: Math.round((m.width - markH) / 2), left: 0 }]).png().toBuffer();
  for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['logo-512.png', 512]]) {
    await sharp(square).resize(size, size).png().toFile(path.join(out, name));
  }
  const ogLogo = await sharp(logo).resize({ width: 900 }).toBuffer();
  const ogMeta = await sharp(ogLogo).metadata();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#F3F2EE' } })
    .composite([{ input: ogLogo, left: 150, top: Math.round((630 - ogMeta.height) / 2) - 20 },
      { input: Buffer.from(`<svg width="1200" height="630"><rect x="0" y="606" width="1200" height="24" fill="#72852E"/></svg>`), left: 0, top: 0 }])
    .jpeg({ quality: 82 }).toFile(path.join(out, 'og-image.jpg'));
}

// ---------- main ----------
async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const e of await fs.readdir(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) await copyDir(s, d); else await fs.copyFile(s, d);
  }
}

const withBase = html => (BASE ? html.replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`).replace(/(srcset="[^"]*)/g, s => s.replace(/(^srcset="|, )\//g, `$1${BASE}/`)) : html);

async function main() {
  const t0 = Date.now();
  await fs.mkdir(DIST, { recursive: true });
  for (const f of await fs.readdir(DIST)) if (!['gallery', 'img'].includes(f)) await fs.rm(path.join(DIST, f), { recursive: true, force: true }); // keep resized photos as a cache
  await copyDir(path.join(ROOT, 'src', 'assets'), path.join(DIST, 'assets'));
  await brandImages();
  await loadSitePhotos();
  const projects = await loadProjects();
  console.log(`  ${projects.length} project folder(s)`);

  await fs.writeFile(path.join(DIST, 'projects.json'), JSON.stringify(projects.map(p => ({ ...p, photos: Object.fromEntries(Object.entries(p.photos).map(([k, v]) => [k, v.map(x => x.src)])) })), null, 2));

  const recent = projects.slice(0, 3);
  const ctx = {
    ...vars,
    recent_projects: recent.length ? recent.map(p => projectCard(p)).join('\n') : '<p class="empty">Projects appear here once a job folder is added. See HOW-TO-ADD-A-PROJECT.md.</p>',
    project_cards: projects.map(p => projectCard(p, { sizes: '(min-width: 900px) 33vw, 100vw', heading: 'h2' })).join('\n'),
    home_construction_cards: projects.filter(p => p.category === 'Home Construction').map(p => projectCard(p, { heading: 'h2' })).join('\n') || '<p class="empty">Home construction projects will appear here.</p>',
    tracking_head: trackingHead(),
    local_business: localBusinessJsonLd(),
  };

  const layout = await readPartial('layout');
  const sitemap = [];
  async function renderPage(meta, body, urlPath) {
    const pageCtx = {
      ...ctx,
      title: esc(meta.title || config.name),
      description: esc(meta.description || ''),
      url_path: urlPath,
      canonical: config.domain ? `https://${config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}${urlPath}` : '',
      robots: meta.noindex === 'yes' ? 'noindex, follow' : 'index, follow',
      body_class: meta.body_class || '',
      header: meta.layout === 'landing' ? 'header-landing' : 'header',
      footer: meta.layout === 'landing' ? 'footer-landing' : 'footer',
      structured_data: meta.schema === 'yes' ? ctx.local_business : '',
      // estimate form defaults for pages without ?type= / ?who= in the link (e.g. an ad landing page)
      form_type: esc(meta.form_type || ''),
      form_who: esc(meta.form_who || ''),
      [`nav_${(meta.nav || 'none').replace(/-/g, '_')}`]: ' aria-current="page"',
    };
    let html = layout.replace('{{content}}', body).replace('{{> header}}', `{{> ${pageCtx.header}}}`).replace('{{> footer}}', `{{> ${pageCtx.footer}}}`);
    html = await render(html, pageCtx);
    html = html.replace(/\{\{nav_[\w]+\}\}/g, '').replace(/ ?\{\{canonical_tag\}\}/, '');
    html = withBase(html);
    const outFile = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '') + '.html';
    await fs.mkdir(path.dirname(path.join(DIST, outFile)), { recursive: true });
    await fs.writeFile(path.join(DIST, outFile), html);
    if (meta.noindex !== 'yes' && meta.sitemap !== 'no') sitemap.push(urlPath);
    console.log(`  page ${urlPath}`);
  }
  for (const f of (await fs.readdir(path.join(ROOT, 'src', 'pages'))).filter(f => f.endsWith('.html'))) {
    const [meta, body] = frontMatter(await fs.readFile(path.join(ROOT, 'src', 'pages', f), 'utf8'));
    await renderPage(meta, body, meta.path || '/' + f.replace(/\.html$/, '').replace(/^index$/, ''));
  }
  for (const p of projects) {
    const town = p.town && !p.town.startsWith('[') ? ` in ${p.town}, TN` : '';
    await renderPage({
      title: `${p.title}${town} | ${p.category} | TVIS Site Work and Construction`,
      description: (p.description || `${p.category} project by TVIS Site Work and Construction${town}.`).slice(0, 155),
      nav: 'projects',
      body_class: 'page-project',
      sitemap: p.title.startsWith('Sample') ? 'no' : '',
      noindex: p.title.startsWith('Sample') ? 'yes' : '',
    }, projectDetail(p), `/project/${p.id}`);
  }

  const origin = config.domain ? `https://${config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : '';
  if (origin) {
    await fs.writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(u => `  <url><loc>${origin}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
    await fs.writeFile(path.join(DIST, 'CNAME'), config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '') + '\n');
  }
  await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /lp/\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');
  console.log(`Built in ${((Date.now() - t0) / 1000).toFixed(1)}s → dist/`);
}

main().catch(e => { console.error(e); process.exit(1); });
