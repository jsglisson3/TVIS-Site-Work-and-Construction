# TVIS Site Work and Construction website

Marketing site for TVIS Site Work and Construction, an excavation and sitework company in Chattanooga, TN. Plain HTML, CSS and a little JavaScript, built by a small Node script and published to GitHub Pages by a GitHub Action on every push to `main`.

Live at https://tvisconstruction.com/ once the DNS and the Pages custom domain are set (see below); until then at https://jsglisson3.github.io/TVIS-Site-Work-and-Construction/.

## Run it on your computer

Needs [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install      # once
npm run dev      # builds into dist/ and serves a preview at http://localhost:8080
```

Re-run `npm run dev` after changing anything. Press Ctrl+C to stop it.

## Publish

Push to `main` and the Action in `.github/workflows/deploy.yml` builds and publishes the site. One-time setup on GitHub (done): **Settings > Pages > Build and deployment > Source: GitHub Actions**. Each deploy shows up under the repo's **Actions** tab and takes about a minute.

**Custom domain:** put it in `site.config.json > domain` (for example `tvisconstruction.com`), push, then add it under Settings > Pages > Custom domain and point the domain's DNS at GitHub Pages. From that one setting the build drops the `/TVIS-Site-Work-and-Construction/` subpath, writes `CNAME`, the sitemap, `robots.txt`, canonical links and the og:url / og:image addresses Facebook needs.

## Fill in the business details

Everything that changes from business to business lives in `site.config.json`. Empty values show on the site as yellow `[PLACEHOLDERS]`, so nothing is faked while details are missing.

| Key | What it is |
| --- | --- |
| `phone` | Main number, e.g. `(423) 555-0100`. Every Call button uses it. |
| `phoneTakesTexts` | `true` adds a Text button next to Call on phones. |
| `ownerFirstName` | Optional. Shows "Call or text Joey" style lines. |
| `email` | Where the estimate emails go (also set in Basin, below). |
| `baseLocation` | e.g. `Chattanooga, TN`. |
| `serviceArea` | Towns and counties, one line. Shown under the homepage headline. |
| `hours` | Optional, e.g. `Mon–Fri 7am–5pm`. The hours line stays hidden while blank. |
| `licensedLine` | The exact licensed and insured wording the business can stand behind. |
| `responseTime` | e.g. `1 business day`. Shown on the thank-you message. |
| `facebook`, `instagram`, `googleBusinessProfile` | Full URLs. The small marks in the header and footer link to them. |
| `domain` | Custom domain, once there is one. |
| `formEndpoint` | The Basin form URL (below). |
| `tracking.*` | Google Analytics, Google Ads and Meta Pixel IDs. Leave blank until the accounts exist. |

## Photos

- **Fixed spots on the pages:** drop photos into `photos/site/`, named after the spot. `photos/site/README.txt` lists every spot and the shot it wants. A spot with no photo yet stays hidden (no gray box on the public site); where a picture is needed to explain the work, a drawn cross-section stands in until the photo lands. To see every empty spot and its file name, add `?slots` to any page address, e.g. `http://localhost:8080/homeowners?slots`. The build resizes photos and strips GPS data.
- **Projects gallery:** one folder per job in `projects/`. See `HOW-TO-ADD-A-PROJECT.md`. The three `Sample:` folders hold drawn pictures, not photos; delete them once real jobs exist.

Never use another company's photos.

## The estimate form (Basin)

The form at `/estimate` (and on ad landing pages) posts to [Basin](https://usebasin.com). The free plan includes file uploads. Setup:

1. Create a form in Basin and copy its endpoint URL (looks like `https://usebasin.com/f/abc123`).
2. Paste it into `site.config.json > formEndpoint` and push. Until then the form shows a yellow "not connected yet" notice.
3. In the Basin form settings: turn on file uploads; set the notification email; set the **redirect URL** to `https://<your site>/thanks` (used only by browsers without JavaScript); turn on the honeypot spam filter and make sure its field name is `_gotcha` (or rename the hidden field in `src/partials/estimate-form.html` to match).
4. Test from a phone with three photos. Check that the email arrives with the photos attached or linked, and that the thank-you shows.

What the form does: prefills the project type and customer type from the link that brought the visitor (`/estimate?type=drainage&who=builder`), shrinks photos to about 1600px before upload so phone photos send fast, allows PDF plans when Builder or Contractor is picked, blocks bots with a hidden field and a timing check (no puzzles), and sends the ad source (UTM tags, first page, referrer) as hidden fields so you know which ad produced each lead.

Project type codes for links: `driveway`, `pad`, `drainage`, `siteprep`, `utility`, `concrete`, `cleanup`, `home`, `other`. Customer codes: `homeowner`, `builder`, `other`.

## Tracking

Fill in `site.config.json > tracking` and the tags are added to every page. The site then fires `generate_lead` (Google) and `Lead` (Meta) when the form sends, and `phone_call_click` / `Contact` when a phone number is tapped. For Google Ads conversion tracking, add `googleAdsId` and `googleAdsLeadLabel`.

## Ad landing pages

`src/pages/lp-shed-garage-pads.html` is the template: logo and phone only, no menu, benefit bullets, a before/after, what happens next, and the form on the page. To make one for another campaign, copy the file, then change the front matter (`path`, `title`, `description`, `form_type`), the headline and bullets, and the photo slot names. Match the headline to the ad's wording. Landing pages are `noindex` and `/lp/` is blocked in `robots.txt`, so only people who click the ad see them. Link to them with UTM tags, e.g. `/lp/shed-garage-pads?utm_source=facebook&utm_campaign=pads-fall`.

## Where things live

| Path | What it is |
| --- | --- |
| `site.config.json` | Business details. The only place the phone number, email and so on are written. |
| `src/pages/` | One file per page. The block between the `---` lines sets the title, search description and options. |
| `src/partials/` | Pieces shared by pages: `layout`, `head`, `header` / `footer` (and the `-landing` versions for ad pages), the estimate form, `next-steps` (the "what happens next" slip), `dozer` (the footer machine), `icons`. |
| `src/assets/` | `site.css`, `site.js`, the fonts, and `img/` with the logo as SVG (`logo.svg` full colour for the white header, `logo-reverse.svg` for the dark footer) plus `logo-clean.png`, used only to make the favicon and the social preview image. |
| `scripts/build.mjs` | The build: assembles pages, resizes photos, writes `dist/`, `sitemap.xml`, `robots.txt`, the favicon and social preview image. It also strips the content-credential metadata that file transfers sometimes add to the SVG logos and inline drawings, so the published site stays small, and it adds a content hash to the `site.css` and `site.js` links (`?v=...`) so a browser never pairs new pages with an old stylesheet after a deploy. |
| `scripts/diagrams.mjs` | The drawn cross-sections (driveway, pad, drainage, cleanup, site prep, utilities, concrete, final grade, plus the dark `heroScene()` for the homepage hero) used wherever a photo is missing, and the `{{diagram}}` token behind the animated pad section. |
| `scripts/make-samples.mjs` | Renders those drawings into the three `Sample:` project folders. Not part of the build. |
| `scripts/trace-logo.py` | Rebuilds `logo.svg` and `logo-reverse.svg` from the original logo PNG as a clean vector (straight edges, sharp corners, identical window panes). Run it if the logo artwork ever changes; the usage is at the top of the file. |
| `scripts/serve.mjs` | The local preview server. |
| `photos/site/` | Photos for fixed spots on the pages. |
| `projects/` | One folder per job. Becomes the Projects gallery, each project's page and the homepage's Recent projects. |
| `.github/workflows/deploy.yml` | Publishes the site on every push to `main`. |
| `docs/` | `HANDOFF.md` (the full brief, the design system and every decision), `ROADMAP.md` (the phases to launch and after), the early mockups in `design/`, and the research. |

`dist/` and `node_modules/` are generated; don't edit or commit them.

## Checks before launch

`LAUNCH-CHECKLIST.md` has the full list. The short version:

- Every page at phone width (390px) and desktop (1440px), no sideways scroll.
- Lighthouse mobile 90+ on every page (last run 2026-10-28 after the rebuild: 97 to 100 on every page).
- Send a test estimate with photos from a phone.
- Tap every phone number and button on a phone.
- Replace the three "Sample:" project folders with real jobs.
