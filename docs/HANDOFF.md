# TVIS website: build handoff

Read this first. It is the full brief plus every decision made so far, so a Claude Code session in this folder can continue without the earlier conversation. `docs/ROADMAP.md` has the phases from here to launch and after.

Last updated 2026-10-28 (full site rebuild, requested by Jeremy after the first live deploy; reviewed by screenshot before it goes into his folder).

## Status

- Research and the first design: done and approved by Jeremy on 2026-10-28 (review page: https://claude.ai/artifact/PdHEFQ2Ln37rjNDSD46U1V). The site was built from it the same day and went live at https://jsglisson3.github.io/TVIS-Site-Work-and-Construction/.
- **Jeremy then asked for a full rebuild** ("this is so bad still.. your gonna need to do an entire site rebuild"). The rebuild follows his original brief section by section (Joey's wording) and is what this document describes. The olive-poster look from the first redesign is gone. The mockups in `docs/design/` are the earlier, superseded look; the build is the reference now.
- Every page is built: homepage, `/homeowners`, `/builders`, `/more-services`, `/home-construction`, `/projects` plus `/project/<folder>` detail pages, `/estimate`, `/lp/shed-garage-pads` (landing layout, noindex), `/thanks` (Basin's no-JS redirect target) and `404.html`.
- Checked 2026-10-28 on every page at 390px, 768px and 1440px with no sideways scroll. Lighthouse mobile: 97 to 100 performance and 100 accessibility / best practice on every page; SEO 100 except the pages that are noindex on purpose (landing page, thank-you, 404, sample projects: 66). Estimate form prefill and the thank-you state tested in a headless browser against a fake endpoint.
- Docs: `README.md`, `HOW-TO-ADD-A-PROJECT.md`, `photos/site/README.txt`, `LAUNCH-CHECKLIST.md`, `docs/ROADMAP.md`.
- GitHub: repo `jsglisson3/TVIS-Site-Work-and-Construction`, Pages source = GitHub Actions (on). Jeremy does every commit and push from VS Code; each sync redeploys. The Claude GitHub App is not installed and Jeremy wants to keep merging manually.
- **Waiting on Jeremy / Joey:** everything under "Placeholders still waiting" at the bottom, the Basin account, and real photos.

### If you pick this up later

Work in `src/`, run `npm run dev`, check 390/1440 and Lighthouse before calling anything done, and look at your own screenshots. Form project-type codes: `driveway, pad, drainage, siteprep, utility, concrete, cleanup, home, other`; customer codes `homeowner, builder, other`. To add a landing page, copy `src/pages/lp-shed-garage-pads.html` (see README). One editor at a time: if Claude Code on Jeremy's PC and the project chat both touch the folder, update this file before switching.

Known small items: the three "Sample:" project folders hold drawn pictures and should be deleted once real jobs exist; `src/pages/home-construction.html` still needs Joey's intro; the design inspector's remaining flags are accepted on purpose: no real photographs or footage yet (the hero and cards show drawn cross-sections until photos land in `photos/site/`), little motion (one planned moment per page), and the phone call bar covering a heading at some scroll positions (the bar is the site's main conversion control).

## How the site is built (already in place)

- Plain HTML/CSS/JS, no framework. `npm run build` runs `scripts/build.mjs` (only dependency: `sharp`) and writes `dist/`. `npm run dev` builds and serves `dist/` at http://localhost:8080 with clean URLs (`/homeowners` serves `homeowners.html`, same as GitHub Pages).
- `src/pages/*.html`: one file per page. Front matter between `---` lines: `title`, `description`, `path` (optional), `nav` (which menu item is current: home, homeowners, builders, more_services, home_construction, projects, estimate), `schema: yes` (adds LocalBusiness JSON-LD), `noindex: yes`, `sitemap: no`, `layout: landing` (uses the `-landing` header and footer), `body_class`, `form_type` and `form_who` (prefill for a landing page's form).
- Template tokens: `{{> partial}}`, `{{phone}}`, `{{phone_href}}`, `{{email}}`, `{{base}}`, `{{service_area}}`, `{{hours}}`, `{{hours_footer}}`, `{{licensed}}`, `{{licensed_inline}}`, `{{response_time}}`, `{{facebook}}`, `{{instagram}}`, `{{gbp}}`, `{{form_endpoint}}`, `{{year}}`, `{{recent_projects}}`, `{{project_cards}}`, `{{home_construction_cards}}`. Empty config values render as yellow `<span class="tbd">[PLACEHOLDER]</span>`.
- Pictures: `{{photo slot="name" label="shot" alt="..." [draw="scene[:state]"] [sizes="..."] [eager]}}` shows `photos/site/<slot>.jpg` when it exists, otherwise the named drawing, otherwise nothing (a hidden note that `?slots` on the URL reveals). `{{ba slot="name" before="..." after="..." alt="..." [draw="scene"]}}` is the drag slider: real `-before`/`-after` photos when both exist, otherwise the drawn pair. `{{diagram name="pad" state="after" animate label="..."}}` places a drawing inline (the animated pad cross-section on `/homeowners`).
- Drawings live in `scripts/diagrams.mjs`: cross-sections of the work (driveway, pad, drainage, cleanup, siteprep, utilities, concrete, finalgrade) in the brand palette, with `before`, `after` and for some `progress` states. They are honest stand-ins, not pretend photos; nothing on the page calls them photos.
- `site.config.json` is the single source of business details (NAP consistency for local SEO).
- `projects/YYYY-MM-town-job/` folders → gallery. `project.txt` keys: title, category, town, status, featured, description. Photos named `before-N`, `progress-N`, `after-N`. Blank status shows In Progress until after photos exist. Newest first, featured pinned. The build also writes `dist/projects.json` (keep its shape stable for the future auto-posting automation). Three sample folders exist with drawn pictures from `scripts/make-samples.mjs`; their titles start with "Sample:".
- Logo: `src/assets/img/logo.svg` (full colour, on the white header) and `logo-reverse.svg` (white and light olive, on the charcoal footer), both rebuilt from Joey's original PNG with `scripts/trace-logo.py` as a clean vector (straight edges, sharp corners, identical window panes), crisp at any size. `logo-clean.png` stays only for the favicon and the social preview image. The header logo is 88px tall on desktop and 56px on phones.
- `.github/workflows/deploy.yml` is the GitHub Pages workflow. When there's no custom domain yet, it builds with `BASE_PATH=/<repo>`.

## Design system (the rebuild; don't drift)

Built with the `frontend-design` and `design-taste-frontend` skills, to Jeremy's original brief: a full-width jobsite hero with a dark overlay, big "I'm a Homeowner" and "I'm a Builder or Contractor" cards, four service cards, and a showcase header, logo and footer. Jeremy likes the green but it must not overpower anything, so olive is an accent only (buttons, bars, bullets), never a full-screen slab.

- **Scheme:** light pages on white with warm-gray `#F3F2EE` bands. The only dark fields are the hero (a photo under a scrim, or the drawn ground section until the photo lands), the statement band and the footer.
- **Colours:** ink / charcoal `#232B2E`, olive `#72852E`, olive-deep `#5E6E24` (buttons), olive-light `#A3B654` (on dark), tint `#EEF1E2`, warm `#F3F2EE`, stone `#E4E1D8`. Earth tones in the drawings come from `scripts/diagrams.mjs`.
- **Type:** Barlow Condensed 700 uppercase for headings and buttons (tracking .005em), Source Sans 3 for everything else, both self-hosted in `src/assets/fonts/` (the 700 weight is preloaded to avoid a layout jump). `--t-h1` clamp(48px, 7.4vw, 116px), `--t-h2` clamp(34px, 4.2vw, 58px), `--t-h3`, body 18px, small 16px. Headlines fit in two lines at every width.
- **Header:** white, sticky, full-colour logo (88px tall on desktop, 56px on phones). Nav: Homeowners, Builders & Contractors, Projects, More (Miscellaneous Services, Home Construction), quiet Facebook and Instagram marks, phone, "Get an Estimate". Phones: Call + Menu; the menu is a full-screen sheet with the phone number first, large links, and Get an Estimate in olive.
- **Phone call bar:** sticky bottom bar with Call and Get an Estimate. It stays hidden while the hero is on screen (`body.mbar-wait`, an IntersectionObserver in `site.js`) and slides up once the hero scrolls away.
- **Hero:** `{{photo slot="home-hero" ... draw="hero" eager}}` inside `.hero-bg`. Drop a real jobsite photo at `photos/site/home-hero.jpg` and it replaces the drawing (`heroScene()` in `diagrams.mjs`, a dark ground cross-section with a drain trench and survey stakes). Headline "Groundwork / Done Right." (Jeremy's choice over Joey's "From the Ground Up.", which stays as the tagline in the footer and config), then "Professional Sitework, Driveways, Drainage & Property Improvements.", Joey's serving line, and two buttons: Request an Estimate and Call. On phones the scene is a band above the text.
- **Homepage order:** hero, "Who's the project for?" (homeowner and builder cards), "The work we do most" (four service cards: driveways, shed and garage pads, drainage, site preparation), recent projects with the drag slider, the statement band "Small Jobs. Big Projects. Same Attention to Detail.", the hidden reviews section (stays hidden until real reviews exist), "Serving Chattanooga and surrounding communities" with the closing estimate card.
- **Footer:** charcoal with an olive ground line and a small dozer on it. Four columns: reverse logo and description with Facebook, Instagram and Google marks; Contact (phone, email); Pages; Service area with the licensed-and-insured line. Legal line carries the tagline. Landing pages use a shorter header and footer.
- **Inner pages:** a light warm opening (`.phero`, split: text left, picture right on desktop; picture hidden on phones), then the sticky jump bar where a page has sections. Each service section puts its heading across the full width, then bullets on one side and the drawn or real before/after on the other.
- **Photo slots to fill** (all in `photos/site/`, named `<slot>.jpg`): `home-hero`, `home-homeowner`, `home-builder`, `home-svc-driveways`, `home-svc-pads`, `home-svc-drainage`, `home-svc-siteprep`, plus the inner-page opening slots listed in `photos/site/README.txt`. Until then each shows its drawn cross-section.
- **Buttons:** square, flat, no shadows, no gradients. `.btn-primary` olive-deep, `.btn-outline` for the second action on dark.
- **No** carousels, counters, icon-card grids, tiny letter-spaced labels, numbered steps unless the content is a sequence, gray photo boxes, or yellow placeholders meant for launch.
- **Before/after:** drag slider (`[data-ba]`, range input, keyboard accessible) over real photo pairs or the drawn pairs.
- **Cache:** `build.mjs` appends a content hash (`?v=...`) to `/assets/site.css` and `/assets/site.js`, so a deploy never leaves a browser with new HTML and old CSS.

## Motion (one planned moment per page, `prefers-reduced-motion` shows the finished state)

1. **Homepage load:** the hero headline, service line and buttons settle into place once (`settle` keyframes).
2. **Homeowners `#pads`:** the drawn pad cross-section builds up as it scrolls into view. Static final state without JS.
3. **Footer:** a small dozer (`src/partials/dozer.html`) rolls in once along the olive ground line when the footer comes into view.


## Open questions: answers (Jeremy said "go with your picks")

1. Form service: **Basin** (usebasin.com). Free plan includes file uploads (100MB storage, 50 submissions/mo); Starter $12.50/mo yearly if needed. Runner-up Formspree. Put the endpoint in `site.config.json > formEndpoint`; until then the form shows a clear "form not connected yet" notice instead of failing silently. Test with 3 phone photos before launch to see if files arrive as links or attachments.
2. Text option: add a **Text** button next to Call (phone bar becomes Call / Text / Estimate) only when `phoneTakesTexts` is true in config.
3. Owner's name: show "Call or text {ownerFirstName}" only when `ownerFirstName` is filled. Don't guess a name.
4. Form: **one page**, the nine fields in the order below (not multi-step).
5. Add a short **"What happens next"** block by the form (we look at your photos and details, we call you to talk it through, we visit the site if needed, you get an estimate). No promised times beyond `responseTime` (`[1 BUSINESS DAY]` placeholder).
6. Code stays in this folder; when the GitHub repo `jsglisson3/TVIS-Site-Work` exists, this folder becomes it.

## What's left, in order

Build and redesign are done (2026-10-28). What remains is content and connection, in the order `docs/ROADMAP.md` gives: fill `site.config.json`, add photos to `photos/site/`, replace the sample projects, set up Basin, add tracking IDs, buy the domain, then run `LAUNCH-CHECKLIST.md`.

## Research highlights to apply

- Page titles: "[Service] in Chattanooga, TN | TVIS Construction". Use these phrases in titles, meta descriptions, first sentences, alt text and image file names: gravel driveway repair, gravel driveway installation, driveway culvert installation, gravel pad for shed, shed pad, garage pad, French drain installation, yard drainage, downspout drain, standing water in yard, excavation contractor, residential site prep, utility trenching, final grading, shed demolition, brush clearing, concrete pad.
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

[PHONE], [EMAIL], [LICENSED AND INSURED LINE] (hours are optional and hidden while blank; base location and service area were set 2026-10-28: Chattanooga, TN / Chattanooga and the surrounding counties), Facebook / Instagram / Google Business Profile URLs, [DOMAIN], [1 BUSINESS DAY], [OWNER TO SUPPLY] Home Construction intro, Basin form endpoint, tracking IDs, real jobsite photos (arriving this week). The logo SVG is done.

## Photo design pass (2026-10-28, night) — NOT yet in Jeremy's folder

Joey's real jobsite photos arrived (zip of 137 photos + 6 videos, videos skipped). Every photo is converted to JPEG with a contact sheet in `/mnt/project-files/tvis-photos/` (`index.json` numbers them by capture date; `sheets/` shows them all). Design only; Sunday's job is to write this to his folder and finish.

What changed:
- 28 photo spots filled in `photos/site/` (see `photos/site/PICKS.txt` for which photo went where). Alt text on every filled spot now describes the real photo.
- 4 real projects in `projects/` replace the 3 samples (samples removed here; **Jeremy must delete the three `*-sample-*` folders from his folder by hand**, a remote write can't delete). Town and description are `[TOWN]` / `[CONFIRM]` until Joey confirms.
- Homepage: photo hero (desktop scrim lighter on the right so the machine shows; phones get the photo on top and the words on solid charcoal below), new `home-band` photo behind the statement band.
- Inner page headings: a real photo fills the right half out to the screen edge on desktop and runs full width under the words on phones (drawings keep the old boxed look).
- Build: image widths now 480/720/960/1600 at webp quality 70; first Projects card loads eagerly; phone `sizes` trimmed on heroes and project cards. Lighthouse mobile performance: home 95, homeowners 96, builders 92, more services 91, projects 95, shed pad ad page 94.

Still drawings (no matching photo yet): homeowners drainage and yard cleanup before/after, builders site-prep before/after, more-demolition. Pad steps and the shed pad ad page show concrete slabs, while Joey's copy says gravel pads; ask whether the copy should say concrete.

Final polish (2026-10-29 00:30 UTC, written to his folder): type scale and spacing a touch smaller site-wide; the last drawings on Homeowners (pad cross-section, drainage, cleanup) and Builders (site prep) replaced by single real photos (`pads-feature`, `homeowners-drainage`, `homeowners-cleanup`, `builders-site-prep`; the `{{ba}}` pairs can come back when a same-spot before/after exists); dozer redrawn facing its direction of travel, with static copies on the 404, thanks page and phone menu (`.dozer-spot`).

## Scroll-feel pass (2026-10-29)

- Before/after sliders: the invisible range input used to cover the whole photo, so on phones a thumb swipe over a slider fought the page scroll. Drags are now read on the `.ba` box with `touch-action: pan-y` (sideways moves the handle, up/down scrolls the page); the range input stays for keyboard and screen readers.
- Phone Call / Estimate bar on the home page: slides in once the opening's buttons are well above it and only slides out near the top (hysteresis), instead of flickering with every few pixels of scroll.
- Jump bar: the active link scrolls the bar sideways only, never the page. Pages with a jump bar get extra `scroll-padding-top` so anchors land clear of it.
- Wide screens and browser zoom-out: inner page heroes bleed at most 96px past the content column and the photo stops at 640px tall.
- Flipped service sections (`.sv-flip`) now stack on phones; the desktop column rule used to win.

## Joey's answers (2026-10-29)

- Service towns (`serviceTowns` in site.config.json, shown on the home page): Chattanooga, Downtown, St. Elmo, Red Bank, Signal Mountain, Hixson, Soddy-Daisy, Highway 58, Brainerd, East Brainerd, East Ridge, Ooltewah, Cleveland, Jasper, Sequatchie County, North Georgia. Spellings cleaned from Joey's message.
- The asphalt driveway photos (#114 home-homeowner card, #119 homeowners hero) are TVIS work.
- Concrete: yes, TVIS does concrete work. Pad copy on Homeowners, the home page card and the shed-pad ad page now says "gravel or concrete"; the Homeowners pad list says "Concrete pads and slabs".
- Facebook page: https://www.facebook.com/profile.php?id=61595961032699 (in site.config.json; header, footer and estimate page pick it up). Instagram still coming.
- Licence: Joey is getting his licence back soon. Do NOT claim licensed anywhere until he says so; `licensedLine` stays empty (yellow placeholder).
- Drainage, cleanup and demolition photos: probably later.
- Still waiting: project towns and descriptions, phone, email, Instagram, Google Business, licence wording.
- Phone 423-618-3112 came from Joey's Facebook post (2026-10-29); Jeremy to confirm it is the number for the site. `phoneTakesTexts` still false until Joey says texts are fine.
- Home page "The work we do most" now carries the same six services as Joey's Facebook banner (Site Prep & Excavation, Drainage & Culverts, Driveways & Gravel Work, Concrete & Flat Work, Pads for Sheds & Garages, Demolition & Removal), 3 x 2 on desktop. Facebook uses a different logo ("TVIS Construction"); the site keeps its logo until Jeremy decides. The Facebook address is a mailbox unit and is not shown.

## Domain (2026-10-29)

Domain confirmed: tvisconstruction.com (set in site.config.json 2026-10-29 01:21 UTC). Everything keys off `site.config.json > domain`: the deploy workflow builds with no subpath when it is filled, and the build writes `CNAME`, `sitemap.xml`, `robots.txt`, canonical, `og:url` and an absolute `og:image`. Order: fill `domain`, commit + Sync, then Settings > Pages > Custom domain, then DNS (Cloudflare: CNAME `www` and apex records to `jsglisson3.github.io`, DNS-only, per the coordinator's steps). Until the DNS is live the old github.io address keeps working because GitHub redirects it to the custom domain once Pages accepts it.

## Production clean-up (2026-10-29 02:30 UTC, after go-live)

- `launchMode: true` in site.config.json: blank optional details (licence line, project towns, `[CONFIRM]` prefixes, empty social icons) are left out instead of showing a yellow placeholder. Set it to false while building so the placeholders come back.
- Home Construction page is built but unlisted (noindex, out of the sitemap, nav and footer) until Joey writes its intro and a home-construction project exists. The "More" dropdown became a plain "More Services" link.
- Projects page filter buttons only appear for categories that have a project.
- Social icons show only when their URL is filled (Facebook is; Instagram and Google Business are not yet).
- Shorter page titles. Form notice (until the Basin endpoint is in) tells visitors to call or message on Facebook.

## SEO pass (2026-10-29 02:40 UTC)

- LocalBusiness JSON-LD on every indexable page (service towns as areaServed, the six services as an OfferCatalog, Facebook as sameAs, phone and email), plus BreadcrumbList on inner pages. `googleSiteVerification` in site.config.json prints the Search Console meta tag. Descriptions trimmed under 160 characters, `og:locale` added. Still for Jeremy: verify the domain in Search Console and submit the sitemap; create the Google Business Profile and put its URL in `googleBusinessProfile` (the biggest local-search lever); real reviews go in the hidden reviews section on the home page.

## Service pages + share image (2026-10-29 ~04:00 UTC)

- Six Google-facing service pages in `src/pages/svc-*.html`: /site-prep-excavation, /drainage, /gravel-driveways, /concrete, /shed-garage-pads, /demolition-cleanup. Front matter `service: yes` adds Service JSON-LD; `projects: <category-slugs>` pulls up to three matching jobs into a "Recent job like this" section (omitted when the category is empty).
- Home service cards and a new footer "Services" column link to them. Header "More" dropdown replaced with a plain "More Services" link.
- `og-image.jpg` is now generated by build.mjs from `photos/site/home-hero.jpg` with the white logo (falls back to logo on gray if the hero is missing). Used for Facebook/Instagram/text-message link previews.
- Still pending: Basin endpoint (`formEndpoint`), Search Console code (`googleSiteVerification`), Google Business Profile URL (`googleBusinessProfile`). All three are site.config.json keys; no page edits needed.
- Phone number is temporary (Joey will change it): it only lives in site.config.json `phone`.

## Name change (2026-10-29 04:10 UTC)

The business is now **TVIS Construction** (Jeremy). `site.config.json > name` drives titles, footer, schema and alt text; hard-coded mentions in page titles, the home intro, README, CLAUDE.md and package.json were updated too. The logo's bottom line now reads "CONSTRUCTION" instead of "SITE WORK AND CONSTRUCTION": `scripts/rename-logo.py` (already run once) kept the traced letters, scaled them 1.2x and spread them across the width of "TVIS" in both logo.svg and logo-reverse.svg. The favicon uses only the top mark, so it did not change. `src/assets/img/logo-clean.png` still has the old line but is only used for the favicon crop. The GitHub repo name and folder name still say "Site Work"; that does not show on the site.
- 04:25 UTC update: Joey's new artwork (NewLogo.jpg in the folder root, round badge) is now matched. `rename-logo.py` was redone from the trace output: CONSTRUCTION is inset under TVIS with a thinner, shorter olive bar, as in the artwork (viewBox now 1619x776). build.mjs makes the round badge (`logo-badge.svg`) and uses it for favicon-32, apple-touch-icon and logo-512 (the logo in Google's business info). The wide logo stays in the header and footer because the round badge would make TVIS tiny in a 72px header.

## Estimate form live (2026-10-29 04:25 UTC)

`formEndpoint` = Basin form https://usebasin.com/f/4513058586c6 (Basin account under tvisconstruction@gmail.com; notifications should go to info@tvisconstruction.com). The "form is being set up" notice disappears automatically. Do a real test submission with a photo after each change to the form.
- 04:40 UTC: site email changed to **info@tvisconstruction.com** (Google Workspace on the domain, set up 2026-10-29). Only `site.config.json > email` changed.

## Final polish (2026-10-29 04:55 UTC)

- Phone number trimmed (Jeremy: "excessive"). It now shows in the desktop header, the footer, the estimate page contact card, the thank-you panel and the 404. Hero links say "Call us" and end-of-page CTAs say "Or call us" (class `call-link`); all still dial the number.
- Header: Facebook shows the blue brand mark (icons.html `i-fb`, everywhere), phone has an icon, nav 17px ink, hairline under the header, logo 92px, font smoothing on. Logo lettering stroke raised to 9 for crisper small sizes.
- 05:00 UTC header design pass (Jeremy asked for "super sharp", and explicitly for drop shadows, overriding the no-shadow rule for the header): 4px olive stripe on top, nav in Barlow Condensed uppercase with an olive underline that draws in on hover, divider before Facebook, phone with a small "Call us" label, soft layered shadow under the header and on the Get an Estimate button (lifts 1px on hover).
- 05:10 UTC final review: 20 pages, no broken internal links, no visible placeholders except the unlisted /home-construction (noindex, not linked). Project pages now end with "Or call us" instead of the big number; footer/estimate Facebook icon 30px. Lighthouse mobile on the local server (no gzip): home 90, builders 90, concrete 92, estimate 99, project page 99; accessibility, best practices and SEO 100 on all. Lighthouse needs `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` in the cloud container.
- 05:35 UTC estimate page polish: the dotted "slip" is replaced by a numbered "How it works" card (`next-steps.html`, `.steps-card`, also on service pages and the ad landing page). The estimate form and the Talk to TVIS box are now white cards with a soft shadow on a warm-gray band, with softer input borders, an olive focus glow and a lifting send button.

## Style locked (2026-11-02)

Jeremy asked to lock in the live look as the baseline to build on. It is written up in `docs/STYLE-GUIDE.md` (colour tokens, type scale, spacing, shadows, every component, photo rules, motion, words, logo, quality bar). CLAUDE.md now points to it. No visual changes were made.

## Second photo batch placed (2026-11-02)

Joey's second batch (58 photos, numbered #138-#195 in `/mnt/project-files/tvis-photos-2/index.json`; picks and crop notes in `PLACEMENTS.md` there) filled the weak spots from the slot map. Nine slots changed (see `photos/site/PICKS.txt`): home-svc-drainage, home-svc-concrete, home-svc-demolition, more-demolition (was a drawing), builders-hero, homeowners-hero, homeowners-cleanup, pads-feature, lp-pads-hero. Labels and alt text were rewritten to describe the new photos. The Demolition & Cleanup page photo now uses the `more-demolition` slot (excavator by a debris pile) so that page isn't two empty lots. homeowners-drainage keeps the rock swale on purpose; the culvert shot (#177) was weak at page size.
- New projects: `2026-02-lot-clearing` (real before and after) and `2026-05-home-site-prep` (progress only). `2026-04-lot-clearing-footings/progress-1` swapped for IMG_5204 (the old one had the photographer's shadow). A third, backyard grading (May 2025, progress only), is held in `/mnt/project-files/tvis-photos-2/held-projects/` until there is an after photo; adding it would leave one card alone on a row. Towns and descriptions are still [CONFIRM] with Joey.
- Still missing: a real demolition photo (shed or trailer coming down, or a dumpster/haul-off).
- Speed: project detail pages scored in the high 70s on Lighthouse mobile. The top before/after slider now loads eagerly, and slider and gallery photos use `sizes` that match the real width (`calc(100vw - 40px)`, or `50vw` for the two-column gallery on phones). `scripts/serve.mjs` now gzips text files like GitHub Pages does, so local scores match live. All changed pages score 90+ (perf), 100 on the rest (the ad landing page's SEO score is low only because it is noindex on purpose).

## Full-site audit pass (2026-11-02)

Jeremy asked for a two-hour "refine, don't reinvent" review of every page. Every page was screenshotted at 390, 820 and 1440px (full page), run through axe-core, html-validate, a link check, an overflow/tap-target/small-text script and Lighthouse mobile, then looked at slice by slice. The layout, section order, copy and look are unchanged; these are the details that moved:
- **Layout.** Service pages with one related job (`relatedProjects` adds `proj-grid-one`) now show that job across the whole row, slider left and text right, instead of one card and two thirds of empty space. Tablets (600-900px) show project cards two across. On phones and tablets the home hero no longer stretches to the screen height (it left a big empty charcoal block on tablets); the photo may grow to 420px on wider screens.
- **Tap targets.** Hero "Call us" links, "See all photos", the "← All projects" crumb and the footer links are padded to 30px or taller without moving anything (WCAG 2.5.8).
- **Typography.** Straight apostrophes in the copy are now `&rsquo;` (home already used it), "I'm a..." is "I’m a…", quotes around "Other" are curly, "New-Construction" never breaks after the hyphen (`.nowrap`), related-service links never break mid-name, the steps-card result line is 14px (was 13) and the header "Call us" label 13px (was 12). The live-project badge dot is square like every other corner.
- **Titles.** Home, Homeowners, More Services and Projects titles are under 70 characters; project page titles drop the category when the full form would pass 66.
- **Accessibility.** The h1s "Groundwork / Done Right." and "Thank you. / Your request is in." have a space between the lines for screen readers. `who-body` and `svc-body` are `div`s (they hold headings). Jump links clear their highlight when no section is on screen (it used to stick on the last one after scrolling back up). The address field uses `autocomplete="address-line1"`.
- **Housekeeping.** Dead dropdown CSS/JS (`.has-sub`, `.sub-btn`) and the unused `--field` token are gone.
- **Checked after:** no sideways scroll on any page at any size, axe clean (same two "needs review" contrast notes as before: text over the hero photo and the form legend), Lighthouse mobile 91-100 on every page type. One pre-existing note, not changed: Lighthouse reports CLS 0.15 on /projects in its own throttled run; a direct measurement in a throttled Chrome shows 0, so it is likely the font swap under Lighthouse's simulation. Worth a look if the score ever matters.

## Photo panels (2026-11-02, second polish pass, batch 1)

Jeremy's reaction to the audit pass: the changes were too small to notice, and the section photos "look bolted on". The fix, same layout and style guide, is that every section photo now behaves like the hero: it runs to the screen edge and the full height of its section instead of sitting in a box inside the text column.
- **Service and homeowners/builders sections (`.sv`, `.sv-flip`).** On desktop the photo spans the section's full height (`grid-row:1/span 9`, `align-self:stretch`, min 440px) and bleeds to the near screen edge by the new `--bleed` token (gutter plus up to 96px of the margin outside `--max`). The section heading moves into the text column (`.sv h2{grid-column:2}`, flipped sections `grid-column:1`), so the photo is one block and the text is the other. Sections alternate sides as before. The parent gets `overflow:hidden` so the bleed never causes sideways scroll.
- **Pads section (`.pads-pic`).** Anchored to the section's top-right corner (negative top and right margins), the text column starts at the top beside it.
- **Landing page two-column (`.lp-two`).** Same treatment, photo on the right.
- **Phones.** Section photos run edge to edge (negative `--gut` margins) above the text. The pads photo too.
- **Project galleries (`.pd-grid`).** The first photo leads: with 3+ photos it spans two columns and two rows (3 → feature plus two stacked; 6 → feature plus five); 2 or 4 photos use a two-column grid with equal tiles. On phones the lead photo spans the row at its own height and the rest sit two across with 8px gaps.
- **Hooks.** `photoBlock` in `scripts/build.mjs` adds `data-slot="…"` to every photo wrapper, so a crop that cuts a subject can be fixed per slot with `.photo[data-slot="x"]>img{object-position:…}` without touching the page. None were needed on the current photos.
- **`sizes` hints** on the six panel photos are `(min-width: 900px) 56vw, 100vw` so the 960/1600px renditions are chosen on desktop.
- Not done on purpose: no captions, no filters, no decorative plates or overlapping offsets. The photo is the decoration.

## Second polish pass, batch 2 (2026-11-02)

The "ruthless list" after batch 1, all small, all across the site:
- **Page endings.** `.cta-actions` (the "Ready to get started?" / "Have a project like one of these?" bands on ten pages) is a row now: button and "Or call us" side by side, centred on the heading, instead of stacked in the top-right corner with a hole under them. Phones still stack them.
- **Estimate page.** The intro band has no bottom padding on this page (`.page-estimate .phero{padding-bottom:0}`) and the form section starts 28-48px below it instead of 88-160px.
- **Thank-you page.** The dark panel spans the content width (`.thanks-page .thanks{max-width:none}`, paragraphs capped at 60ch) and the phone number sits on its own line under "Want to talk sooner? Call" (`.thanks-phone{display:block}`). The inline thank-you inside the estimate form uses the same rule.
- **Project pages.** The title block and the before/after slider share a row (`.pd-top`, 2fr/3fr, slider bleeding to the right edge like the service panels; the `.pd` section is `overflow:hidden`). The h1 beside a slider is capped at 66px. A group with a single photo shows it across the full row at 16:9 instead of two thirds of the row with an empty third. `gallerySizes` in the build script carries the matching `sizes` hints. Phones stack the title over an edge-to-edge slider.
- **Service pages and the ad page.** `.lp-two h2` keeps a 20-32px gap to the list that follows it (`.lp-two h2 + .bul{margin-top:0}`); it used to be 76-110px.
- **Statement band.** The scrim is `.76 / .48 / .76` across (was `.8 / .6 / .8`) so the concrete-pour photo reads; the text still sits in the darker thirds.
- **Font stand-ins.** `"Barlow Condensed Fallback"` and `"Source Sans 3 Fallback"` are `local()` Arial / Liberation Sans / Helvetica / Roboto faces with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` measured against the webfonts (average glyph widths: condensed caps 67.5% of Arial Bold, body 91.6% of Arial), so the swap to the real fonts does not move the layout. They sit second in `--display` and `--text`.
- Checked after: all 22 pages at 390/820/1440, axe, Lighthouse mobile. Note: Lighthouse still reports CLS 0.15 on /projects with an empty shift list, and a direct PerformanceObserver probe (throttled and unthrottled) reports 0, so it is not something a visitor sees; left as is.
- **Share previews per page (folded into this batch).** `sharePhotoFor` in the build script gives every page its own 1200x630 Facebook/Messenger preview built from the photo in its opening section (`og_photo:` in the front matter overrides it), and every project page one from its finished photo. They are written to `dist/img/og/` (kept between builds like the resized photos) and only the home, projects, estimate, thank-you and 404 pages keep the default `og-image.jpg`. Facebook caches old previews per URL; use the Sharing Debugger to refresh a link that was shared before.
- The pads section's "Get an estimate" button is full width on phones like every other section button.
- **Projects filter row (batch 3).** The category buttons are generated at build time (`project_filters` in the build script) for categories that have at least one job, instead of all eight being rendered and the empty ones hidden by site.js after the page painted. On phones that late hide shrank the row and jumped the grid up: the CLS 0.15 Lighthouse kept reporting on /projects. Now 0 (performance 99 on the mobile run). The after-paint hide loop came out of site.js; the click filter, the `?type=` deep link and the live status line were re-tested.
- **Estimate "I'm a..." options** stay three across down to 560px (they used to stack below 900px, so tablets showed three full-width bars).
- **Home service-area towns (batch 4)** are a list (`service_towns_block` in the build script: three columns, two on phones, small olive squares like the service-page lists) instead of one bold run-on sentence. The list is split from `serviceTowns` in site.config.json on commas and "and", the same split the LocalBusiness `areaServed` uses, so the config field stays a plain sentence. With the field blank it falls back to the placeholder paragraph.
- **sharp 0.35.2 -> 0.35.5 (batch 4).** `npm ci` on the deploy was reporting one high-severity audit finding in sharp (libheif/librsvg advisories, build-time only). Bumped in package.json and package-lock.json; a from-scratch rebuild produced the same 138 site images, 124 gallery images and 16 share images as the deployed bundle, audit now clean.
- **Estimate page opening (batch 5).** The title, intro and "Prefer to talk? Call us" now live inside the form column (`.est-intro` in src/pages/estimate.html) instead of a separate full-width opening section, so on desktop the "Talk to TVIS" card and "How it works" start level with the title and the empty right half above the sidebar is gone. Phones and tablets stack exactly as before (intro, form, contact card, steps). The intro keeps the same type, olive bar and one-time settle animation as the other page openings. The "optional" hints on form labels wrap as one piece now (`.opt` is inline-block, nowrap), so a phone no longer shows "...they help a" / "lot".
- **"See all photos" links on project cards (batch 5)** have a 42px tap height (12px vertical padding instead of 6px, top margin folded in so the text sits where it did). The audit shots kept flagging them at 30px; everything else on a phone is already 37px or taller.

## Header sprint (2026-11-02, 03:45 to 04:15 UTC)

Jeremy asked for a max-effort pass on the header, nav and hero only. Everything is in site.css and site.js; no markup changed.
- **Fixed header, nothing moves.** `.hdr` is `position:fixed` and the body carries `padding-top:calc(var(--hdr-h) + var(--hdr-edge))` (`--hdr-edge` = the 4px olive stripe + 1px hairline). The hero, the `.jump` bars, the phone menu and `scroll-padding-top` all use the same two variables, so the hero starts exactly under the header and anchors land clear of it.
- **Compact on scroll (1024px up).** site.js adds `hdr-compact` to `<html>` once the page is past 140px and removes it under 48px (hysteresis, so it never flickers). CSS then shrinks only the inner bar (`--hdr-now:84px`, logo 62px, button 48px) with a .3s ease; the body spacer never changes, so there is no layout shift. Reduced motion makes it instant.
- **Width tiers, measured.** The full header (logo 88 + nav + divider + Facebook + phone + button) used to overflow the bar from 1181 to about 1250px and sat 36px wide of the content column at 1440. Now: 1360px up shows everything inside the content column (same left and right edges as the hero text and the grids, about 38px spare at 1440 and 1920); 1181 to 1359px drops the Facebook mark (logo 80, bar 108, nav 16px); 1024 to 1180px also drops the phone number (logo 74, bar 100); under 1024px it is the logo, "Call" and "Menu" (bar 88 / logo 64 down to 600px, then 76 / 56 on phones). The audit script reports no sideways scroll.
- **Nav states.** Letter-spacing .05em, hover turns the word olive and draws the underline (.25s), focus-visible shows the ring 6px out plus the underline, the current page keeps both.
- **Button.** The header button lifts 1px with a deeper olive shadow on hover, presses flat on click, focus ring 4px out. `.btn` transitions are limited to colour, shadow and transform.
- **Hero.** Fills exactly to the fold (`100svh - header`). The scrim gained a light foot at the top (.34 to 0 over the top 24%) so the white header sits on the photo, and a deeper foot at the bottom (0 to .42 over the bottom 40%). On desktop the photo eases from 104.5% to 100% over 1.8s as part of the one entrance moment. The serving line is capped at 52ch so it sits on two lines, not three. Phones show the photo at 36svh (was 32).
- **Phone menu.** Slides down .28s and its links settle in with 40ms steps; the menu starts exactly under the bar at every tier. "Call" and "Menu" dim on press. The ad landing header's phone link has a 48px tap height.
- Checked: screenshots at 390 / 600 / 820 / 1024 / 1181 / 1280 / 1440 plus hover, focus, scrolled and open-menu states; axe clean (the two "needs review" contrast notes are text over the photo and the form legends, both pre-existing); Lighthouse mobile on the home page 92 / 98 / 95 over three runs (LCP 2.3 to 3.3s is the 192KB hero photo on simulated slow 4G, same as before the sprint); no sideways scroll on /, /estimate, /drainage, /lp/shed-garage-pads, /404.html, /projects.

## Photo variety pass (2026-11-02, 04:00 to 04:40 UTC)

Built from /mnt/project-files/tvis-photo-library/VARIETY-PLAN-2026-11-02.md (the "Use more photo variety across the site" thread's audit), approved by Jeremy at 04:01 UTC with "make your best guess but just get all these merged in". Before it, three service pages showed the same photo twice (the borrowed slider matched their own project card) and the hillside house was in four spots on the home page.
- **Swaps in photos/site/:** home-band (#164, cleared lot with footings), home-svc-siteprep (#151, skid steer in a backyard), home-svc-driveways (#36, gravel up to a blue home; the old #93 moved to the new `svc-driveways-hero.jpg`), pads-step-1 (#122, forms from a step back, cropped to keep a worker out), pads-step-3 (#153, a real crushed-stone base, so the photo matches its "Compacted gravel base" heading), pads-step-4 (#134).
- **Each service page has its own opening photo and a single photo panel instead of a borrowed slider** (`src/pages/svc-*.html`): Concrete `svc-concrete-hero` (#15) + `svc-concrete-panel` (#103, finisher edging a pour, [CONFIRM with Joey the worker is fine to show]); Site Prep `svc-siteprep-hero` (#1) + `svc-siteprep-panel` (#138); Gravel Driveways `svc-driveways-hero` (#93) + `svc-driveways-panel` (#177, culvert under a new gravel entrance, cropped to keep the SUV and the portable toilet out); Shed & Garage Pads `svc-pads-panel` (#128, walls going up on the slab). Builders, Homeowners and the ad landing page keep their sliders. The share images for those three pages follow their new opening photo automatically.
- **Four new project folders** (all Completed, no before photos, so the card shows the lead photo and the detail page has no slider): `2026-06-harrison-drainage-yard` (Drainage, Harrison, featured, 6 after photos; the first Drainage project, so the Drainage page shows a job card and the Projects filter row gained Drainage), `2025-02-chattanooga-concrete-driveway` (Concrete, Chattanooga; #138 as progress-1), `2025-05-backyard-grading` (the held project, now with the stone-base "after" photos; town blank because the GPS points outside the service area), `2025-08-east-brainerd-two-new-homes` (New Construction Sitework, East Brainerd).
- **Gallery fixes:** `2026-04-lot-clearing-footings` gained after-2/3 (#61, #62, the home set on the footings) and its progress-2/3 are now #166/#169; the old #56/#58 were footing trenches at a different site according to the photo GPS (#56 stays as the Builders page's standalone photo). `2026-09-new-home-final-grading` gained after-3 (#94).
- **Featured:** the drainage yard is featured and the hillside driveway is not, so the home page's Recent projects no longer repeat the hero house. Home page order is now final grading, drainage yard, garage pad.
- **Towns (best guesses from the GPS in Joey's originals; Joey can correct them in project.txt):** hillside driveway = East Ridge; the four Feb to Sep 2026 lot projects = Sequatchie County (one site, possibly several lots in one development; Joey can say whether to merge them into one start-to-finish project); garage pad = blank (Reelfoot Lake, far outside the service area). Town names only, never coordinates; the build still strips GPS from every photo.
- PICKS.txt, photos/site/README.txt and /mnt/project-files/tvis-photo-library/PHOTO-REGISTRY.csv are updated (43 rows). The build now has 10 project folders.

## Phone, tablet and desktop sweep (2026-11-02, 04:40 to 05:00 UTC)

Jeremy's last ask of the night: make sure every page is right on a phone, a tablet and a desktop. All 26 pages (16 pages + 10 project pages) were screenshotted at 390 / 820 / 1440 after the header sprint and the photo pass: no sideways scroll, no broken images, no console errors anywhere (the only "off-screen" elements are the form's honeypot field, which is meant to be). What changed:
- **Tablets held upright (600 to 900px) use the width.** The home "Who's the project for?" cards, the More Services list and the footer link groups are two across instead of stacked like a phone (`@media (min-width:600px) and (max-width:900px)` in site.css, the same block that already put the project grid two across). Everything else keeps the phone stacking, which suits the edge-to-edge photo panels.
- **Tap heights.** "Call us" text links on the page openings are 44px tall on phones and tablets (were 37). On the estimate page, "Give us a call" under the form, the big phone number and the email link in the Talk to TVIS card have an invisible 44px tap area (padding with a matching negative margin, so nothing moved).
- Left as is, on purpose: project titles in cards are text links about 30px tall (the whole card photo and "See all photos" also lead to the project), the hidden "Skip to content" link, and the 13px "Call us" label over the header phone number (a label, the number under it is the link).
- **Leftover, fixed in source after the push (not yet in Jeremy's folder):** the three swapped home-page photos kept their old alt text in src/pages/index.html. Now: home-band "Cleared wooded lot with new footings poured for a home", home-svc-siteprep "Skid steer grading a backyard beside a new home", home-svc-driveways "Fresh gravel spread around a new home". Goes out with the next batch.

## Final touches (2026-11-02, 05:55 to 06:10 UTC)
Jeremy's last asks of the night, plus a few small wins:
- **No "Completed" chips.** Project cards and project pages read "Town · Service" only. A chip shows only for a job whose `status:` is `In Progress` (`projectRow` in build.mjs). The `status:` field in project.txt is unchanged.
- **Calmer hero (desktop and laptop only).** Headline 56 to 78px (was up to 104), subhead 19 to 23px, olive bar 80x7, hero height `clamp(520px, 88svh minus the header, 720px)` (was up to 820), photo focus at 55% down so the house roof and the excavator tracks both stay in frame. Same layout, photo and copy. Phones unchanged. Rules are in the "Final touches" block at the end of site.css.
- **Phone number out of Google's snippets.** Google had been quoting header and footer text ("Services Call us423-618-3112", "Contact. Call. 423-618-3112"). Header bar, phone menu, footer, the phone call bar, the estimate page's Talk to TVIS card and every other printed phone number now carry `data-nosnippet` (Google's documented attribute: the text is still crawled, just never quoted in a result). The number stays on the site for callers (Jeremy's choice). Header phone markup also has a real space between "Call us" and the number. Home title now "TVIS Construction | Excavation & Sitework, Chattanooga TN" (fits Google's width, so Chattanooga is no longer cut off) and description "Washed-out driveway, standing water or a lot to clear? TVIS Construction does excavation and sitework around Chattanooga. Send a few photos for an estimate." (written to Google's snippet guide: a short pitch in full sentences, not a keyword list; opens with the two problems homeowners search for, in Joey's own words from the site, then who, what and where, then the next step. Nothing unconfirmed such as "free", "licensed" or years). Jeremy asks Google to re-crawl / and /estimate in Search Console after the push.
- **New favicon.** Google showed the round badge, which shrank to an unreadable smudge. Now a square mark: white TVIS (Barlow Condensed 800, converted to outlines) over an olive bar on charcoal, master file `src/assets/img/favicon.svg`. The build makes favicon-48/96/192 PNGs, apple-touch-icon (180), favicon-32 (kept for old links) and `/favicon.ico` (16, 32, 48) at the site root; head.html links the ICO, SVG, 96 and 192 sizes. The round badge stays as `logo-512.png`, the logo in the business structured data.
- **Google mark next to Facebook** in the header (1360px up), phone menu, footer and the estimate card. Until `site.config.json > googleBusinessProfile` has the profile link it is a plain mark (not a link, "coming soon" tooltip); once the link is filled in, the build turns it into a link everywhere. To fit, the 1360px-up header tightened its gaps a little and the two social marks are 40px boxes; measured spare room is 25 to 41px at 1360 to 2560.
- The three home-page alt texts from the sweep went out with this batch.
- Checked: hero at 1920 / 1440 / 390, project cards, header fit at 1024 to 2560, overflow shots of home, projects, estimate, a project page and the ad landing page at 390 / 820 / 1440, axe on home, projects and estimate (nothing new).
