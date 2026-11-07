# TVIS website: build handoff

Read this first. It is the full brief plus every decision made so far, so a Claude Code session in this folder can continue without the earlier conversation. `docs/ROADMAP.md` has the phases from here to launch and after.

Last updated 2026-11-04 (the crew in the footer, the last section). The sections run in date order, so the newest decisions are at the bottom; the Status list below is from the 2026-10-28 rebuild.

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
- Social icons: Facebook links to the page. Google and Instagram show as plain marks (not links, "coming soon" for screen readers) until `googleBusinessProfile` / `instagram` are filled in site.config.json; then they become links and join the schema `sameAs` on their own. Order everywhere: Facebook, Google, Instagram.
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

`formEndpoint` = Basin form https://usebasin.com/f/4513058586c6 (the Basin login is kept out of this public repo; notifications go to info@tvisconstruction.com). The "form is being set up" notice disappears automatically. Do a real test submission with a photo after each change to the form.
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

## Search and consistency pass (2026-11-02, 06:15 to 06:35 UTC)
After the final-touches push (live 06:11, verified):
- **Concrete page panel** stays the finisher at work (#103). It was briefly swapped for a bare slab, then Jeremy said crew members and faces in photos are fine (06:26 UTC), so it went back. #33 IMG_0057 (fresh slab, forms on) stays in reserve.
- **One page-title size.** `--t-h1` is now the page-title scale (36 to 60px, phones 32 to 48px) used on every page. Projects, project pages, Home Construction and 404 had been using the old 104px hero size, bigger than the home headline. The home hero sets its own size (`.hero h1`). Projects, project pages and Home Construction titles get the same 80 x 7 olive bar as the rest. All olive title bars are now 80 x 7.
- **Google titles and descriptions on every indexed page.** Titles are 60 characters or fewer, so Google can show them whole. Descriptions are 160 or fewer, written as a short pitch in sentences (Google's snippet guide), in Joey's wording where the site has it, with no phone number and nothing unconfirmed. Project pages build theirs from project.txt: the write-up, the town, then "See the before and after photos" (`projectDescription` in build.mjs).
- **Structured data.** A WebSite card on the home page (name "TVIS Construction", alternate name "TVIS") so Google can show the business name above the address instead of the bare domain. Breadcrumbs use each page's short name (`crumb:` in the front matter, e.g. "Drainage & Culverts"). The business card's service list now points to the six service pages.
- **Small details.** `og:image:alt` on every page, `site.webmanifest` (Android home-screen name "TVIS" with the 192 and 512 icons; `favicon-512.png` added), and the 404 intro sits on one line.
- **Typed placeholders hide after launch.** With `launchMode: true`, a paragraph that is only a `[PLACEHOLDER]` typed into a page (the Home Construction intro) is left out of the built page.
- Checked: all 26 pages at 390 and 1440 with no sideways scroll and the same title sizes, axe clean on all 26, Lighthouse mobile on home 92 / 100 / 100 / 100. Share images checked by eye.

## Concept C and the ruthless pass (2026-11-02, 06:50 to 07:40 UTC)
Jeremy picked Concept C from `docs/NEXT-LEVEL-PLAN.md` ("C is great, keep building on C", "with extra love"), minus the proof card ("I don't like the pop up in the picture") and with the header and footer kept exactly as they are, social icons included. The Meet Joey section (plan item 1) and the header items (1.1, 3.3) are parked. He also asked for one ruthless pass over the whole site before everything goes out in a single commit. All of this is in one batch.

**Home hero (`src/pages/index.html`, "Concept C" block at the end of `site.css`):**
- A "where" line above the headline: `Excavation & Sitework · Chattanooga, TN` (`.hero-eyebrow`, Barlow 16px, light olive, with a short olive dash in front; 14px on phones). It answers what and where before the headline does.
- The subhead is now one plain sentence from the plan: "Site prep, driveways, drainage, concrete and pads for homeowners and builders." The old two lines ("Professional Sitework, Driveways, Drainage & Property Improvements." and the serving line) are gone from the hero; the serving line still lives in the service-area section. **Flag for Jeremy:** this is a wording change, easy to put back if Joey prefers the old lines.
- Lighter scrim on desktop: left-to-right `.84 → .60 (34%) → .06 (62%) → 0`, a faint foot at the top only (`.22`), and no dark foot at the bottom, so the photo reads brighter and the strip sits directly on it. Hero height is now `clamp(520px, 84svh minus the header, 700px)` so the hero and the strip fit the first screen with the next section peeking: checked at 1024x768, 1280x800, 1366x768, 1440x900, 1536x864, 1920x1080 and 2560x1440.
- Buttons read "Get an Estimate" and "Call us". On phones they sit side by side (two columns) and both are above the fold at 390x844 (bottom edge about 755px). On tablets held upright (600 to 900px) the pair is capped at 440px wide instead of stretching across the screen.
- ~~The hero image `sizes` is `100vw` at every width.~~ Put back to `(max-width: 900px) 80vw, 100vw` in the next batch: `100vw` made phones load the 960px photo and dropped the home page's Lighthouse mobile score to 82.

**Service strip (`nav.svc-strip`):** the six services in one white row directly under the photo, each a link to its service page with a one-line descriptor (Site Prep: clearing, grading, pads; Drainage: French drains, culverts; Driveways: gravel repair & new; Concrete: drives, pads & slabs; Shed & Garage Pads: gravel or concrete; Demolition: haul-off & cleanup). 6 across from 1024px (titles 17px and "Shed Pads" from 1024 to 1180 so nothing wraps), 3 by 2 from 601 to 1023px, and wrapped 44px chips (titles only, "Shed Pads") on phones: two rows of three at 390px. Hover and focus: the olive line draws in under the title, the title turns olive and the cell goes warm gray.

**How it works on the home page:** a new tint section between "The work we do most" and "Recent projects": heading "Start with a few photos", a two-sentence lead, the "Get an Estimate" button and the shared `{{> next-steps}}` card. Nothing new to maintain.

**One button label everywhere:** every estimate button now reads "Get an Estimate" (home hero and CTA card said "Request an Estimate"; the service, homeowners, builders, projects, more-services, landing and 404 pages said "Get an estimate"; the project page button is "Get an Estimate for a job like this"). The form's own submit stays "Send estimate request" and the estimate page title stays "Request a Project Estimate".

**One hover language, site-wide** (the "Concept C" block in site.css; one curve and length everywhere, `--ease: cubic-bezier(.2,.7,.2,1)` and `--dur: .25s`, all of it off under `prefers-reduced-motion`):
1. An olive line draws in from the left under titles and small links: who-card and service-card titles (now wrapped in a `<span>` so the line follows each text line), project titles, "See all photos", the "See …" line on service cards, the related links on service pages, the 404 links, the "Give us a call" line under the form. In the footer the line is light olive on charcoal (the old plain underline is gone).
2. Cards: the photo eases to 103% over 0.4s while the title line draws in (who cards, service cards, the four More Services tiles). The who card still turns its border olive and nudges its arrow.
3. Text links with an arrow (`.textlink`): the 3px line thickens to 5px (an inset shadow, so nothing moves) and the arrow nudges 4px. Call links (`.call-link`) thicken 2 to 3px and the phone icon tilts a touch. The light call link on charcoal now turns light olive on hover (it used to turn deep olive, unreadable on charcoal).
4. Buttons: every `.btn` lifts 1px on hover and presses flat; the white-outline "Call us" fills white with charcoal text (unchanged).
5. Form: the "I'm a…" control slides its charcoal highlight to the option you tap (a `::before` indicator moved with `:has()`, with a plain fallback for browsers without `:has()`); inputs keep the olive focus glow, now on the same curve.
6. Phone menu: a short olive bar slides in beside the link you press and the word shifts right and turns olive.
7. Social marks, nav, phone links: unchanged behaviour, same timing.

**Ruthless pass, what was checked:** all 26 built pages at 390 / 820 / 1440 (screenshots + no sideways scroll + console errors), the five laptop and desktop sizes above and 600 / 768 / 960 / 1023; axe on all 26 pages at 390 and 1440 (no violations); every internal link, image, srcset and in-page anchor resolves; titles ≤ 60 and descriptions 70 to 160 on every page; one phone number in every `tel:` link; JSON-LD parses on every page; the phone menu (open, Escape, link closes it, first link focused), the phone call bar (waits under the hero, then docks at the bottom), the service chips (six, 44px), before/after sliders (tap moves the handle), project filters and `?type=` deep links, jump links on Homeowners (resolve, scroll, mark), the estimate form (presets from `?who=&type=`, empty submit blocked, photo thumbnails add and remove, success shows the thank-you block, a failed send shows the error line), back to top, the header compacting, the dozer, the 404 page, the landing page form, `?slots`. Lighthouse mobile: home 92 / 100 / 100 / 100, estimate 100 / 100 / 100 / 100, drainage 92 / 100 / 100 / 100, projects 99 / 100 / 100 / 100.

**Fixed on the way:** Builders page title was 61 characters (now "Sitework for Builders & Contractors, Chattanooga TN | TVIS"); the /thanks description was eight words (now a full sentence); the hero image `sizes`; the light call link's hover colour; a space between a strip title and its descriptor so screen readers do not run them together.

**Not changed, on purpose:** the header, footer and phone menu layout; the project card (the slider inside it means the whole card cannot be one link, so the title and "See all photos" carry the hover); the hidden reviews section's placeholder Google link (`#google-business-profile-url-needed`, invisible until reviews exist and `googleBusinessProfile` is filled in).

**Docs:** `docs/NEXT-LEVEL-PLAN.md` is the overnight plan (with two Concept C mockups in `docs/design/`); `docs/STYLE-GUIDE.md` has the hero, strip, hover and label rules.

## Service page photos and full site check (2026-11-02, 13:30 to 14:10 UTC)
Concept C went live as "Concept C Hero" (7a7853b). Jeremy then spotted that the two stacked photos at the top of every service page (the opening photo and the "What we do" photo) were different widths and touched each other ("look at how jumbled these pics are", "looks that way from all of them") and asked for a complete site check ("new hero is good but this went backwards on some stuff"). Every page was compared with the version before Concept C (88f40b0) and with the live version, at desktop, tablet and phone.

**Stacked photos on service pages (and the shed-pad landing page):** the opening is a 1fr / 1fr grid but `.lp-two` was 1fr / 1.15fr, so the "What we do" photo started further left than the photo above it. This was already the case before Concept C. Now `.lp-two` is `minmax(0,1fr) minmax(0,1fr)` with the same column gap as the opening, from 901px up, so both photos share their left and right edges at every desktop width, with a 16px white gap between them (`.lp-two .sv-media{margin-top:calc(16px - var(--sec))}`).

**Panels reach the screen edge:** `--bleed` now runs to the screen edge at every width (it stopped up to 96px short on screens wider than about 1500px, which left a white strip beside the photos on Jeremy's monitor). The two places where a photo should stop short keep the old value as `--bleed-capped`: the project page slider (`.pd-ba`) and the Homeowners shed-pad picture (`.pads-pic`).

**Slips from Concept C, found by the comparison and fixed:**
- The phone and tablet two-button hero rule was written for `.hero-act`, which the service pages use too, so on phones their full-width "Get an Estimate" button shrank to half width beside "Call us". The rule is now `.hero .hero-act` (home hero only); service pages are back to the full-width button with "Call us" under it.
- The draw-in underline rule changed the padding of "See all photos" and the footer links (the "See all photos" link went from 42 to 33px tall). The padding is back as it was; the line is placed with `background-position` instead.
- The home hero image `sizes` change (see above): back to `(max-width: 900px) 80vw, 100vw`. Lighthouse mobile on the home page is back to 92 (82 with `100vw`; the version before Concept C scored 97 locally).

**Extras in the same batch:**
- **All our services at the foot of each service page:** the home page service strip moved into `src/partials/service-strip.html` and is reused under an "All our services" heading at the end of the six service pages. The build marks the current page's cell with `aria-current="page"` (tinted, olive title, line drawn).
- **Image widths** are now 480 / 720 / 960 / 1200 / 1600 (1200 added), so large phones and small laptops get a closer size.
- **Search data:** `areaServed` in the business and service JSON-LD now uses typed places (City, Place or AdministrativeArea with ", TN" names) instead of bare strings, from the same town list in `site.config.json`.
- **robots.txt** no longer blocks `/lp/`. The landing pages carry `noindex`, and Google can only see that tag if it is allowed to fetch the page; a robots block could leave the URL listed without a description.

**Checked:** old vs new geometry and full-page screenshots for all 26 pages at 390, 820 and 1440; stacked photo edges on all six service pages and the landing page at 1280 and 1649; axe on /, /drainage, /concrete, /lp/shed-garage-pads and /estimate; Lighthouse mobile (see the next lines); no sideways scroll.

**Lighthouse mobile after this batch (local):** home 92, drainage 99, concrete 99, homeowners 92, builders 92, estimate 100, projects 99, more services 99, all with accessibility, best practices and SEO at 100. The shed-pad landing page scores 100 / 100 / 100 with SEO 69, which is expected: it is `noindex` on purpose.

## Visual refinement pass (2026-11-02, 14:00 to 14:30 UTC)
Jeremy asked for 30 minutes on structure, layout, sizing, spacing and images only: no features, no architecture changes, header and hero untouched. Every page was captured full length at 390 / 820 / 1440, every section's padding and heading-to-text gaps were measured, every button's size was listed, and every photo's crop was measured (how much of the photo shows in its frame).

**What changed (all in the "Visual refinement pass" block at the end of `site.css`, plus two class changes on the home page):**
- **One spacing rhythm.** Heading to first text was anything from 16 to 48px depending on the section; it is now 24px everywhere (`.sv h2` and `.lp-two h2` margin, `.near p`, `.area p`, `.callout p`), text to list 24px and list to button 32px (`.bul{margin:24px 0 32px}`), the landing form lead 20px.
- **Buttons size to their label on desktop.** In the panel sections (`.sv`, `.lp-two`: Homeowners, Builders, every service page's "What we do", the landing page) the text column uses `display:contents`, so the button became a grid item and stretched to 568px. `justify-self:start` from 901px puts it back to 175px like every other button. Phones keep the full-width button.
- **Home page backgrounds alternate:** the How it works band is now white (was olive tint right after the warm-gray service cards, two near-identical beiges touching) and Recent projects is warm gray (`sec-warm`), so the page runs white, warm, white, warm, dark band, warm.
- **The one-project row on service pages** ("Recent job like this", `.proj-grid-one`): photo 7/12 and words 5/12 (was 2/3 and 1/3), title 28 to 36px, place line and description at body size. The words now balance the photo instead of floating beside it.
- **Who cards:** both arrow squares sit level with the top of their title (`.who-go{align-self:start}`); before, the two-line Builder title pushed its arrow lower than the Homeowner one.
- **Photo framing:** the Builders utilities panel (a wide shot in a near-square frame) is positioned at 43% so the excavator, the worker and the trench are all in view (it was cutting the excavator off).

**Checked and left alone:** section padding (already one value, `--sec`), the hero, header, footer and service strip, every other photo crop (the tightest are the wide panoramas in tall side panels, which still frame their subject), the 3/3/3/1 project grid (the filters make a layout trick for the last card unreliable). One photo to swap when a new batch comes in: the More Services "Brush & Lot Cleanup" tile shows the photographer's shadow, and it cannot be cropped out.

**Verified:** old vs new geometry on all 26 pages at 390 / 820 / 1440 (only the intended changes; phone and tablet heights moved by a few pixels from the list spacing), no sideways scroll, Lighthouse mobile home 92, drainage 99, homeowners 98, builders 92 (accessibility, best practices and SEO 100).

## Visual refinement pass, part 2 (2026-11-02, 14:20 to 14:45 UTC)
Jeremy's full brief (sections 3 to 7: images first, then cards, responsive and consistency) with the time limit lifted. Part 1 went live as 16f8803. Audited with a script that lists every visible photo on all 26 pages at 1440, 820 and 390 with its frame size, how much of the photo shows, the file the browser picked and whether that file has enough pixels for the frame.

**Images:**
- **Sharpness.** The two wide panoramas in tall side panels (Builders utilities, Homeowners drainage) were drawn at about 1.5x their file size on a standard 1440 screen (the frame crops the sides, so the photo is drawn much wider than the frame), and the page-opening photos at about 1.15x. Their `sizes` hints now ask for the width the photo is actually drawn at (see STYLE-GUIDE "Ask for enough pixels"), so the browser picks the 1600 or 960 file instead of the 960 or 720. Markup-only change in the page files.
- **Page openings are one height.** The opening photo's own shape was setting the band height (`aspect-ratio:auto` with the image in flow), so openings ranged from 480 (drainage, a panorama) to 630px at 1440. Now the band is `clamp(480px, 40vw, 600px)` tall on desktop (576 at 1440, 512 at 1280, 600 at 1920) and the image is absolutely positioned to fill it. Homeowners and Builders stay a little taller because their headings are longer.
- Checked and left alone: every other crop frames its subject; the portrait photos in 4:3 card frames (garage pad before, two More Services tiles, the landing page slider) keep their subject in the middle band. Small source files that will look soft on large tablets: the garage pad project's two after photos (696px wide originals).

**Tablet (600 to 900px):** buttons size to their label instead of running 754px wide (page openings, CTA rows, project page CTA, panel sections); an odd last project card spans the row with the photo left and the words right (home Recent projects at 3 cards, the one-project row on service pages), instead of leaving half the row empty; `.sec-head` stacks heading then line with a 20px gap at 900px and under.

**Projects page:** with 10 projects the 3-across grid left one card alone on the last row. When the count leaves one card over (4, 7, 10, 13...), the build now marks the newest project `.proj-wide` (`scripts/build.mjs`, `project_cards`) and on desktop it runs the full width at the top (slider 7/12, words 5/12, larger title, `sizes` 60vw), so every row below is full. With a filter on (any card `hidden`) it goes back to a plain card. No change to `projects/` or `project.txt`.

**Phone:** the shed pad section's list to closing line gap was 80px (list margin plus grid gap); now 24px.

**Cards:** compared padding, title size, photo-to-title and title-to-text gaps across who cards, service cards, project cards, More Services tiles, pad steps and the CTA card. Boxed cards (who, service) and open cards (projects, tiles, steps) are each consistent within their family; no change needed.

**Verified:** old vs new geometry on all 26 pages at 390 / 820 / 1440 (only the intended changes), no sideways scroll on any page at 360, 390, 600, 820, 901, 1024, 1280, 1440 and 1920, axe clean (only "needs review" items over photos), Lighthouse mobile home 99, drainage 97, homeowners 98, builders 92, concrete 99, landing page 100 (SEO 69 by design, noindex).

## Service page photo alignment (2026-11-02, 14:40 to 15:00 UTC)

Jeremy said the image spacing on the service pages felt wrong: the opening photo and the "What we do" photo stacked in the right column with a 16px gap, both running to the screen edge, so the second photo didn't line up with anything in its own section.

- Desktop only (901px and up), on the six service pages and `/lp/shed-garage-pads`: the "What we do" photo now sits inside the content width. Its left edge matches the opening photo's left edge, its top is level with the heading and its bottom is level with the button. The text column is a flex column, so the button takes `margin-top:auto` and meets the photo's bottom edge when the list is short (the photo keeps a 340px minimum height). CSS block at the end of `src/assets/site.css`.
- `sizes` for these photos is now `(min-width: 1440px) 600px, (min-width: 900px) 48vw, 100vw` (the photo is about 570px wide on desktop), including the ad page's before/after block.
- Phones and tablets unchanged. Compared with the live build (df331d3) on 10 pages at 1440, 820 and 390: only these seven desktop sections changed. No sideways scroll at nine widths. Lighthouse mobile: Home 92, Drainage 97, Site Prep 99, ad page 100.
- STYLE-GUIDE.md: new rule "Never stack two photos in one column".
- Still open: Jeremy (14:46) wants a full image-spacing and layout review of every page on the live site, after the backend audit. The Demolition "What we do" photo (`more-cleanup`) shows the photographer's shadow; swap it in a photo batch.

## Backend audit and launch readiness (2026-11-02, 14:55 to 15:20 UTC)

Full report (Claude Doc): https://claude.ai/artifact/V2BthtRzqADnCFmaQLXXwh. Checkpoint copy of the site before the audit: `/tmp/claude-0/tvis-pre-audit` (container only).

Code changes, all tested (they ship with the photo alignment above, one commit):
- Project pages: the before/after slider asks for `96vw` on phones so it picks the same file as the gallery photo below it (each photo downloads once). Four project pages went from 78-84 to 90-92 on Lighthouse mobile.
- Photo `sizes`: home service cards `(min-width: 1180px) 400px, (min-width: 600px) 45vw, calc(100vw - 40px)` (two columns start at 600, not 560); home Homeowners/Builders cards `(min-width: 900px) 600px, (min-width: 600px) 72vw, 100vw` (wide panoramas cropped to 4:3 need the extra pixels); project cards default `(min-width: 900px) 33vw, (min-width: 600px) 45vw, calc(100vw - 40px)`; Projects page cards use `80vw` on phones (was 66vw, soft on phones). Home page weight 1,313 KB to 909 KB.
- Estimate form: `novalidate` removed from the HTML and set by site.js instead, so the browser enforces required fields when JavaScript is off (the live site sent blank requests then). Error messages are tied to their fields with `aria-describedby` while showing.
- `head.html`: `<meta http-equiv="Content-Security-Policy" content="base-uri 'self'; object-src 'none'; upgrade-insecure-requests">`. Scripts are deliberately not restricted (the tracking tags load from Google and Meta).
- `site.css`: `.sv,.pads{overflow:hidden}` split from the `:has()` rule, because a browser without `:has()` drops the whole selector list.
- `docs/HANDOFF.md`: Basin login email removed (the repo is public).

Found and handed to Jeremy (see the report): DMARC record has a placeholder `rua=mailto:you@tvisconstruction.com` (set it to `v=DMARC1; p=none`); Basin free plan is 50 submissions a month, 100 MB, 30-day retention, no server-side honeypot, no custom redirect, but Allowed Domains is free (add tvisconstruction.com); Workspace billing by 2026-11-11; GitHub Pages "Enforce HTTPS" not readable from here; GA4 not installed (hooks ready: `generate_lead`, `phone_call_click`); deploy workflow actions target Node 20 (deprecated, still runs on Node 24).

Results: Lighthouse mobile 90+ on all 26 pages, accessibility and best practices 100 everywhere, SEO 100 on the 22 indexable pages; axe 0 violations; keyboard checks pass; 0 broken links; form tests pass with and without JavaScript. Not testable here: Safari/Firefox, a real Basin submission, live HTTPS and www redirect.


## Image layout review (2026-11-02, 15:25 to 16:10 UTC)

Jeremy (15:23): "do an entire site review and focus entirely on images and their sizing and how they fit on each page .. this has to be perfect". Every photo on all 26 pages was measured at 390, 820, 1440 and 1866px (its edges against the content edges, the space around it, what sits beside it, how much of the photo the frame keeps, and whether the file is sharp enough), then looked at in screenshots. Checkpoint copy before these changes: `/tmp/claude-0/tvis-pre-images` (container only).

Found and fixed:
- **Homeowners and Builders, desktop:** the section photos ran top to bottom of their band and out to the screen edge. Neighbouring photos met corner to corner, the photo edges jumped between two lines down the page, and the wide drainage and utilities shots kept under half their width. Now they sit inside the content width like the service pages: top level with the heading, bottom level with the button, never shorter than 5:3, sides alternating, edges on the same lines as the opening photo. The shed-pad picture on Homeowners no longer sticks to the top of its band or stops short of the screen edge; it lines up with its heading.
- **Phones and tablets, Homeowners shed-pad section:** now heading, photo, then words, like the other sections (it was heading, words, photo).
- **Project pages:** the before/after slider ran past the content edge (to the screen edge at 1440, and stopping 177px short of it on wide monitors). It now ends on the content edge.
- **Project galleries:** five photos left an empty cell at the bottom right on desktop (2025-08 East Brainerd). The build now gives every photo a tile (`galleryLayout` in scripts/build.mjs) so no count leaves a gap, and asks for a file the size of that tile. On tablets two photos now sit side by side instead of stacking at full width (the 696px garage pad photos were soft stretched across a tablet).
- **Service pages with two related jobs** (Concrete, Gravel Driveways): two cards in a three-column grid left a third of the row empty. They now fill it, half each (`proj-grid-two`).
- **`sizes`:** Homeowners and Builders section photos `(min-width: 1440px) 680px, (min-width: 900px) 60vw, 100vw`, the two panoramas `(min-width: 1440px) 1000px, (min-width: 900px) 90vw, 150vw`, the shed-pad picture `(min-width: 1440px) 600px, (min-width: 900px) 46vw, 100vw`, the project slider `(min-width: 1440px) 690px, (min-width: 900px) 52vw, 96vw`.

Checked and left alone: the page openings, home hero and statement band (locked), the home page, Projects page, More Services, the estimate page, the service pages' "What we do" photos (fixed in the batch before). Every other crop keeps its subject. The two garage pad "After" photos are only 696px wide, so they stay a little soft on phones; a larger copy from Joey would fix it. The hillside driveway's two "Before" photos are near duplicates; worth swapping one in the next photo batch.

Results: compared with the build before this batch on all 26 pages at 1866, 1440, 820 and 390: only the sections above changed. No sideways scroll at nine widths. Lighthouse mobile 90+ on all 26 pages (Home 92, Homeowners 92, Builders 92, Concrete 99, East Brainerd project 97, lowest 90 on the Feb 2026 lot clearing project, same as before), accessibility and best practices 100. Before/after page: https://claude.ai/artifact/43U1L4gNUVpvi7G1vCsWK1. Ships in one commit with the two sections above ("Image layout and audit fixes"), because Jeremy's PC was offline and none of it had been copied yet.

## Page opening photos (2026-11-02, 15:57 to 16:08 UTC)

Jeremy sent screenshots of the live site after eb432df: the opening photos on Homeowners, Builders and More Services "bleed off the page" and are "too wide" (he also sent the Builders section photos, but those were his browser's cached copy; the live page already had the contained photos). He wants the openings framed like the drainage and cleanup sections, which he said look great.

- Desktop (901px and up), all ten inner pages with an opening photo: `.phero-pic` loses its negative margins (one rule at the end of site.css), so the photo fills the right half of the content width with the band's padding above and below it, and the text is centred beside it. About 568 x 403px at 1440 and 1866 (564 x 424), 418 x 365 at 960; the band keeps its fixed height. Phones and tablets unchanged.
- `sizes` on the ten opening photos: `(min-width: 1440px) 620px, (min-width: 900px) 48vw, 80vw`; the Drainage opening (a panorama cropped to 4:3) `(min-width: 1440px) 820px, (min-width: 900px) 64vw, 120vw`.
- Compared with eb432df on 13 pages at 1866, 1440, 820 and 390: only the opening photo box moved; no sideways scroll. STYLE-GUIDE.md "Page opening" rule updated.
- Jeremy (16:00): the images must be "flawless across the entire website"; after this he wants to move on to backend work, more features and individual page reviews.

Live as acc72cd (deploy green, 16:11 UTC; the commit reused the previous message by mistake, the content is the opening-photo batch). Every inner-page photo now sits inside the content width; only the home hero and the statement band run to the screen edge, by design.

## Openings as real jobs, Projects intro, shadow recut (2026-11-02, 17:45 UTC onward)

Jeremy, 17:43: the openings on Homeowners, Builders & Contractors and More Services "have to be top notch, there is no option to be bad; if these sections don't look good nobody will ever scroll down". Then: the Projects intro "random text" floating beside the title, and the photographer's shadow in the Lot Clearing "before" photo.

- **Audience line above the title** (`.phero-eyebrow`, the same device as the home hero's eyebrow, olive-deep on the warm band): "For homeowners", "For builders & contractors", "Smaller jobs & cleanup". It joins the title's settle animation.
- **Second pass (Jeremy, 17:58: "the images on each of these tiles still need to fit this screen a little wider not taller", the "In this photo" cards are "good but make it even better"):** on desktop the opening photo now runs from the content split to the **right screen edge** (`.phero-pic` margin-right `calc(-1 * var(--bleed))`, the same token as the section panels), on every page with an opening photo, so it is wider, not taller. The band padding came down to `clamp(40px,4.5vw,56px)` so the audience line does not make the band taller (about 650px at 1440 on Homeowners/Builders, 600 on the service pages). The card gained the job's month ("Harrison, TN · June 2026", from the photo dates in the registry) and a specific link line ("See the 6 photos", "See the 7 photos", "See all 10 projects"; counts are the real photo counts in the project folder), a 26px title and a 56px arrow square. On phones and tablets the card is no longer an overlay: it is a white strip under the edge-to-edge photo, at the foot of the band, so the small photo stays clear.
- **Critique pass (18:08, Jeremy: "make sure you are 10000000% sure this is the best you can do"):** the card title no longer breaks at the hyphen of "rock-lined" (non-breaking hyphen in the Homeowners card, `text-wrap:balance` on every card title, card max-width 460px); on narrow desktops (901 to 1180px) the card is smaller (340px, 20px title, 48px arrow) so it does not swallow the photo; the Homeowners photo is framed lower (`object-position:50% 72%`) so the stone drain bed, the actual work, shows beside the card instead of the sky; every opening's `sizes` is now `(min-width: 901px) 52vw, (min-width: 601px) 100vw, 92vw` (the photo is about half the screen plus the bleed), so 1x screens get the 960/1200 file and 2x screens the 1600 file.
- **Proof card on the opening photo** (`.phero-job`, an `<a>` inside `.phero-pic` after the photo): white, 8px olive left edge, "In this photo" label, the project title in Barlow, the town and "See the photos", and the olive arrow square from the Who cards. It sits on the photo's lower-left corner, overhanging 28px into the 64px gap on desktop (left 16px on phones and tablets, where the photo runs edge to edge). Links: Homeowners → `/project/2026-06-harrison-drainage-yard` (the photo is that job's after-1), Builders → `/project/2026-04-lot-clearing-footings` (same Lone Oak site as the home statement band), More Services → `/projects` (its photo, #80 East Ridge, is not in a project yet, so the card says "See our projects"). Towns come from the project.txt files and the photo registry's GPS towns; never invent one. The card settles in 0.7s after the title. The band grows about 80px at 1440 because the text column is taller; the photo still fills it.
- The service pages and the ad page keep their openings as they were (no card): add one only when the opening photo is a job that has a project page.
- **Projects page:** `.proj-head` is a single column: title, olive bar, intro at the opening-intro size (19 to 22px, 56ch), 24px below the bar. It was a two-column grid with the intro bottom-aligned on the right.
- **Lot Clearing before photo** (`projects/2026-04-lot-clearing-footings/before-1.jpg`, #48 IMG_5197): recut from the 2560x1920 original (left 300, top 0, 1773x1330 → 2400x1800) so the photographer's shadow at the bottom is out of the frame; crop only, no retouching. Registry row 48 updated.
- Checks: overflow 0 at nine widths on all 26 pages, console/HTTP 0, keyboard pass, Lighthouse mobile 90+ on the five changed pages. Before/after: round four at the top of https://claude.ai/artifact/43U1L4gNUVpvi7G1vCsWK1.

## Final visual polish pass (2026-11-02, 16:12 UTC onward)

Jeremy's brief: "FINAL WEBSITE VISUAL POLISH, THE LAST PASS": every image, spacing, borders, corners, shadows, cards,
buttons, header and footer, at desktop, tablet and phone; quality over quantity, no redesign, no new effects, no
dependencies. His first note after the openings moved inside the page (16:14): "these used to bleed off the page but
now it just looks so small", so the top of every page came first. Checked with the design inspector from the
tasteskill (`inspect.mjs`, 1866 / 1440 / 820 / 390) and the site's own geometry and spacing scripts.

What changed (all in `src/assets/site.css` unless noted):

1. **Page openings** (Homeowners, Builders, More Services, the six service pages, the ad page): the photo now fills the
   full height of the band, top to bottom, with its right edge on the content edge. The photo column is wider than the
   text column (1 : 1.12, 64px gap) so the photo leads and every title that fits in two lines still does. About
   604 x 600px at 1440 and 1866, 474 x 480 at 1024. `sizes` on all ten openings now `(min-width: 1440px) 860px,
   (min-width: 900px) 64vw, 80vw` so the photo is sharp at 1x (it was being upscaled). The 16:00 override block was
   folded into the main opening rules (one place, no superseded rule left behind).
2. **Drainage opening photo:** the panorama (`homeowners-drainage`) kept only 48% of itself in the near-square frame.
   New `photos/site/svc-drainage-hero.jpg`: a 4:3 cut of the same swale photo (IMG_7069, house, lawn, rock channel,
   block wall). The panorama still runs on the Homeowners drainage section, where it fits.
3. **Project pages:** the title and before/after slider use the same split and gap as the openings (1 : 1.2, 64px),
   so long titles run three lines instead of four beside a 624px slider.
4. **Builders on tablets:** the opening's button and "Call us" sit in one row like every other page (the phone-only
   column rule was winning on tablets through specificity).
5. **Header button and send button keep their glow and lift.** The pass briefly flattened them for consistency, then
   put them back: Jeremy asked for the snazzy header with its drop shadow on 2026-10-29 and likes the small lifts.
   Shadows are byte-for-byte what was live.
6. **Spacing on the 24 / 32 rhythm:** the Shed pad section button (24 to 32px above), the home contact card button
   (26 to 32), the 404 and thanks page title-to-text gap (18 / 20 to 24).
7. **Cleared-lot photo recut:** `photos/site/more-cleanup.jpg` (More Services list and the Demolition page panel) had
   the photographer's shadow across the foreground; the same photo is now cut from the left and bottom so the shadow is
   out of the frame (trunk, cleared ground, pines kept).
8. **Hillside driveway project:** `before-2.jpg` was a near duplicate of `before-1.jpg` (same spot, seconds apart), so
   the Before group showed the same picture twice. Removed; the Before group is now one full-width photo. Registry #99
   is back in reserve.
9. **Sharper on real phones:** on phones the opening photo and the project-card sliders run the full width, but
   their `sizes` said 80vw, so a 3x phone (390px, 1170 device pixels) was handed the 960px file. Now 92vw / 90vw: a
   3x phone gets the 1200px file; Lighthouse's test phone (412px at 1.75x) still gets the 720px file, so the scores
   hold (Builders 91, Projects 91, Homeowners 91). Tablets (601 to 900px) get 100vw for the openings, so a 2x iPad
   loads the 1600px file instead of 1200. (The geometry script's "sharpness" column reads `naturalWidth`, which
   Chrome scales by `sizes`, so it under-reports whenever `sizes` is smaller than the box; check `currentSrc`.)
10. **Phone service chips:** the "All our services" strip on service pages and the home strip use filled chips on
   phones, the same chips as the Projects filters, instead of 1.5px outlined boxes; the page you are on is dark.

Unresolved, needs Joey: the two finished photos of the garage pad project (`projects/2025-10-garage-pad/after-1.jpg`,
`after-2.jpg`) exist only as 696px Facebook downloads, so they are soft on phones and in the big gallery tile. Ask for
the full-size originals from his phone and drop them in; nothing else to do.

Inspector notes kept as they are, on purpose: the home hero eyebrow line and the warm-gray palette are the brand;
no video; the header hairline and the card borders are in the style guide; the Builders and Homeowners titles run
three lines at 60px (unified title size, Jeremy's call) because the content width can't hold "Sitework Solutions for
Builders & Contractors" in two.

## Pre-launch review (2026-11-02, 19:30 UTC onward)

Jeremy's brief: a complete pre-launch review in 8 phases (audit, frontend polish, mobile, SEO, performance, accessibility to WCAG 2.2 AA, conversion, final QA), with no redesign, no removed content, nothing invented and nothing called fixed without a test. Baseline: GitHub `fdbcc52` ("Undo cap and fade"; the cap and fade on the opening photos stays out). Full report (Claude Doc): https://claude.ai/artifact/LoWKwVcbKxkX67BPwhw8ct

Fixed, each tested:
- **Estimate form:** after a failed send, typing in any field re-ran the whole check, which moved focus to the first empty field, so a visitor could not type their phone number. site.js now has `checkField(el)`: a flagged field re-checks only itself on `input` and `change`, and never moves focus. `validate()` (on send) still focuses the first problem.
- **Opening proof card arrow** (Homeowners, Builders, More Services): `.phero-job span{display:block;margin-top:6px;color:var(--ink-soft)}` also hit the arrow square (a span), so the arrow was dark and sat at the top. `.phero-job .who-go` restates `display:grid;place-items:center;margin-top:0;color:#fff`.
- **Phone menu:** Tab now cycles Close and the menu links only while it is open (it used to walk into the hidden page); Escape still closes. The menu links carry `{{nav_*}}`, so the current page gets `aria-current` and shows the pressed state (olive bar in, word shifted).
- **Project page crumb:** the `&larr;` came from a fallback font and was tiny. Now the site's `#i-arrow` icon flipped with `scaleX(-1)`, nudging 4px on hover (off under reduced motion).
- **Home "Ready to get the groundwork done?" card:** button and "Or call us" are wrapped in `.cta-actions` (32px above); they had no gap.
- **SEO:** `CATEGORY_PAGE` in build.mjs links each project's category line to its service page. `canonical_tag` is left off `noindex` pages. The sitemap lists `/` first.
- **Speed:** project pages without a before/after slider (5 of 10) lazy-loaded their biggest first-screen photo. The first gallery tile is now `eager` (fetchpriority high) when there is no slider.
- **Keyboard focus on phones** (WCAG 2.2, 2.4.11 focus not obscured): tabbing scrolled each link just into view at the bottom edge, under the fixed Call / Get an Estimate bar, so the focused link was hidden. `html{scroll-padding-bottom:calc(var(--mbar-h) + env(safe-area-inset-bottom,0px) + 16px)}` stops it above the bar (`--mbar-h` is 0 on desktop). Checked with a script that tabs through 6 pages at 390 and 1440, forwards and backwards: every stop fully visible.
- **Statement band:** a `@supports not selector(:has(a))` fallback puts the same dark overlay on `.band-bg::after` for Safari before 15.4 and Firefox before 121. Checked by simulation in Chromium; it stays off where `:has()` works.
- **Copy read-through** (every visible string on the site, alt text and labels included): the Projects intro said "Drag the handle on any photo" and its description "Drag each photo", but only 5 of the 10 jobs have a before/after slider; now "any before-and-after photo" and "Drag the sliders". Site Prep's "Send the address and plans… We look it over" now says "them". Nothing else changed in the wording.
- Tried and reverted: a dot between the two "Related:" links on service pages. Their 32ch measure always stacks them, so the dot dangled.

Verified on the final build: html-validate (only style rules: trailing spaces, phone hyphens, lowercase doctype, one inline style; the phone number never wraps, checked at 7 widths); 26 pages at 10 widths with 0 overflow, console errors, failed requests or broken images; axe 0 violations at 390 and 1440; text over photos measured pixel by pixel (`cc.mjs`: hide the text, screenshot only the glyph boxes, compare the text colour with every background pixel): 535 text spots pass at the 10th-percentile pixel, lowest 4.91:1; form tests 12/12; keyboard: focus ring on every stop, nothing hidden under the header or call bar. Repo and published photos carry no EXIF or GPS. No secrets in the repo.

Lighthouse mobile over HTTP/2 (the way GitHub Pages serves; a throwaway TLS server, since the repo's `serve.mjs` is HTTP/1.1): performance 96 to 100 on all 25 pages it can score (it refuses the 404, which is correct), accessibility and best practices 100, SEO 100 on the 22 indexable pages and 66 on the 3 hidden ones (expected for noindex). LCP 1.35 to 2.70 s, CLS 0 and TBT 0 everywhere. The HTTP/1.1 preview reads 3 to 8 points lower on photo-heavy pages (90 to 100), so use HTTP/2 numbers when comparing with PageSpeed Insights. The eager first gallery tile was A/B tested, 3 runs before and 3 after on each of the 5 affected pages over both protocols: neutral to slightly faster and steadier between runs, so it stays.

Not testable from this container (Jeremy to check): Safari/iPhone, Firefox, a real Basin delivery, Enforce HTTPS, the www redirect, the DMARC record. The full list of manual items is in LAUNCH-CHECKLIST.md, rewritten in this pass.

## Opening cards v3 and sharper opening photos (2026-11-02, late evening)

Jeremy's feedback on the Homeowners, Builders and More Services openings: the "In this photo" card needed work (how it comes in, where it sits, the green box), the More Services photo looked blurry, and widths stay as they are.

- **Card:** now sits square on the photo's bottom-left corner instead of floating and overhanging. No dead space: titles break by hand, so the box ends at the longest line. The arrow is a full-height olive tab on the right, arrow centred. It rises in once in 0.55s just after the photo (it used to fade in late, after 0.7s); off under reduced motion. Phones and tablets keep the strip under the photo, now with the same tab.
- **Sharper photos:** `CRISP` in `scripts/build.mjs` gives the three opening photos' desktop files (960px and up) a light sharpen and webp quality 82 instead of 70. Phone files are unchanged, so phone weight and Lighthouse are unchanged. Widths and sizes are unchanged.
- Homeowners photo framed a little lower (object-position 50% 90%) so more of the rock swale shows.
- Checked: 390 / 820 / 1024 / 1440 / 1866 screenshots, no sideways scroll, console clean, Lighthouse mobile 92 / 100 / 100 / 100 on all three pages.

## Opening caption bar (2026-11-02, late)

Jeremy asked whether the floating card was really the best placement. Five options were mocked on real screenshots (bottom-right card, charcoal caption bar, job line under the buttons, small corner tag, job filmstrip) and he picked the caption bar.

- `.phero-job` on Homeowners, Builders & Contractors and More Services is now a charcoal bar across the foot of the opening photo: label and town/month on the first line, the job title on the second, olive arrow tab at the right. Same height on all three pages (about 80px at 1440). On phones and tablets the same bar sits under the photo.
- The hand line breaks in the card titles are gone (the bar has room for one-line titles). "See the N photos" stays in the link text for screen readers only.
- Entrance: the bar rises out of the photo's bottom edge (clip reveal, 0.6s after 0.35s); none under reduced motion.
- Checked: 390 / 600 / 820 / 1024 / 1440 / 1866, no sideways scroll, console clean, keyboard pass (focus ring drawn inside the bar), Lighthouse mobile 92 / 100 / 100 / 100 on all three pages.

## Opening photo endings (2026-11-02, late)

Jeremy liked the caption bar but wanted the three opening photos (Homeowners, Builders & Contractors, More Services) to stop running off the right of the screen, with no fade or blur. Five hard-edged endings were mocked on real screenshots. He picked option 2 and asked to keep option 1 ready.

- On desktop (901px and up) the photo stops one page margin (`--gut`) short of the screen edge, and a solid 12px olive bar runs down its right edge. Block at the end of the page-opening rules in `src/assets/site.css`, scoped to those three pages; the service pages are unchanged.
- To switch to option 1 (same stop, no bar), set `--photo-end-bar` to `0px` in that block. Nothing else changes.
- Phones and tablets are unchanged: the photo runs edge to edge under the text.
- Checked: 390 / 820 / 901 / 1024 / 1180 / 1440 / 1750 / 1866, no sideways scroll, console clean, Lighthouse mobile 91 to 93 with 100 for accessibility, best practices and SEO.
- 2026-11-03: Jeremy saw option 2 live and switched to option 1, the clean stop with no olive bar (`--photo-end-bar:0px`). Everything else in this section is unchanged.
- 2026-11-03: the plain stop looked cut off to Jeremy ("make it just super naturally end"). Three natural endings were mocked (in line with the header, framed by the band, both). He picked B: on desktop the photo sits in from the top, right and bottom of the band by the same page margin (`--gut`). The olive bar setting is gone. Checked 390 to 1866, no sideways scroll, console clean, Lighthouse mobile 90+.

## Grade A pass (2026-11-03)

Jeremy: "almost a B, we need to get to a grade A". The plan with mockups ranked eight fixes; he asked for all eight plus the Instagram logo. Rules are in docs/STYLE-GUIDE.md.

1. **Phones, home page:** the six service cards are compact rows at 560px and under (116px photo, title, one line, olive chevron). The section went from about 2,520px to 1,040px. The card photos ask for `116px` on phones.
2. **Closing estimate band:** charcoal with a 6px olive top edge on Homeowners, Builders, More Services, Projects and the six service pages (`.sec.area`, `.sec.callout`).
3. **Home, "The work we do most":** the intro line sits under the heading.
4. **Home, "Start with a few photos":** wider (46ch), slightly larger text, centred against the How it works card.
5. **One card style:** white card, photo, 6px olive edge, padded words; 1px stone border on white sections. Who cards, home service cards and the More Services list.
6. **Project pages open like the main pages:** warm band, title, place, description, Get an Estimate + Call us; the before/after slider framed on the right. Built in `projectDetail()` in scripts/build.mjs (`.pd-open`). Without a slider the words and button sit on the right.
7. **Statement band:** photo brighter, shade lighter in the middle; even shade on phones and tablets.
8. **Project cards:** each row's lines start level (CSS subgrid), even when one title wraps.
- **Instagram:** the colour Instagram mark sits beside Facebook and Google in the header, menu, footer and estimate card. No account yet, so it is a plain mark; put the profile address in `site.config.json` > `instagram` and it becomes a link.

## Service strip, floating bar (2026-11-03)

Jeremy asked for "some cool shadow texture" on the six service buttons under the home hero. Four options were mocked up; he picked option 4 ("make it look spectacular!! and professional"). Rules are in docs/STYLE-GUIDE.md under Service strip.

- One white bar with a 6px olive top edge and a deep soft shadow. On the home page it floats up over the bottom of the hero photo and rises in as the last beat of the hero's load-in (still with reduced motion).
- Texture: faint topographic contour lines, the lines on a grading plan, in `src/assets/img/contour.svg` (made for TVIS, no outside art).
- Each service has a line icon in an olive square. The six icons are symbols in `src/partials/icons.html` (`s-prep`, `s-drain`, `s-drive`, `s-conc`, `s-pad`, `s-demo`).
- Hover and keyboard focus: warm gray cell, darker square, olive title with its line drawn in, a small arrow at the top right.
- Tablets show 3 by 2; phones show two columns of chips with their icon squares.
- At the foot of the six service pages the same bar sits under "All our services" (not lifted), with the page you are on marked.

## Home first screen, grade A pass (2026-11-03, later the same night)

Jeremy gave the new strip "a solid B": "the logos can be sharper, spacing can be a little better", then asked for every opening photo to follow the Builders edging. Rules are in docs/STYLE-GUIDE.md.

- **Icons, take three (Jeremy: "is this really the best icons you can do?"):** the thin line drawings were replaced by solid silhouettes in the style of the excavator in the logo: excavator digging a mound, culvert headwall with water running out, gravel drive up to a house, mixer truck, garage with a roll-up door on its slab, dozer pushing broken concrete. Drawn on a 72-unit grid (straight edges snapped to 2 units) and shown at 36px in a 56px olive square (32px on phones), so edges land on whole pixels. Generator: scratchpad icons3/make2.py.
- **Roomier cells:** 24px padding, 19px titles, 15px descriptors. "Shed Pads" below 1300px, and smaller descriptors on narrow laptops, so nothing wraps.
- **Real contour map:** `src/assets/img/contour.svg` is now generated from a smooth height field, with every fifth line heavier like a grading plan. It is shown at its own size so the lines stay hairline thin.
- **Hover and current page:** a darker olive segment draws across the top edge above the cell.
- **Header fit:** since the Instagram mark went in, the 1360px-up header ran 10 to 15px past the content column, so Get an Estimate stuck out past the edge of everything under it. The gap between header groups is now 18px there, and the button lines up again at every width.
- **Every opening photo framed:** the framed ending (even margin above, right and below) now applies on the six service pages and the ad page too, like Builders. Concrete, Demolition & Cleanup, Drainage and Gravel Driveways also got the charcoal "In this photo" caption bar, because their photos come from real projects. Site Prep, Shed & Garage Pads and the ad page have no matching project page, so they show the framed photo only.
- **No lone last words:** paragraphs use `text-wrap: pretty`.
- **Home rhythm:** the space under the Homeowner/Builder cards is a hair tighter (the Who section's bottom padding is 70% of the usual section space, about 72px instead of 104px on a big screen), at Jeremy's suggestion.


## Push two: Builders sections, Projects top, shed-pad block, icon pass (2026-11-03, after the first-screen push)

Jeremy flagged three blocks ("I think we can do better than this... mainly the text and the borders of the images, does it make sense to give them drop shadows?"; the Projects top "a lot of white space... how can we make it great"; the shed-pad list "needs to get reworked a touch") and asked for one more sharpening pass on the icons ("80% there").

- **Builders service sections (`.sv`):** each heading carries a `.sv-eyebrow` keyword line in olive ("Excavation contractor, Chattanooga, TN", "Utility trenching, ...", "Gravel driveways & concrete, ...", "Finish grading, ..."; the town comes from `baseLocation` in site.config.json through `{{base}}`). Jeremy liked the green line but not a "Phase 1 of 4" theme and asked for something search-friendly instead. Intro at 18-20px on a 46ch line, bullets 10px apart with a 10px square, the licensed-connections `.fine` note gets a 3px pale-olive rule. Columns a hair closer. On desktop the photo has a 6px olive bottom edge and an offset contour panel behind it (`.sv-media::after`, 20px down and outward, the same contour.svg as the strip; paper on tint bands, tint on white bands). A real drop shadow was built and shown as option B; the panel is what shipped (the shadow stays in the review page only). Phones: keyword line, heading, photo, words.
- **Projects top:** `.proj-open` is a short warm band: title and intro side by side, the filters along its foot on white chips, and the strip's contour map faint behind it. Jeremy turned down a first version with a "Where these jobs are" towns panel ("random text that adds no value... pull it up and fill the space by shrinking it"), so the band is about half a screen shorter and the grid starts within the first screen. The grid moved to its own `.proj-list` section. The full-width first project's words sit in a tint panel with a 6px olive left edge that fills the column beside the photo.
- **Homeowners shed-pad block:** the closing line and button sit in a `.pads-ask` white card with a 6px olive top edge, headed "What to send us". Same words.
- **Icons, take four:** Jeremy passed four of the six and asked for more tries on Drainage and Driveways; from a sheet of four each he kept the culvert for Drainage and picked V4 for Driveways (house with the drive graded in bands instead of gravel dots). Otherwise every straight edge on the 2-unit grid (whole pixels at 36px), nothing cut out thinner than 4 units (2px), the tiny gravel dots and window panes dropped or enlarged. Same six drawings. Generator: scratchpad icons3/make3.py.
- Checks: 26 pages x 9 widths no sideways scroll, console 0, keyboard pass, Lighthouse mobile on the five changed pages (see the thread).

## Spacing, sizing and scaling pass (2026-11-03, after push two)

Jeremy's brief: a complete website-wide spacing, sizing and scaling audit, no redesign ("I am generally happy with the existing design direction... refine it to a much higher professional standard"), and separately "I just feel like I gotta scroll a lot for no reason". Method: full-page screenshots of all 26 pages at 390, 820, 1440 and 1920 before and after (scratchpad `sa/shots2.mjs`, animations off and every image loaded), a measurement script that lists every section's padding, heading gaps and button heights (`sa/measure.mjs`), then the values changed in place in `site.css` rather than in another override block.

- **What the measurements found:** section space 104px top and bottom on desktop, so about 210px of empty space between the end of one section and the start of the next; the statement band 168px top and bottom; page tops without a band ranging from 88 to 120px (Estimate, Home Construction, Thanks, 404) against 56px on the title bands; title-to-intro gaps of 22, 24 and 28px across page types; heading-to-text 20px in two places and 24px everywhere else; hero buttons 56px against 54px everywhere else; "Serving Chattanooga" heading 54px against the 52px token; the Homeowners pad intro at body size while every other section intro is 18 to 20px; Homeowners sections without the olive keyword line that Builders got in push two.
- **The fix is four tokens in `:root`** (see STYLE-GUIDE section 4): `--sec` clamp(56px, 6vw, 84px), 44px on phones; `--open-pad` clamp(40px, 4.5vw, 56px) for the page openings (`.phero`, `.pd-open`) and the tops of the four pages without one; `--gap-head` clamp(28px, 3.4vw, 48px) for a section head to its content (`.sec-head`, `.phases-head`, `.est-intro`, `.pads-top`); `--gap-intro` 24px for a title or heading to its first line (`.phero p`, `.est-intro p`, `.pd-open .proj-row`, the home services head, the ad page lead). The statement band is clamp(72px, 8vw, 120px). The `.hero-act .btn` 56px override and the `.near h2` one-off size are gone. `.sv-intro` is one unscoped rule and the pad intro carries the class. Homeowners' four sections got `.sv-eyebrow` lines ("Gravel driveways", "Shed & garage pads", "Yard drainage", "Yard cleanup", each with the base town from `site.config.json`).
- **Result:** desktop pages 2 to 5% shorter (home 6064 to 5814px at 1440; Builders 5077 to 4865; the ad page 3603 to 3507), phones 1 to 2% (home 8140 to 8012 at 390). The rest of a phone page's height is the photos, cards and footer themselves, not air; cutting further means removing content, which the brief rules out.
- **Deliberate differences kept:** the Estimate form's send button is 64px (the one primary action on that page); project page titles are clamp(34px, 3.8vw, 54px) rather than the 60px title token because they are long and share a row with the slider; the home Who section's bottom padding stays 70% of `--sec` (Jeremy's earlier ask); the home hero keeps its own larger title.
- Checks: 26 pages x 9 widths no sideways scroll, console 0, keyboard pass, Lighthouse mobile on every page (see the thread).
- **Second step (same night, after the first went live as fefcca8):** Jeremy: "A lot better on mobile actually it's incredible... But desktop still feels super long... like 5 10% more." Desktop values only, phones untouched: `--sec` 64 (was 84), `--gap-head` 40 (was 48), the band 92 (was 120), footer top padding 52 (was 64), project page gallery groups and closing buttons 40px apart on desktop (were 56), the gallery section's top padding 44 (was 56), and the home service card photos 16:10 like the audience cards (were 4:3, the one mismatch between the two card types on the page). Against the first step: home 6% shorter at 1440, Builders and the service pages 5%, Homeowners 4%, project pages 3%; every phone page the same height to the pixel.


## Header touches and a graded hero photo (2026-11-03, after the spacing pass)

Jeremy: "lets first spend like 15 minutes polishing up this header.. is there any cool uiux elements to add here that would just be super cool and also just a way to make the text and logo and rest of the white space do something nice but not too busy at all", and on the hero: "is there any way to make this picture better?... I am down to stick with the same picture but anything that can add a 5/10 percent improvement without doing a big overhaul?" Options page (real header and hero, five touches each): https://claude.ai/artifact/UP1PACgd8SNjSEjWCodo7D. He picked header B, C and D and hero 1.

- **B, one marker on a ground line** (`.nav-mark`, site.js): a 1px stone hairline under the four menu links and one 3px olive marker that rests under the current page, slides to the hovered or focused link, and slides home when the pointer leaves. On the home page (no current link) it stays hidden until a link is hovered. site.js adds `html.nav-js` and places it from the links' boxes (re-placed on resize and once the fonts are in); without JS the old per-link draw-in underline stays. Reduced motion: the marker jumps instead of sliding.
- **C, the reading line** (`.hdr::after`): the header's bottom hairline fills olive-deep from the left as the page is read. site.js sets `--read` (0 to 100%) in the same scroll handler as the shadow and the compact header.
- **D, contour whisper** (`.hdr::before`, 1024px and up): the service bar's contour map (`contour.svg`) behind the menu at 75%, masked so it fades out before the logo and before the social marks. The header content sits above it (`.hdr-in` z-index 1).
- **Hero 1, the graded photo**: `GRADE` in scripts/build.mjs lists site photos that get a light grade at build time (brightness 1.03, saturation 1.14, contrast 1.10 with a -12 lift, a mild sharpen at 960px and wider). Only `home-hero` is listed: it was shot under an overcast sky and read flat and grey. The original in photos/site/home-hero.jpg is untouched; the share image is not graded. The 1200px file grew from 298 KB to about 400 KB.
- **Offered and not taken:** A, a two-line keyword stack beside the logo ("Excavation & Sitework" over the base town; it only fits at 1760px and wider); hero 2, the service pages' charcoal job caption on the hero (the hero is the East Ridge hillside driveway job, projects/2026-10-hillside-driveway, progress-1); hero 3, the Call button showing the number on desktop; hero 4, a recent-job card with a thumbnail. The CSS and markup for 2 and 3 are in the thread history if he comes back to them.
- Phones are untouched: the menu, the header and the hero on a phone are the same as before this batch, to the pixel, except that the hero photo file is now the graded one.
- Checks: no sideways scroll at any of the nine widths on all 26 pages, console clean, keyboard pass, Lighthouse mobile 90+ on home, Builders and Projects.

## Bug sweep, slower dozer and footer touches (2026-11-03, after the header batch)

Jeremy: "lets do an entire site inspection for bugs .. just straight bugs and issues", then "make the dozer at the bottom go slower... any other cool flares on the dozer go for it... like moving some dirt in front of it", and "any other nice touches you want to add to the footer go for it especially on the color.. but very subtle is key".

- **The sweep** (all 26 pages, nine widths from 320 to 1920): links and anchors (one dead link is the Google mark in the home hero area, which points nowhere until `googleBusinessProfile` is set and is meant to), images, console, sideways scroll, phone menu (open, Escape, Tab stays inside), header marker and reading line, estimate form (required fields, bad email, honeypot), project filters and `?type=` presets, the before/after sliders, axe accessibility at 390 and 1440 (0 violations), titles, descriptions, canonicals, robots and sitemap (the four noindex pages are left out on purpose), html-validate.
- **The one real bug:** every page shipped `<meta http-equiv="Content-Security-Policy" content="__CSP__">`. The header batch (5a1f761) copied an older `scripts/build.mjs` over the spacing pass's (fefcca8), which had added `contentSecurityPolicy()` and the `__CSP__` replacement, the https-only check on the config links, the tracking-ID checks and the `ldJson()` escaping. Browsers logged an error on every page and the policy did nothing. Fixed by restoring fefcca8's build.mjs and re-applying only the `GRADE` block from the header batch. Lesson, again: before a batch, pull the repo's latest `build.mjs` (and everything else) rather than copying from an older working copy.
- **Dozer:** rolls in over 3.4s (was 1.6s) with an easier stop; the tracks run for the whole roll; three exhaust puffs rise from the stack during the first two seconds; a dirt pile grows in front of the blade as it pushes (`.dz-dirt` in `src/partials/dozer.html`, hidden everywhere but the footer roll) with two clods tumbling off; the blade settles down a touch as it stops (`.dz-blade`). All of it keys off `.ftr-ground.go`, which site.js never adds under reduced motion, so the parked dozer is unchanged there and on the 404, Thanks and phone menu.
- **Footer colour, quiet:** charcoal deepens to #1E2629 at the bottom; the header's contour map sits behind the top of the footer at 42% with a brightness lift, masked off the left third and faded out by the columns; a 1px olive-light sunlit edge on top of the olive ground line and a 1px shadow under it; list links, the service-area text and the copyright row in the soft off-white (#E3E7E0) so the logo, phone and headings carry the colour; a hairline above the copyright row.
- Checks: console 0 (the CSP error is gone), no sideways scroll at nine widths, axe 0, keyboard unchanged.
- **Second pass (same night):** Jeremy: "just a touch more dirt... its still a touch fast as well". The roll is now 4.6s (tracks, pile growth and the dozer's own transition all share it); the heap is two mounds (`.pile-back` at 55%, `.pile-front` at 90%, about 60 units wide and 25 tall in the 260-unit drawing, so it runs past the SVG's right edge into the gutter, which is why `.dozer` has `overflow:visible`); four clods instead of two; two low dust puffs at the cutting edge; the whole heap gives a little (`dirt-settle`) as the blade settles at 4.45s. Still all under `.ftr-ground.go`.
- **Third pass, the A+ pass (same night; Jeremy: "the dozer its an A- lets make an an A+ just one more pass... and a touch slower like 5% slower"):** the roll is 4.85s. The blade arrives raised and lowers into the dirt in the first second (`blade-run` is now one 5.5s keyframe that also holds the settle at the end); the whole machine pitches a hair (0.45 degrees, `.dz-rig`, four slow cycles) while it rolls; two dust puffs kick up behind the rear track (`.tdust`); and once parked a faint idle puff (`.puff-idle`, 28% opacity) rises from the stack every 3.2s. `.dozer` has `will-change:transform` for a smooth slide. All of it still keys off `.ftr-ground.go`.
- **Fourth pass (same night; "8% more dirt... 8% slower"):** the roll is 5.24s and every delay is a share of it, written out as literal seconds: Chrome does not carry a custom property from the footer into the inline SVG's children, so `animation: x var(--roll)` computed to nothing there. The heap now grows to 108%.
- **Fifth pass, last of the night ("7% more dirt and dust and 7% slower"):** 5.61s roll, heap to 116%, the blade-edge and rear-track dust 7% bigger and stronger, heap at 88%.
- **Sixth pass ("alot more dust like 15% more .. and like 7% more dirt and 7% more slower"):** 6.0s roll, heap to 124%, dust 25% up: three puffs at the blade and three behind the rear track instead of two, each bigger, stronger and a little longer-lived (1.6s and 1.4s). And a small TVIS badge on the engine hood (`.dz-badge`, Barlow Condensed 14 units) on every copy of the dozer; Jeremy then asked for it in orange (Tennessee orange #FF8200, his quiet Volunteers nod; a colour on its own is not a trademark), and once live found the orange on the olive hood hard to read, so the letters now sit on a small charcoal nameplate (`.dz-plate`, 38 by 17 units) at 15 units. Jeremy also asked for an "ultra ultra subtle" Tennessee Volunteers nod; an SVG `<title>` tooltip ("Volunteer State groundwork") went live in this pass and he had it removed minutes later ("thats no good"), so the dozer carries no tooltip. If the idea comes back: "Volunteer State" is the state nickname and fine; the Vols name, Power T and checkerboard are University of Tennessee trademarks and must not be used on the site.
- **Frames on every placed photo (07:35 UTC, Jeremy: "apply this frame to ALL photos when it makes sense", with the Drainage "What we do" photo, a "Recent job like this" row and the Site Prep "What we do" photo as the misses):** a survey of every content photo on every page (scratchpad insp/survey.cjs) found the Builders and Homeowners `.sv` sections framed and three placed-photo patterns plain: the service pages' "What we do" photo and the ad page's (`.lp-two .sv-media`), the Homeowners pad photo (`.pads-pic`) and the single "Recent job like this" row on the service pages (`.proj-grid-one .proj`). All three now get the same recipe as the Builders sections, desktop only: an offset tint panel with the contour map behind the photo, pushed away from the words (down-right when the photo is on the right, down-left on the left), and a 6px olive edge under the photo (one block at the end of site.css). The pad photo no longer bleeds above and past the content width, so its frame reads like the others. The single project row needed a grid-placed `::before` as its panel because the slider clips its overflow. Left plain on purpose: cards, galleries, the two- and three-up slider grids, the project page slider and the page openings. Checks: no sideways scroll or console errors at 901, 1024, 1180, 1440 and 1920; phones unchanged (all rules sit under `min-width: 901px`). Also in this push: the dozer's TVIS badge turned Tennessee orange and its tooltip came off (above).
- **Phone skip fixed (07:45 UTC, Jeremy: "the dozer animation on mobile skips ahead in an odd way"):** the roll was a 6s CSS *transition* while the tracks, blade, heap, dust and pitch were CSS *animations*; on a phone the two can start on different clocks (a transition needs the start state painted first, and a page restored at the bottom or a busy main thread delays it), so the dirt and blade ran ahead of the machine or the machine jumped to its spot. The roll is now a keyframe animation (`dozer-roll`, same 6s and easing, `both`) so every part shares one clock, and site.js adds `.go` two frames after the ground scrolls into view. Nothing else about the motion changed.
- **Parked dozer (phone menu, 404, Thanks) fixed (07:50 UTC, Jeremy's phone screenshot: the ground line floated off to the right of the menu dozer; "he can be static but a little smaller"):** `.dozer-spot` was a flex row with the line as a sibling after the machine, so the line started where the dozer ended and the tracks hung above it. Now the line is an absolute 6px bar across the whole spot, the dozer sits on it with its tracks exactly on the line (`margin-bottom: calc(6px - width * 7 / 260)`, the 7 being the viewBox units under the tracks; the global `.dozer` offsets are cleared with `inset:auto`), a settled heap shows in front (`.dz-dirt` at .88, `.pile` at 1.2), and the menu copy is 100px wide (was 120). Width is the `--dzw` custom property; 404 and Thanks keep `min(220px, 46vw)`. Still static everywhere except the footer.

## Three touches: page fades, photo viewer, copy and selection (2026-11-03, 14:00 UTC)

Jeremy: "Across the entire website, is there any UI/UX features you think you can add somewhere? those are the nice touches that set us apart?" then "give me 3 suggestions" and "lets do all 3".

- **Smooth page changes:** `@view-transition{navigation:auto}` at the end of site.css. Chrome, Edge and Safari 18.2+ cross-fade the page content between pages (old out .18s, new in .32s with a 6px rise, `--ease`); the header (`.hdr`, `view-transition-name:hdr`) and the phone bar (`.mbar`) are taken out of the fade and switch at once, so the header reads as fixed while the page changes under it. Two headers blended together looked like a glitch, so the named groups have `animation:none` and the old images are hidden. Firefox and older browsers load pages as before. Off under `prefers-reduced-motion` (the nested `@view-transition{navigation:none}` parses in Chromium, checked via CSSOM).
- **Project photo viewer** (`.lb` in site.css, the last block of site.js): on `/project/*` every `.pd-photo` tile (already a link to the biggest file) opens a `<dialog>` with `showModal()`: the photo as big as the screen allows on an olive edge, a charcoal backdrop at 98.5%, square prev/next/close buttons (olive-deep on hover), a "3 / 8" counter in Barlow. Arrow keys, a sideways swipe (pointer events, 40px with more sideways than up-and-down), the buttons, Esc (through the `cancel` event so it fades out) and a tap on the backdrop. The neighbours are preloaded so the next swipe is instant. `html.lb-open` stops the page scrolling underneath. Focus returns to the tile on close. Phones: the photo runs edge to edge, prev/next drop to the bottom corners. Ctrl/Cmd-click still opens the plain photo in a new tab; without JavaScript the tile is a plain link.
- **Brand polish:** `::selection` in pale olive (`--pale`) on light sections, olive-light on the charcoal footer and statement band; tapping any `mailto:` link also copies the address (`navigator.clipboard`, secure contexts only) and shows an uppercase "Copied" (`.copied`, `role=status`) beside it for 1.8s. The mail app still opens where there is one.
- Checks (Playwright, Chromium): desktop 1440, phone 390 (touch), iPad 810: viewer opens, arrow keys and touch swipes move through the photos, Esc and a backdrop tap close it, the email copies, selection colour, and the page fade settles cleanly at 2s with no console errors. Build clean.

## Round two: project openings, card glide, form memory, Next job + Share, side contours (2026-11-03, 14:20 UTC)

Jeremy: "any other quick wins across the site? these are awesome", "do all of these"; then two screenshots of project pages without a before/after pair ("this looks rough", "dont just add fluff and words for no reason but make this good", "that goes for all of these project pages"); then "there is a ton of white space on each side .. is there some very subtle things to do to make it not so blank? subtle is the key word".

- **Project openings without a before/after pair** (five of the ten): the write-up and buttons used to float in a right column, end-aligned against the title. Three options were mocked (screenshots in /mnt/project-files/tvis-site/shots/opening-*.png): A the job's best photo on the right where the slider sits, B one block on the left with nothing on the right, C two columns lined up at the top with a hairline. Jeremy tapped B, then wrote "I think C": **C** is what ships. build.mjs keeps A behind `PROJECT_OPEN_PHOTO` (false; the photo path puts `after[0]`, else the last progress photo, in `.pd-ba > .ba.ba-single > a.pd-photo`, removes it from its group and makes it first in the viewer) and site.css carries C as the `:not(.pd-open-ba)` rules (grid areas crumb / title+words / row+words, `align-items:start`, the words column `padding-top:.45em` with a stone hairline on its left, write-up 40ch). Do not reoffer A or B.
- **Card glide** (site.js slider block + `.ba-glide`, `@property --pos`): on hover-capable, fine-pointer screens, `mouseenter` on a `.proj` card glides the handle to 6% over .8s (`--ease`) and `mouseleave` glides it home; a `pointerdown` (capture) drops the class first so a drag never lags, and marks the card as taken so it stays where the visitor left it. Off under reduced motion. Browsers without `@property` (old Firefox/Safari) jump instead of glide.
- **Form memory** (estimate block): every named field except the honeypot, the hidden source fields and the photos is saved to `localStorage.tvis_estimate_draft` (300ms after typing, and on change) and restored for seven days. A `?type=` or `?who=` on the URL still wins for those two fields. When any text field came back, a `.draft-note` line ("We kept what you typed earlier. Start over") goes at the top of the form; Start over clears the draft and reloads. `showThanks()` clears it on send.
- **Next job + Share** (`.pd-more` after `.pd-cta`): a hairline, then a link to the next project in the gallery order (wrapping to the first) with a 132px thumbnail, "Next job", the title and its town · service, and an arrow that nudges; on the right a `.pd-share` button (hidden until site.js shows it) that opens the phone's share sheet (`navigator.share` on coarse pointers) or copies the page link with a "Link copied" note placed before the button so it never runs past the page edge. Phones: stacked, the button full width.
- **Side contours** (`body::before`, 1600px and up): contour.svg fixed, `cover`, opacity .42, masked so it fades out 140px before the content edge; `body{position:relative;z-index:0}` keeps it under everything, so sections with a colour or a photo cover it and only white sections show it. Checked at 1920 and 2560.
- **Not added:** the phone menu already staggers its links in (`.mmenu li` settle, 40ms apart), so suggestion 4 of round two was already on the site.
- Checks: Chromium at 1440, 1920, 2560, iPad 810 and phone 390 (touch): openings, Next job, Share (clipboard), glide (50% to 6% and back, class removed), form restore and Start over, console clean. Build clean. Files: scripts/build.mjs, src/assets/site.css, src/assets/site.js, docs.

## Home hero, balanced edges (2026-11-03, 17:00 UTC)

Jeremy sent a screenshot of the desktop home hero: "can you make the right side of this picture kind of match the left side", "it just seems way brighter or am i crazy?", "subtle is key". He was right: with the left scrim behind the headline, the right edge measured about 2.6 times as bright as the left (mean luminance 65 vs 25 at 1900px wide; the top right sky 89).

- **Right edge shade** (last block of site.css, desktop 901px and up): `.hero::after` now stacks a soft mirror of the left scrim from the right edge (`.50 → .34 → .17 → .05 → 0` over the last 34%) and a radial shade at the top right corner (`.32 → .12 → 0`) over the unchanged left scrim. Right edge now 42, top right 59; the house and the excavator body are untouched (the arm and bucket sit in the last of the shade). The photo, its grade and its crop are unchanged. Phones have no scrim, so nothing changes there.
- Checks: Chromium at 1280, 1440, 1900 and 2560; screenshots /mnt/project-files/tvis-site/shots/hero-right-*.png. Build clean. Files: src/assets/site.css, docs/STYLE-GUIDE.md, docs/HANDOFF.md.

## Refine pass: five small fixes (2026-11-04, 01:30 UTC)

Jeremy's master prompt: review every page, section and state and make an already great site 5-10% better; no redesign, no changes just to show work was done ("dont just add fluff"). Review: 19 pages at 390, 768, 1024, 1440 and 1920 in Chromium; no sideways scroll, no console errors or broken images, axe-core clean once the load-in motion settles, a visible focus ring on every link, button and field. Considered and left alone: the home hero `sizes` stays `(max-width: 900px) 80vw` (100vw cost Lighthouse 10 points, see above); the pad landing page's button stays at the bottom of its column (lined up with the photo on purpose).

- **What happens next** (`.how-text p`): was 32ch (about 270px) on the six service pages and the pad landing page at every width, so five short lines on desktop and narrower than the screen on phones. It now uses the homepage's style everywhere (46ch, 18-20px, line height 1.55); `p.svc-related` stays 16px with no width cap, so its two links sit on one line on desktop.
- **Estimate forms:** a fieldset `legend` ignores the grid gap, so "I'm a…" sat almost on its buttons; it gets the same 10px (`.f-who > legend`). Labels with an `.opt` note are a wrapping flex row, so a note that wraps on phones ("optional, but they help a lot") starts flush left instead of 6px in.
- **Footer tap areas:** `.ftr-phone`, the email under it and `.ftr-top` grow to 44px tall with padding and matching negative margins, so nothing moves. The phone number and the email sit 6px apart, so their areas meet in that gap (13/3px and 3/17px) instead of overlapping; the email's hover line is moved up to stay 3px under the words.
- **Footer hairline:** `.ftr-bottom` drew its border on the padded `.wrap`, so it ran out to the page gutters; it is now a `::before` inset by `--gut`, in line with the logo and Back to top.
- **Footer columns:** at 960-1180px the four link columns sit in one row under the logo (was a tall two-by-two stack); at 1181px and up the Pages column is `minmax(max-content,.8fr)`, never narrower than its longest link, so "Builders & Contractors" no longer breaks onto two lines (the other columns give up 2-15px; Service area wraps exactly as before).
- Checks: overflow and console clean on 19 pages x 5 widths, axe clean at 390 and 1440, Lighthouse mobile home 90 (90 before the change, same LCP), service page 95, Homeowners 91, estimate 100. Files: src/assets/site.css (last block), docs/STYLE-GUIDE.md, docs/HANDOFF.md.

## Refine pass two: spacing in step (2026-11-04, 03:10 UTC)

Jeremy: "hit me with another pass", "small spacing anything". Measured every section's padding and every heading, text and button gap on 18 pages at 1440 and 390 (Playwright), then fixed the ones out of step with the rest of the site. Last block of site.css.

- **Project card grids** (home Recent projects, service pages' Recent jobs, Projects, Home Construction once it has cards): the 40px margin under each card (the row spacing of the subgrid layout) also sat under the last row, so those sections ended 104px under the last line instead of 64 (84 vs 44 on phones). `.proj-grid:not(.proj-grid-one):has(> .proj){margin-bottom:-40px}` at 600px and up; `:has` keeps it off an empty grid.
- **Projects opening** (`.proj-open`): 52px above, 32 below; now `--open-pad` both ways like every page opening. Phones: title to intro 24px (`--gap-intro`), was 16.
- **Text to button is 32px everywhere:** the Homeowners "What to send us" card had 24, the "Qualified trades..." note (`.fine`) had 28; that note now sits 20px under its list on both Builders and Site Prep (was 16 on one).
- **Button then "Or call us" stacked on phones:** 16px on every page (`.hc-cta`, `.pd-cta` had 20).
- **Phone service rows on the home page:** name to description 8px (was 5).
- **Builders phase list on phones and tablets:** a two-column grid so the description lines up under the phase name, not under the number.
- **Project pages, Share this job:** the empty "Link copied" note in front of the button took 14px, so on phones the full-width button sat 14px in from the edge. The note is now absolutely placed (left of the button on desktop, centred under it on phones), so it takes no space; checked that it still shows "Link copied" in both places.
- Checks: section paddings and gaps re-measured (all now match), overflow and console clean on 19 pages x 5 widths, axe clean at 390 and 1440. Shots /mnt/project-files/tvis-site/shots/refine2-*.png. Files: src/assets/site.css, docs/STYLE-GUIDE.md, docs/HANDOFF.md.

## The crew: Joey's excavator and a truck join the footer dozer (2026-11-04, 16:30 UTC)

Joey bought a mini excavator (an orange Kubota U35-4; Jeremy sent photos of Joey and his son on it). Jeremy: not the real photo, an illustration "kinda like the dozer at the bottom", "a core part of this operation", "a trademark of his business"; "keep the dozer and the animation there right now"; "brand it just like we did with the dozer"; his idea for the scene: "the excavator at the bottom left fills a mini truck up and the dozer pushes a road for the truck"; then "the full crew but make the truck disappear after it follows the dozer", "make sure the scale is perfect too", "100% effort". He picked from three options (crew / dig and push / parked) shown as pictures and videos (/mnt/project-files/tvis-excavator/).

- **Drawings:** `src/partials/excavator.html` (viewBox 300 x 128, ground at y=128; boom, stick and bucket are nested groups pinned at 134,80 / 190,26 / 218.5,109.2) and `src/partials/truck.html` (150 x 78). Same flat olive shapes and charcoal cut-outs as the dozer, same `--dz` / `--dz-dark` colours, same charcoal nameplate with orange TVIS letters (counterweight; a small one on the truck's door). Nothing says Kubota.
- **Markup:** footer.html and footer-landing.html: `.ftr-ground` now holds `.ftr-lane` (the road `.ftr-road > .road-run` and the truck, under the dozer so the truck can pass behind it), then the excavator, then the dozer. The dozer partial, its CSS and its 6s roll are untouched; `.ftr-ground .dozer{z-index:3}` is the only rule added to it.
- **CSS:** one block at the end of site.css ("The crew"). Sizes hang off `--k` (the dozer's scale: .5769 desktop, .4 at 900px and under): excavator width 300px x --k x .82, truck 150px x --k x 1.25, so the proportions hold at every width. The ground strip grew from 68 to 88px (phones 56 to 66) for the arm's headroom; measured on the built site at 1440, 820 and 390: the stick's top stays at least 4px inside the strip at the top of the swing.
- **The story** (all keyed on `.ftr-ground.go`, which site.js already adds; nothing changed in site.js): 0.5 to 5.5s the excavator digs two buckets (`ex-boom` / `ex-stick` / `ex-bucket` keyframes, angles from an inverse-kinematics script in /mnt/project-files/tvis-excavator/source), rocking a hair (`ex-rock`), clods kicking up at the bite (`ex-kick-*`), dirt in the bucket (`ex-load`) and falling into the bed (`ex-drop`), the pile sinking (`pile-dug`), the load rising a step per bucket (`load`) and the bed taking the weight (`tr-rig`); the dozer rolls 0 to 6s as before and the road appears behind it (`.road-run` runs the same `dozer-roll` keyframes, clipped by `.ftr-road` whose right end is the dozer's parked rear); 6.3s the truck pulls away (`drive`, 5.6s, dust off its rear wheels, exhaust) to past the dozer's middle, where the lane's mask (`--fade`, from the dozer's rear to its middle) has faded it out; then an idle puff now and then on both machines.
- **Phones (under 600px):** `.ftr-lane` hidden; the excavator swings lower (`*-b` keyframes) onto a two-tone spoil pile (`.ex-spoil`, `spoil` keyframes) that grows a step per bucket, with clods (`.sp-clod`) rolling down its sides. Tablets (600 to 900px) get the full crew at the smaller scale.
- **Reduced motion:** site.js never adds `.armed` / `.go`, so everything sits parked with the road graded and the truck empty: a still picture, like the dozer before.
- **Checks:** built site at 1440, 1920, 820 and 390 on Home, Homeowners, Builders, Projects, Estimate, the ad page and 404, frames at 0 to 12.5s: no overflow, no console errors, arm inside the strip, truck gone by 12s. SVG partials well-formed (xmllint).
- **Also in this push: refine pass two** (the previous section), which was built but never pushed, and the Images project's "Framed lone project photo" rule (its block sits in `site.css` right before the refine-two block, with its line in the style guide's "Placed-photo edge" bullet): a project page gallery group with one photo gets the placed-photo frame on desktop. It was waiting in Jeremy's folder at 16:00 UTC, so this push carries it rather than overwriting it.
- Facebook and the GBP video can show the real machine; the website shows the drawing. Jeremy's photos of the lot the excavator graded (before/after beside a brick building) could become a project page later: needs Joey's original photos, the town and what the job was.

## Home hero v2: one finished job, cinematic (2026-11-07, 15:00 to 16:10 UTC)

Jeremy asked for a world-class hero (explore several directions, pick the strongest, build it; "this makes or breaks the website"). Not committed or pushed: Jeremy commits and pushes himself.

- **How it was chosen.** About 90 job photos compared side by side (full-size decodes of the strongest HEICs). A first build ("one job, start to finish": the finished drive with a framed in-progress photo of the same lot) was turned down: **Jeremy wants finished work only in the hero, no "In progress" shots**, and he didn't like the line "Every photo on this site is our own work." Three new options followed: (1) split, photo on the right with a second job framed over the seam; (2) cinematic, one photo behind the words with a row of three small finished-job photos; (3) a portfolio wall of three jobs. He picked 2, then picked photo 1 of six candidates for it (IMG_8482, the East Ridge hillside drive under tall pines). Last, he took out its row of three small project photos ("a little less clutter"; he also wanted project names, never towns, on them) and moved the "In this photo" bar to where they were, then asked for it "small and more to the right": it is now a slim one-line bar (label and project name, no town or month) in the photo's bottom right corner.
- **Built.** Dark field; the photo fills the right of the screen from 30% in and fades into the dark behind the words (so the house is never under the headline), anchored at its foot so the house and drive fill the frame. Contour lines whisper behind the words. Headline unchanged ("Groundwork / Done Right.", now up to 96px). Under the buttons, a camera icon and "Send a few photos. We'll look them over and call to talk it through." (Joey's estimate wording). In the photo's bottom right corner, a step above the service bar: a slim one-line "In this photo" bar naming the hillside job and linking to it. Phones: photo on top, a slim caption bar under it, then the words.
- **Files.** `photos/site/home-hero.jpg` (= projects/2026-10-hillside-driveway/after-2.jpg, IMG_8482). Markup in `src/pages/index.html`; CSS in the "Home hero v2" block at the end of `src/assets/site.css` (`.hv`, `.hv-job`, `.hv-proof`). `scripts/build.mjs`: `GRADE` is now empty (it was for the old overcast hero), `home-hero` joined `CRISP`, and a new `XL` set adds a 2400px file for the hero so Retina and big screens get a sharp photo.
- **Checked.** 360, 390, 600, 768, 901, 1024, 1179, 1280, 1440, 1920 and 2560px wide: no sideways scroll, the house clear of the words. Keyboard order: headline, buttons, then the caption bar. Lighthouse (phone, local server): accessibility, best practices and SEO 100, layout shift 0, performance 82 to 83 against 80 to 81 for the old hero on the same machine (the live site scored 89 with the old hero; Google Analytics is the biggest remaining weight).
- **If the hero photo changes:** keep it a finished job with a project page, set the caption bar's title, town and month from its project.txt.
- **Motion and size (later the same day, while Jeremy was away for an hour).** He asked for the hero about 7% smaller (now 520 to 725px tall on desktop, headline 52 to 89px) and for "something interesting instead of this static photo". After a quick look at what premium builder and architecture sites do (restraint: one cinematic reveal, a slowly breathing photo, a little pointer depth), the hero got: an olive "blade pass" that uncovers the photo on load, headline lines rising from their baselines with the olive bar drawing in, a 26s slow drift on the photo afterwards (paused off screen), and up to 12px of depth under the mouse on desktop. All transform-only, all off under reduced motion; Lighthouse unchanged (CLS 0, TBT 40 to 50ms). Details in STYLE-GUIDE "Home hero motion"; code in the "Home hero motion" block at the end of site.css and the hero block in site.js.
- **Final pass (same afternoon).** Hero another 3% smaller (505 to 703px tall on desktop, headline 50 to 86px; phones reworked smaller: 37px headline at 390 wide, 17px subhead, after Jeremy found the phone text too big). The words are now centred between the header and the top of the service bar. The caption bar's entrance no longer leaves a clip-path on it, which had been hiding its keyboard focus ring. The layout no longer needs container queries (older Safari gets the same thing). Checked at 13 widths from 360 to 2560px, hover and focus states, reduced motion and Lighthouse (accessibility, best practices, SEO 100; CLS 0).

## Whole-site review (2026-11-07, 16:30 UTC onward)

Jeremy asked for an analysis of the whole site and small polishes. Checked all 29 pages at 390 and 1440px (status, console errors, sideways scroll, one H1, alt text, image sizes, titles and descriptions, placeholders, tap targets), every internal link (none broken), full-page screenshots of the main pages, and Lighthouse (phone) on 20 pages: accessibility and best practices 100 everywhere, SEO 100 except the pages that are noindex on purpose (Home Construction, Thanks, 404, the ad page). Fixes made: the contour map is preloaded in the head (it was the largest paint on the Projects opening and on short pages' footers), and page-opening photos ask for 66vw on phones; Homeowners, More Services, Demolition, Thanks and Home Construction went from 87 to 91 up to 97 to 100. Projects stays around 78 in the lab test because ten before/after cards (about 2MB of photos) load at once on a phone.
- **SEO pass (same afternoon).** The setup was already strong: unique titles and descriptions on every page, canonical links, a full HomeAndConstructionBusiness record (address, phone, map, Facebook and Google links, service towns, the service list), breadcrumbs on every inner page, a sitemap with dates, descriptive photo file names and alt text. One change: the homepage hero's "Excavation & Sitework · Chattanooga, TN" line now sits inside the H1, so the main heading says what TVIS does and where (no visible change). Left for Joey: business hours (site.config.json "hours" is blank and Google weighs them), towns for the garage pad and mobile home teardown jobs (their titles carry no place), and Google reviews.
- **Meet Joey, who's who (same afternoon).** Jeremy asked how to make it clear which man is Joey. A small charcoal name tag ("JOEY  OWNER", notch pointing down) now sits over Joey's head in the photo, placed in % of the 4:3 photo so it stays on him at every width (`.owner-tag`), and the caption bar reads "In this photo | Joey (right) with the customer" over the job title. Still open: Joey's last name and one or two sentences from him (the [JOEY: ...] placeholder, hidden on the live site), and ideally a photo of Joey on his own with his machine.
