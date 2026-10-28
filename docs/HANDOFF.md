# TVIS website: build handoff

Read this first. It is the full brief plus every decision made so far, so a Claude Code session in this folder can continue without the earlier conversation. `docs/ROADMAP.md` has the phases from here to launch and after.

Last updated 2026-10-28, 05:40 UTC (full redesign pass plus two polish passes, overnight build; not yet in Jeremy's folder).

## Status

- Research and the first design: done and approved by Jeremy on 2026-10-28 (review page: https://claude.ai/artifact/PdHEFQ2Ln37rjNDSD46U1V). The site was built from it the same day and went live at https://jsglisson3.github.io/TVIS-Site-Work-and-Construction/.
- **Jeremy then asked for a full redesign pass** ("you can do way better than this"; the header, footer, logo and hero matter most; the first dozer looked amateur; the type was weak; the logo was fuzzy). That pass is done in `src/` and is what this document now describes. The mockups in `docs/design/` are the earlier, superseded look; the build is the reference now.
- Every page is built: homepage, `/homeowners`, `/builders`, `/more-services`, `/home-construction`, `/projects` plus `/project/<folder>` detail pages, `/estimate`, `/lp/shed-garage-pads` (landing layout, noindex), `/thanks` (Basin's no-JS redirect target) and `404.html`.
- Checked 2026-10-28 at 390px and 1440px with no sideways scroll. Lighthouse mobile: homepage 98 / 100 / 100 / 100, homeowners 98 / 100 / 100 / 100, estimate 98 / 97 / 100 / 100. Estimate form prefill and the thank-you state tested in a headless browser against a fake endpoint.
- Docs: `README.md`, `HOW-TO-ADD-A-PROJECT.md`, `photos/site/README.txt`, `LAUNCH-CHECKLIST.md`, `docs/ROADMAP.md`.
- GitHub: repo `jsglisson3/TVIS-Site-Work-and-Construction`, Pages source = GitHub Actions (on). Jeremy does every commit and push from VS Code; each sync redeploys. The Claude GitHub App is not installed and Jeremy wants to keep merging manually.
- **Waiting on Jeremy / Joey:** everything under "Placeholders still waiting" at the bottom, the Basin account, and real photos.

### If you pick this up later

Work in `src/`, run `npm run dev`, check 390/1440 and Lighthouse before calling anything done, and look at your own screenshots. Form project-type codes: `driveway, pad, drainage, siteprep, utility, concrete, cleanup, home, other`; customer codes `homeowner, builder, other`. To add a landing page, copy `src/pages/lp-shed-garage-pads.html` (see README). One editor at a time: if Claude Code on Jeremy's PC and the project chat both touch the folder, update this file before switching.

Known small items: the three "Sample:" project folders hold drawn pictures and should be deleted once real jobs exist; `src/pages/home-construction.html` still needs Joey's intro; the inspector's one remaining fail on the homepage (the phone call bar covers large text at some scroll positions) is accepted, because the bar is the site's main conversion control.

## How the site is built (already in place)

- Plain HTML/CSS/JS, no framework. `npm run build` runs `scripts/build.mjs` (only dependency: `sharp`) and writes `dist/`. `npm run dev` builds and serves `dist/` at http://localhost:8080 with clean URLs (`/homeowners` serves `homeowners.html`, same as GitHub Pages).
- `src/pages/*.html`: one file per page. Front matter between `---` lines: `title`, `description`, `path` (optional), `nav` (which menu item is current: home, homeowners, builders, more_services, home_construction, projects, estimate), `schema: yes` (adds LocalBusiness JSON-LD), `noindex: yes`, `sitemap: no`, `layout: landing` (uses the `-landing` header and footer), `body_class`, `form_type` and `form_who` (prefill for a landing page's form).
- Template tokens: `{{> partial}}`, `{{phone}}`, `{{phone_href}}`, `{{email}}`, `{{base}}`, `{{service_area}}`, `{{hours}}`, `{{hours_footer}}`, `{{licensed}}`, `{{licensed_inline}}`, `{{response_time}}`, `{{facebook}}`, `{{instagram}}`, `{{gbp}}`, `{{form_endpoint}}`, `{{year}}`, `{{recent_projects}}`, `{{project_cards}}`, `{{home_construction_cards}}`. Empty config values render as yellow `<span class="tbd">[PLACEHOLDER]</span>`.
- Pictures: `{{photo slot="name" label="shot" alt="..." [draw="scene[:state]"] [sizes="..."] [eager]}}` shows `photos/site/<slot>.jpg` when it exists, otherwise the named drawing, otherwise nothing (a hidden note that `?slots` on the URL reveals). `{{ba slot="name" before="..." after="..." alt="..." [draw="scene"]}}` is the drag slider: real `-before`/`-after` photos when both exist, otherwise the drawn pair. `{{diagram name="pad" state="after" animate label="..."}}` places a drawing inline (the animated pad cross-section on `/homeowners`).
- Drawings live in `scripts/diagrams.mjs`: cross-sections of the work (driveway, pad, drainage, cleanup, siteprep, utilities, concrete, finalgrade) in the brand palette, with `before`, `after` and for some `progress` states. They are honest stand-ins, not pretend photos; nothing on the page calls them photos.
- `site.config.json` is the single source of business details (NAP consistency for local SEO).
- `projects/YYYY-MM-town-job/` folders → gallery. `project.txt` keys: title, category, town, status, featured, description. Photos named `before-N`, `progress-N`, `after-N`. Blank status shows In Progress until after photos exist. Newest first, featured pinned. The build also writes `dist/projects.json` (keep its shape stable for the future auto-posting automation). Three sample folders exist with drawn pictures from `scripts/make-samples.mjs`; their titles start with "Sample:".
- Logo: `src/assets/img/logo.svg` (traced from the cleaned PNG with `scripts/trace-logo.py`, 12 KB, crisp at any size), `logo-white.svg` (olive backgrounds) and `logo-reverse.svg` (dark footer). `logo-clean.png` stays only for the favicon and the social preview image.
- `.github/workflows/deploy.yml` is the GitHub Pages workflow. When there's no custom domain yet, it builds with `BASE_PATH=/<repo>`.

## Design system (the redesign; don't drift)

Built with the `frontend-design` and `design-taste-frontend` skills. The dealt direction was tasteskill's `type-only-statement` (seed 1632684356, palette and type kept from the brand): a page that opens on one big statement in the brand's own colour, with the subject's world drawn into the sections. Redraws recorded: the features section to `features-capabilities-at-poster-scale` (the service list), the showcase adapted to the existing drag slider, the work section kept as cards (the dealt "book-spine index" needs 20 to 40 project names and there are 3).

- **Scheme:** light pages. The olive field (`--field #6B7C2A`) is the opening of every page (full screen on the homepage, a short band on inner pages) and nothing else; charcoal is the footer and the builder call-out; the Estimate band at the foot of the homepage is pale (`#DCE4B9`) with the word in charcoal and turns olive only on hover. Jeremy's note after seeing the first pass: he likes the green but it must not overpower everything, so keep olive to the openings, buttons and accents. White on the field measures 4.6:1.
- **Colours:** field `#6B7C2A`, olive `#72852E`, olive-deep `#5E6E24` (buttons), olive-light `#A3B654` (on dark), pale `#DCE4B9`, tint `#EEF1E2`, warm `#F3F2EE`, stone `#E4E1D8`, charcoal `#232B2E`, ink-soft `#4A5256`. Earth tones in the drawings: topsoil `#8C7B5E`, base stone `#B8AF94`, crusher run `#CFC8AF`, red-clay subsoil `#A8765B`.
- **Type, five sizes only:** `--t-statement` clamp(60px, 17.5vw, 250px) for the homepage statement (phone: clamp(56px, 18.5vw, 120px)); `--t-h2` clamp(36px, 5.2vw, 84px); `--t-h3` clamp(26px, 2.2vw, 32px); `--t-body` 19px (18 on phones); `--t-small` 17px (16). Barlow Condensed 700/800 uppercase for headings and buttons, Source Sans 3 for everything else. Self-hosted in `src/assets/fonts/`. Headlines fit in two lines at every width.
- **Homepage:** full-screen olive field with the statement "Groundwork / Done Right." (white, then charcoal), the service line and estimate button at its foot; the hero photo strip appears under it once `home-hero.jpg` exists; intro lead with four run-in columns; "The work we do" as a poster-scale list of eight linked services; drawn before/after slider; recent projects; "What happens next" with the slip; the giant word ESTIMATE on a pale band as the closing link.
- **Header:** fixed; takes the colour of the chapter under it (`data-chapter="olive"` on heroes and the Estimate band, `"dark"` on the footer), white logo on olive, full-colour logo on white; hides on scroll-down and comes back on scroll-up. Nav: Homeowners, Builders & Contractors, Projects, More (Miscellaneous Services, Home Construction), quiet Facebook and Instagram marks, phone, Get an estimate. Phones: Call + menu button; the menu is a full-screen white sheet with large charcoal links (Get an estimate in olive) and call/social at the foot; sticky bottom bar with Call and Get an estimate (plus Text when `phoneTakesTexts`). Because that bar is always on screen, the page openings on phones carry no buttons of their own (only the builders page keeps "Send the address and plans"), the homepage field is two-thirds of the screen so the intro shows beneath it, and the footer's "Back to top" is hidden.
- **Footer:** charcoal. Reverse logo, description, based-in/serving, licensed line, hours; a large Call block with the phone number; the dozer strip; links, socials, legal. Landing pages use a shorter header and footer (logo, phone, call block, dozer, legal).
- **Inner pages:** a short olive opening (h1 in two lines or fewer, the intro at the third size up to 50 characters a line, the buttons), then the sticky jump bar where a page has sections. Each service section puts its heading across the full width, then the bullets on one side and the drawn or real before/after on the other; on phones the order is heading, picture, text.
- **Buttons:** square, flat, no shadows, no gradients; one label everywhere, "Get an estimate". `.btn-primary` olive-deep, `.btn-light` white on olive, `.btn-ink` charcoal.
- **No** carousels, counters, icon-card grids, tiny letter-spaced labels, numbered steps unless the content is a sequence, gray photo boxes or yellow placeholders meant for launch.
- **Before/after:** drag slider (`[data-ba]`, range input, keyboard accessible) over real photo pairs or the drawn pairs.

## Motion (one planned moment per page, `prefers-reduced-motion` shows the finished state)

1. **Homepage load:** the statement's two lines, the service line and the buttons settle into place once (`settle` keyframes). This is the "classy landing page load-in" Jeremy asked for.
2. **Homeowners `#pads`:** the drawn pad cross-section builds up as it scrolls into view: cut and fill, base stone, crusher run, then the building. IntersectionObserver starts it once; static final state without JS.
3. **Footer:** a small dozer (`src/partials/dozer.html`) rolls in once along the footer strip when the footer comes into view, in the spirit of the boat on Jeremy's FOTCL site. It was moved here from the homepage hero at Jeremy's request.
4. Removed: the excavator bucket-dump on the thank-you. The thank-you is now typographic ("Thank you. / Your request is in.").

## Second pass (2026-10-28, after the first screenshots)

Inspector run on every inner page, then fixed: section headings that wrapped to three lines, the "Before" tag reading as a label above headings on phones, the jump bar and project filters clipping at the phone edge (short jump labels under 600px, filters wrap), the estimate page headline back to Joey's "Request a Project Estimate" with a call link in the opening, focus rings in olive-deep on light grounds, lone project photos shown at two-thirds width, the "what happens next" slip as a valid definition list (accessibility 100). Remaining inspector items are accepted on purpose: no photographs or footage yet (content), little motion (one moment per page), the phone call bar covering a heading at some scroll positions, the intro paragraphs at four lines (Joey's copy as written), one empty rest in the inner openings.

## Third pass (2026-10-28, fresh eyes on the phone)

Looked at header, hero, footer and logo at 390px as a first-time visitor from an ad. Fixed: the opening repeated Call and Get an estimate right above the sticky bar that already has them (hidden on phones, except the builders ask); the homepage field was a full screen of olive with two lines of type (now two-thirds, with the intro peeking); the orphaned "Back to top" link in the phone footer (hidden). Stopped here on purpose so Jeremy's reactions drive the next pass instead of guesses.

## Self-audit (2026-10-28, scored before Jeremy's review)

Scored the way `docs/ROADMAP.md` Phase 5 asks, out of 100: design 22/25 (no real hero photo yet), phone layout 14/15 (the call bar can cover large text at some scroll positions; accepted), copy 12/15 (Joey's words throughout, one button label, no AI tells; no trust strip because nothing true exists to put in it yet), speed 15/15, trust 6/15 (phone, email, licensed line, reviews and real photos all still missing), motion 9/10, accessibility 5/5. **83/100.** The gap is content, not design: real photos and the business details would carry it past 90.

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

[PHONE], [EMAIL], [LICENSED AND INSURED LINE] (hours are optional and hidden while blank; base location and service area were set 2026-10-28: Chattanooga, TN / Chattanooga and the surrounding counties), Facebook / Instagram / Google Business Profile URLs, [DOMAIN], [1 BUSINESS DAY], [OWNER TO SUPPLY] Home Construction intro, Basin form endpoint, tracking IDs, real jobsite photos (arriving this week). The logo SVG is done.
