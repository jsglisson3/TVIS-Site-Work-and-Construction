# Launch checklist

Everything the site is still waiting on. Each item is a yellow `[PLACEHOLDER]`, a hidden photo spot or a drawn stand-in until it's filled in. Put the details in `site.config.json`, photos in `photos/site/`, then commit and sync. `docs/ROADMAP.md` puts these in phases.

## Business details (`site.config.json`)

- [ ] `phone`: the number every Call button dials (the site cannot launch without it)
- [ ] `phoneTakesTexts`: `true` if that number takes texts (adds a Text button on phones)
- [ ] `ownerFirstName`: optional, for "Call or text Joey"
- [ ] `email`: where estimate requests go
- [ ] `licensedLine`: the exact licensed and insured wording Joey can stand behind
- [ ] `responseTime`: e.g. `1 business day` (shown on the thank-you)
- [ ] `hours`: optional; stays hidden while blank
- [ ] `facebook`, `instagram`, `googleBusinessProfile`: full URLs (the small marks in the header and footer link to them)
- [x] `baseLocation`: Chattanooga, TN
- [x] `serviceArea`: Chattanooga and the surrounding counties

## Estimate form

- [ ] Basin account under the business email; create a form; paste its URL into `formEndpoint`
- [ ] In Basin: file uploads on, notification email set, redirect URL `https://<site>/thanks`, honeypot field `_gotcha`
- [ ] Send a test request from a phone with three photos and check the email

## Photos

- [ ] Fixed spots: the 30 files listed in `photos/site/README.txt`. `home-hero.jpg` first, then the before/after pairs; the drawings stay in until each pair exists
- [ ] Projects: replace the three `Sample:` folders in `projects/` with real jobs (see `HOW-TO-ADD-A-PROJECT.md`)

## Copy

- [ ] Home Construction page intro (2 to 3 sentences from Joey) in `src/pages/home-construction.html`
- [ ] Ad landing page headline, if the ad wording differs from "Shed & Garage Pad Preparation" (`src/pages/lp-shed-garage-pads.html`)
- [ ] Real Google reviews, if Joey has them: paste into the hidden reviews section on `src/pages/index.html` and remove `hidden`

## Online

- [x] GitHub: Settings > Pages > Source: **GitHub Actions** (done 2026-10-28), so every sync publishes
- [ ] Domain, when bought: `site.config.json > domain`, then Settings > Pages > Custom domain, then DNS
- [ ] Tracking IDs in `site.config.json > tracking` once the Google and Meta accounts exist
- [ ] Final run-through on a phone: tap every button and phone number, send one real-looking estimate

## Quality bar (re-check after the content lands)

- [x] Redesign built with the frontend-design and design-taste-frontend skills, screenshots reviewed at 390px and 1440px (2026-10-28)
- [x] Lighthouse mobile 90+ on every page (last run 2026-10-28: 96 to 100)
- [x] Self-scored pass out of 100: 83 on 2026-10-28 (see `docs/HANDOFF.md`); re-score once photos and details are in, aim for 90+
- [ ] Jeremy approves every page on his phone
