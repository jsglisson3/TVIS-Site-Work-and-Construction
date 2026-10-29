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
