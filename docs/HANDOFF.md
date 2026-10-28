# TVIS website: build handoff

Read this first. It is the full brief plus every decision made so far, so a Claude Code session in this folder can continue without the earlier conversation.

Last updated 2026-10-28.

## Status

- Research and design phase: **done and approved by Jeremy** (design review page: https://claude.ai/artifact/PdHEFQ2Ln37rjNDSD46U1V, version 2 "lighter").
- Homepage: **built and approved**, with the hero headline changed to **"Groundwork Done Right."** ("From the Ground Up." stays as the tagline in the footer and config).
- Homeowners page (`/homeowners`): **built** (driveways before/after, shed pad cross-section animation, drainage, cleanup; Lighthouse mobile 99/100/100/100). Not yet reviewed by Jeremy.
- Builders page (`/builders`): **built** (phase track linking to the four sections, licensed-connections note, dark "Have a lot ready to go?" CTA; Lighthouse mobile 99/100/100/100). Estimate links use `?who=builder&type=siteprep|utility|concrete`; the form's project-type values must match `driveway, pad, drainage, siteprep, utility, concrete, cleanup, home, other`.
- More Services, Home Construction and Projects pages: **built** (Lighthouse mobile 98 to 100 everywhere). Projects has filter buttons (hidden without JS, all cards show), deep links like `/projects?type=drainage`, and every project gets its own page at `/project/<folder-name>` with all photos grouped Before / In progress / After and "Get an estimate for a project like this". Sample projects (title starts with "Sample") are noindex and left out of the sitemap.
- Next: everything in "What's left" below, in that order. **Read "Session notes, 2026-10-27" first**: the estimate page and form markup and styles exist, but the form's JavaScript isn't written yet.

## Session notes, 2026-10-27 (stopped partway through the estimate form)

Jeremy asked for: npm install, move deploy.yml, then estimate form → landing page → 404 → docs → Lighthouse, **showing him each page in the browser before moving on**. Nothing has been shown to him yet.

**Done this session**
- `npm install` ran. `setup/deploy.yml` moved to `.github/workflows/deploy.yml` (`setup/` removed).
- `scripts/build.mjs`: new tokens `{{talk}}` ("Call" / "Call or text" plus `ownerFirstName` when filled), `{{talk_who}}` (that line, only when there's a name or texting is on), `{{text_link}}` and `{{mbar_text}}` (only when `phoneTakesTexts` is true and a phone is set), `{{form_notice}}` (yellow "form isn't connected yet, please call" box while `formEndpoint` is empty). Pages with `layout: landing` now also swap `{{> footer}}` for `footer-landing` (**that partial isn't created yet**, and neither is `header-landing`). New front matter `form_type:` / `form_who:` set the form's defaults on pages with no `?type=`/`?who=` (meant for the ad landing page).
- `src/partials/icons.html`: the icon sprite, moved out of `header.html` (which now includes it) so the landing header can share it. Added `#i-text` and `#i-addphoto`.
- `footer.html`: the phone bar includes `{{mbar_text}}`.
- `src/partials/excavator.html`: thank-you machine moment. Charcoal boom, stick and bucket and an olive cab, like the logo. CSS animates the arm lifting, the bucket dumping, clods falling and the pile growing, then the message fades in. **Not yet checked in a browser.** The bucket's rotation angle (`exc-dump`, -80deg around 272px 102px) and the clod positions probably need adjusting by eye.
- `src/partials/estimate-form.html`: all nine fields in brief order. "I'm a..." uses radio buttons styled as big tap targets. Project type options carry `data-type` codes (driveway, pad, drainage, siteprep, utility, concrete, cleanup, home, other), and the visible label is what gets emailed. Field `name`s are readable labels so Basin emails read cleanly, except `email` (lowercase so Basin can use it for reply-to). Photos go as `photos[]`, with `data-accept-builder="image/*,application/pdf"`. Hidden source fields use `data-src` keys that match `sessionStorage.tvis_src`. The honeypot is `_gotcha` (**confirm Basin's honeypot setting uses that name**). Hidden thank-you block `[data-thanks]`. It posts natively as multipart, so it works without JS.
- `src/pages/estimate.html`: heading, the form, and a sidebar with `#contact` ("Talk to TVIS": phone, email, hours, based in, service area, socials) plus "What happens next" (4 steps, from the answer to question 5). Uses `schema: yes`.
- `site.css`: an "estimate form" block appended at the end (form fields, tap buttons, photo picker and thumbnails, thank-you and excavator keyframes, sidebar). The phone bar is now flex so the optional Text button fits. On `.page-estimate` the bar shows Call only.

**Not done, next steps in order**
1. **`site.js` form script, which is not written** (the append failed and nothing landed). It needs to: prefill from `?type=`/`?who=`, falling back to the box's `data-type`/`data-who`; set `option.value = textContent`; fill `[data-src]` hidden fields (`page` = current path, with a fallback for `landing_page`/`referrer`); when Builder is picked, switch `accept` and the hint/note text; keep a running photo list with thumbnails and remove buttons (max 10, 25 MB each); resize to 1600px JPEG through a canvas before upload, sending the original if the browser can't decode it (HEIC in Chrome), and expose it as `window.tvisShrinkPhoto` for the future Visualize page; validate inline (`.f-err` under each field, `aria-invalid`, phone needs at least 10 digits); if `action` is empty, scroll to `.form-off`; if the honeypot is filled or the form went out in under 3s, show the thank-you without sending; otherwise `fetch` POST the FormData (delete the empty `photos[]`, append the resized files) with `Accept: application/json`; on success call `tvisTrack('lead', …)`, hide the form, show `[data-thanks]` and focus `.thanks-h`; on failure show `[data-fail]`. The CSS references a `.flash` class on `.form-off` that hasn't been defined yet.
2. Check `/estimate` at 390 and 1440 against `docs/design/estimate-*.jpg` and adjust the excavator. Puppeteer-core and Lighthouse are installed in the session scratchpad only, not the project. Reinstall somewhere outside the repo if needed. Chrome is at `C:\Program Files\Google\Chrome\Application\chrome.exe`. **Show Jeremy, and wait for his OK.**
3. A `/thanks` page (noindex, excavator plus message, fires the lead event on load) for the no-JS path, and set Basin's redirect to it. Optional, but it was planned.
4. Landing page: `src/pages/lp-shed-garage-pads.html` with `path: /lp/shed-garage-pads`, `layout: landing`, `noindex: yes`, `form_type: pad`. Create `header-landing.html` (unlinked logo, phone, `{{> icons}}`) and `footer-landing.html` (name, phone, licensed line, phone bar where Estimate points to `#estimate`). Planned content: hero; benefit bullets drawn from the approved pad step copy; `{{ba slot="lp-pads"}}`; 3 steps (send photos → we talk it through and visit if needed → you get an estimate); `{{> estimate-form}}` in `#estimate`. The headline should match the ad, but the ad copy is unknown, so use the brief's "Shed & Garage Pad Preparation" and ask Jeremy. No second animation, because the excavator is that page's one moment.
5. `404.html`: `src/pages/404.html` with `path: /404`, `noindex: yes`, a plain "Page not found", links to the main pages and the phone.
6. Prefill wiring (item 3 below): most buttons are already wired. Still to do: check `index.html` and any generic `/estimate` links.
7. Docs: `HOW-TO-ADD-A-PROJECT.md` and a full `README.md`, covering the new partials, the `form_type`/`form_who` front matter, how to copy the landing page, Basin setup (endpoint, honeypot name, redirect, test with 3 phone photos).
8. Check every page at 390/1440 and run Lighthouse mobile at 90+ on each; finish with the placeholder checklist.

## How the site is built (already in place)

- Plain HTML/CSS/JS, no framework. `npm run build` runs `scripts/build.mjs` (only dependency: `sharp`) and writes `dist/`. `npm run dev` builds and serves `dist/` at http://localhost:8080 with clean URLs (`/homeowners` serves `homeowners.html`, same as GitHub Pages).
- `src/pages/*.html`: one file per page. Front matter between `---` lines: `title`, `description`, `path` (optional), `nav` (which menu item is current: home, homeowners, builders, more_services, home_construction, projects, estimate), `schema: yes` (adds LocalBusiness JSON-LD), `noindex: yes`, `layout: landing` (uses `src/partials/header-landing.html`, which still needs creating), `body_class`.
- Template tokens: `{{> partial}}`, `{{phone}}`, `{{phone_href}}`, `{{email}}`, `{{base}}`, `{{service_area}}`, `{{hours}}`, `{{licensed}}`, `{{response_time}}`, `{{facebook}}`, `{{instagram}}`, `{{gbp}}`, `{{form_endpoint}}`, `{{year}}`, `{{recent_projects}}`, `{{project_cards}}`, `{{home_construction_cards}}`, and `{{photo slot="name" label="shot description" alt="..." sizes="..." [eager]}}`. Empty config values render as yellow `<span class="tbd">[PLACEHOLDER]</span>`.
- `site.config.json` is the single source of business details (NAP consistency for local SEO).
- `photos/site/<slot>.jpg` replaces the matching placeholder block automatically (resized to webp, metadata stripped).
- `projects/YYYY-MM-town-job/` folders → gallery. `project.txt` keys: title, category, town, status, featured, description. Photos named `before-N`, `progress-N`, `after-N`. Blank status shows In Progress until after photos exist. Newest first, featured pinned. The build also writes `dist/projects.json` (keep its shape stable for the future auto-posting automation). Three sample folders exist; their titles start with "Sample:".
- `setup/deploy.yml` is the GitHub Pages workflow. It must move to `.github/workflows/deploy.yml` (the remote tools could not write into `.github`). When there's no custom domain yet, it builds with `BASE_PATH=/<repo>`.
- Lighthouse mobile on the homepage: 99 / 100 / 100 / 100. Keep every page at 90+.

## Design system (approved; don't drift)

- Light scheme. White and warm gray pages; charcoal only for text and the footer; olive for buttons and accents. Jeremy found the first dark version too dark, especially on phones.
- Colors (measured from the logo): charcoal `#232B2E`, charcoal-2 `#2E373B`, olive `#72852E`, button olive `#5E6E24` (hover `#4F5D1E`), olive on dark `#A3B654`, olive tint `#EEF1E2`, warm gray `#F3F2EE`, stone `#E4E1D8`, white.
- Type: Barlow Condensed 700/800 uppercase headings, Source Sans 3 body at 18px. Self-hosted in `src/assets/fonts/`. Five sizes max.
- Square flat buttons, no shadows at rest, no gradients (except the photo overlay scrim), no carousels, no animated counters, no icon-card grids, no tiny letter-spaced labels.
- Cards: white on warm gray (or the reverse), photo on top, no borders. Photos full color, square corners.
- Before/after: drag slider (`[data-ba]`, range input, keyboard accessible), already in `site.css`/`site.js` and the build's `baSlider()`.
- Phone: sticky bottom bar (Call / Get an Estimate), white header, full-screen white menu with Call at the top. On the estimate page the bar should become a single Call button.
- Hero overlay as light as the real photo allows once it arrives (Jeremy wants the hero brighter).
- Mockups for reference: `docs/design/` (homepage, Homeowners page, estimate form at phone and desktop).

## Animated "machine moments" (approved)

One moving moment per page at most, no loops, never covering text or buttons, inline SVG + CSS only, `prefers-reduced-motion` shows the finished state.

1. **Homepage hero (done):** a small olive dozer (`src/partials/dozer.html`) drives in once and grades a gravel strip along the hero bottom, then parks.
2. **Homeowners `#pads` section (to build):** a cross-section of a shed pad builds up as it scrolls into view: native ground → graded dirt → gravel base in layers → shed set on top. Use IntersectionObserver to start it once; static final state without JS or with reduced motion.
3. **Estimate form thank-you (to build):** a small excavator (match the logo's excavator silhouette, olive/charcoal) dumps a bucket, then the thank-you message shows.

## Open questions: answers (Jeremy said "go with your picks")

1. Form service: **Basin** (usebasin.com). Free plan includes file uploads (100MB storage, 50 submissions/mo); Starter $12.50/mo yearly if needed. Runner-up Formspree. Put the endpoint in `site.config.json > formEndpoint`; until then the form shows a clear "form not connected yet" notice instead of failing silently. Test with 3 phone photos before launch to see if files arrive as links or attachments.
2. Text option: add a **Text** button next to Call (phone bar becomes Call / Text / Estimate) only when `phoneTakesTexts` is true in config.
3. Owner's name: show "Call or text {ownerFirstName}" only when `ownerFirstName` is filled. Don't guess a name.
4. Form: **one page**, the nine fields in the order below (not multi-step).
5. Add a short **"What happens next"** block by the form (we look at your photos and details, we call you to talk it through, we visit the site if needed, you get an estimate). No promised times beyond `responseTime` (`[1 BUSINESS DAY]` placeholder).
6. Code stays in this folder; when the GitHub repo `jsglisson3/TVIS-Site-Work` exists, this folder becomes it.

## What's left, in order

1. Header: build the remaining pages from the brief below: `/estimate`, plus `/lp/shed-garage-pads` (landing layout, noindex) and a `404.html`. Keep each section's anchor exactly as listed.
2. The estimate form with Basin wiring (POST multipart, `photos[]` multiple, `accept="image/*,application/pdf"` when Builder is picked, client-side photo resize to ~1600px before upload, honeypot + time check, hidden fields for page/referrer/UTM from `sessionStorage.tvis_src`, prefill from `?type=` and `?who=`, thank-you state with the excavator and `{{phone}}`, fire `tvisTrack('lead')`).
3. Wire every "Get an Estimate" button to the right prefill (`/estimate?type=drainage`, `/estimate?who=builder`, etc.).
4. ~~Projects page~~ (done) with filters (All · Driveways · Shed & Garage Pads · Drainage · New Construction Sitework · Concrete · Property Cleanup · Home Construction), status badges, project detail view with all photos and "Get an estimate for a project like this". Works without JS (filters can enhance).
5. `HOW-TO-ADD-A-PROJECT.md` (one page, non-technical; remind to skip photos with house numbers, license plates or faces) and a full `README.md`.
6. Check every page at 390px and 1440px in a browser and fix what you see; run Lighthouse mobile on each page; fix anything under 90.
7. Finish with a checklist of every placeholder still waiting on real info.

## Research highlights to apply

- Page titles: "[Service] in Chattanooga, TN | TVIS Site Work and Construction". Use these phrases in titles, meta descriptions, first sentences, alt text and image file names: gravel driveway repair, gravel driveway installation, driveway culvert installation, gravel pad for shed, shed pad, garage pad, French drain installation, yard drainage, downspout drain, standing water in yard, excavation contractor, residential site prep, utility trenching, final grading, shed demolition, brush clearing, concrete pad.
- Don't make near-duplicate town pages (Google treats them as doorway pages).
- Local competitors' common faults to avoid: dead "#" links, template leftovers, phone only in footer, broken tel: links, forms that need a CAPTCHA cookie, forms asking for photos with no upload field, conflicting facts.
- Ad landing page: headline matching the ad, tap-to-call, no main menu, one before/after, short bullets, three steps, form on the page, light page weight.
- Full notes: `docs/research/competitors.md` and `docs/research/practices.md`.

---

## The original brief (copy to use as written)

The site has one job: turn visitors into estimate requests, by phone call or by form with photos. Lead with the work people search for most: driveway repairs, shed and garage pads, French drains and residential site prep. Most visitors come from Facebook and Instagram ads on their phones.

**Ground rules:** use the copy as written; tighten only where a layout needs it. Plain, confident language. Never invent reviews, testimonials, license numbers, years in business, project counts, awards or prices. Never use other companies' photos; until real ones arrive, use placeholder blocks labeled with the shot. Don't promise response times, warranties or service areas beyond what's written. Home Construction stays low-key: dropdown and footer only, never on the homepage or in ads.

### Homeowners page (`/homeowners`)

- Headline: Property Improvements Made Simple.
- Intro: From a washed-out gravel driveway to a new garage pad, TVIS helps homeowners maintain, improve, and prepare their properties with practical excavation and sitework solutions.

Four service sections, each with its own anchor, a photo (before-and-after when available), its list as bullets, and a Get an Estimate button that opens the form with that project type picked.

- Driveways & Gravel Work (`#driveways`): gravel driveway repair and resurfacing; new gravel driveway installation; driveway widening and extensions; culvert installation and replacement; gravel parking areas.
- Shed & Garage Pad Preparation (`#pads`): shed foundation pads; detached garage site preparation; gravel pads for metal buildings; carport and trailer parking pads; site leveling and grading; concrete pad preparation.
- Residential Drainage Solutions (`#drainage`): French drain installation; gutter downspout drains; underground gutter piping; catch basins and yard drains; standing water corrections; drainage swales and grading.
- Yard Cleanup & Small Demolition (`#cleanup`): shed demolition and removal; trailer demolition and removal; landscape tear-outs; brush and overgrowth cleanup; yard leveling and repair; debris and material removal.

Featured: Shed & Garage Pads, with extra visibility. Show the job in four photo steps: cleared site, graded pad, compacted gravel base, finished shed or garage (plus the cross-section animation above). Sticky jump-link bar under the page hero.

### Builders & Contractors page (`/builders`)

- Headline: Sitework Solutions for Builders & Contractors
- Intro: TVIS partners with homebuilders, general contractors, and property investors to provide dependable site preparation, excavation, utility trenching, and finish work for residential construction projects.

Same section layout:

- Site Prep & Excavation (`#site-prep`): new home site preparation; building pad excavation and grading; rough grading; soil relocation and spreading; construction access and driveway preparation.
- Underground Utilities (`#utilities`): waterline trenching and installation; electrical utility trenching; underground conduit installation; drainage pipe installation; trench backfilling and compaction.
- Driveways, Culverts & Concrete (`#concrete`): gravel driveway construction; culvert installation; concrete driveways and aprons; sidewalks and concrete pads; base preparation and compaction.
- Final Grading & Site Completion (`#final-grading`): finish grading; final driveway gravel; topsoil placement; drainage corrections; final site cleanup; yard restoration.

Featured: Complete New-Construction Sitework. Position TVIS as one sitework contractor who can coordinate every phase, from initial site prep and underground utilities through the driveway, final grading and cleanup. Add the note: Qualified trades handle licensed connections where required.

Builder call to action: Have a lot ready to go? Send us the address and plans. The button opens the estimate form set to Builder or Contractor, with PDF plan uploads allowed.

### Miscellaneous Services (`/more-services`)

- Headline: Additional Excavation & Property Services
- Intro: Not every project fits into a standard category. TVIS also handles smaller excavation, cleanup, and property improvement jobs for homeowners, investors, and contractors.
- Four photo cards:
  - Small Demolition: Sheds, trailers, small structures and demolition debris removal.
  - Brush & Lot Cleanup: Light clearing, landscape removal and overgrown property cleanup.
  - Dirt & Gravel Work: Material spreading, gravel placement, soil relocation and yard reshaping.
  - Small Excavation Projects: Trenching, drainage repairs, small pad preparation and miscellaneous digging.
- Callout band: Have a Project That Doesn't Fit the List? Send us a few photos and a short description, and we'll let you know how we can help. Button opens the form with Other picked.

### Home Construction (`/home-construction`)

Simple, secondary page: a 2 to 3 sentence intro ([OWNER TO SUPPLY] placeholder), then the gallery filtered to Home Construction projects. Not on the homepage, not in ads.

### Projects (`/projects`)

Real TVIS work, ongoing and finished, before-and-afters first. Filters as listed above. Status badge on every project (In Progress or Completed). Card: title, town, category, before-and-after comparison (drag slider; side-by-side on small screens), one or two sentences. Clicking a card opens all its photos (before, progress, after) with a "Get an estimate for a project like this" button. Newest first; featured pinned. Generated entirely from the project folders.

### Get an Estimate (`/estimate`), also the Contact page

- Headline: Request a Project Estimate
- Intro: Tell us about your project and we'll discuss the next steps.

Fields in this order:

1. I'm a... (big tap buttons): Homeowner · Builder or Contractor · Other
2. Project type (dropdown): Driveway repair or installation · Shed or garage pad · Drainage · Site prep or excavation · Utility trenching · Concrete · Demolition or cleanup · Home construction or renovation · Other
3. Name
4. Phone
5. Email (optional)
6. Project address or town
7. Tell us about your project
8. Upload photos: several at once, camera or photo library; also PDF plans when Builder or Contractor is picked
9. How did you hear about us? (optional)

Behind the scenes: prefill from the button that sent the visitor (e.g. `/estimate?type=drainage`); hidden fields for the source page and UTM parameters; each submission emailed to [EMAIL] with photos attached or linked; after submitting, a thank-you message with the phone number and "We'll get back to you within [1 BUSINESS DAY]"; spam protection without puzzles (honeypot and time check). Phone, email, hours, service area and social links also on this page. Build the photo upload so it can later feed a "Visualize your project" AI-sketch landing page.

### Ad landing page template (`/lp/shed-garage-pads`)

Hero, short benefit bullets, a before-and-after, a three-step how it works, and the estimate form right on the page. No main menu, just the logo and phone number. noindex. Jeremy will copy it for other campaigns, so keep it easy to duplicate.

### Ads, tracking and local SEO

- Every service section has a stable anchor (e.g. `/homeowners#drainage`).
- Marked spots for Meta Pixel and Google Analytics / Google Ads tags (done in `head.html` via config). Fire a lead conversion on form submit and a call event on phone taps (`tvisTrack()` in `site.js`).
- Unique title and meta description per page for Chattanooga searches; one H1 per page; descriptive alt text on every photo.
- LocalBusiness structured data (done, `schema: yes`), same name/phone/service area everywhere, `sitemap.xml`, `robots.txt`, favicon and Open Graph image (all generated by the build).

### Not now, but leave room for

- Auto-posting new before-and-afters to Facebook, Instagram and Google Business Profile from the project folders (keep folder format and `project.txt` fields stable).
- "Visualize your project": an ad landing page where a homeowner uploads a photo, an AI image tool sketches the finished job, and it all comes in as an estimate request.

### Placeholders still waiting

[PHONE], [EMAIL], [CITY, TN], [TOWNS AND COUNTIES], [HOURS], [LICENSED AND INSURED LINE], Facebook / Instagram / Google Business Profile URLs, [DOMAIN], [1 BUSINESS DAY], [OWNER TO SUPPLY] Home Construction intro, Basin form endpoint, tracking IDs, real jobsite photos (arriving this week), logo SVG (optional).
