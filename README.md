# TVIS Site Work and Construction website

Marketing site for TVIS Site Work and Construction, an excavation and sitework company in Chattanooga, TN. Plain HTML, CSS and a little JavaScript, built by a small Node script and published to GitHub Pages by a GitHub Action on every push to `main`.

Live at https://jsglisson3.github.io/TVIS-Sitework-and-Construction/ until a custom domain is set (see below).

## Run it on your computer

Needs [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install      # once
npm run dev      # builds into dist/ and serves a preview at http://localhost:8080
```

Re-run `npm run dev` after changing anything. Press Ctrl+C to stop it.

## Publish

Push to `main` and the Action in `.github/workflows/deploy.yml` builds and publishes the site. One-time setup on GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**. The first deploy shows up under the repo's **Actions** tab and takes about a minute.

**Custom domain later:** put it in `site.config.json > domain` (for example `tvissitework.com`), push, then add it under Settings > Pages > Custom domain and point the domain's DNS at GitHub Pages. The build writes `CNAME`, the sitemap and canonical links from that one setting.

## Fill in the business details

Everything that changes from business to business lives in `site.config.json`. Empty values show on the site as yellow `[PLACEHOLDERS]`, so nothing is faked while details are missing.

| Key | What it is |
| --- | --- |
| `phone` | Main number, e.g. `(423) 555-0100`. Every Call button uses it. |
| `phoneTakesTexts` | `true` adds a Text button next to Call on phones. |
| `ownerFirstName` | Optional. Shows "Call or text Joey" style lines. |
| `email` | Where the estimate emails go (also set in Basin, below). |
| `baseLocation` | e.g. `Ooltewah, TN`. |
| `serviceArea` | Towns and counties, one line. |
| `hours` | Optional, e.g. `Mon–Fri 7am–5pm`. The hours line stays hidden while blank. |
| `licensedLine` | The exact licensed and insured wording the business can stand behind. |
| `responseTime` | e.g. `1 business day`. Shown on the thank-you message. |
| `facebook`, `instagram`, `googleBusinessProfile` | Full URLs. |
| `domain` | Custom domain, once there is one. |
| `formEndpoint` | The Basin form URL (below). |
| `tracking.*` | Google Analytics, Google Ads and Meta Pixel IDs. Leave blank until the accounts exist. |

## Photos

- **Fixed spots on the pages:** drop photos into `photos/site/`, named after the spot. Each gray placeholder says the file name it wants, and `photos/site/README.txt` lists them all. The build resizes photos and strips GPS data.
- **Projects gallery:** one folder per job in `projects/`. See `HOW-TO-ADD-A-PROJECT.md`.

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

`src/pages/lp-shed-garage-pads.html` is the template: logo and phone only, no menu, benefit bullets, a before/after, three steps and the form on the page. To make one for another campaign, copy the file, then change the front matter (`path`, `title`, `description`, `form_type`), the headline and bullets, and the photo slot names. Landing pages are `noindex` and `/lp/` is blocked in `robots.txt`, so only people who click the ad see them. Link to them with UTM tags, e.g. `/lp/shed-garage-pads?utm_source=facebook&utm_campaign=pads-fall`.

## Where things live

| Path | What it is |
| --- | --- |
| `site.config.json` | Business details. The only place the phone number, email and so on are written. |
| `src/pages/` | One file per page. The block between the `---` lines sets the title, search description and options. |
| `src/partials/` | Pieces shared by pages: header, footer, `<head>`, the estimate form, the dozer, excavator and shed pad drawings. |
| `src/assets/` | `site.css`, `site.js`, fonts and logos. |
| `photos/site/` | Photos for fixed spots on the pages. |
| `projects/` | One folder per job. Becomes the Projects gallery, each project's page and the homepage's Recent projects. |
| `scripts/build.mjs` | The build: assembles pages, resizes photos, writes `dist/`, `sitemap.xml`, `robots.txt`, the favicon and social preview image. |
| `scripts/serve.mjs` | The local preview server. |
| `.github/workflows/deploy.yml` | Publishes the site on every push to `main`. |
| `docs/` | The approved design mockups, the research, and `HANDOFF.md` with the full brief and decisions. |

`dist/` and `node_modules/` are generated; don't edit or commit them.

## Checks before launch

- Every page at phone width (390px) and desktop (1440px), no sideways scroll.
- Lighthouse mobile 90+ on every page (last run: 98 to 100 on all).
- Send a test estimate with photos from a phone.
- Tap every phone number and button on a phone.
- Replace the three "Sample:" project folders with real jobs.
