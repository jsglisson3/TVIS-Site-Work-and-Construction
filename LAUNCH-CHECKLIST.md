# Launch checklist

Everything the site is still waiting on. Each item is a yellow `[PLACEHOLDER]` or a gray photo box until it's filled in. Put the details in `site.config.json`, photos in `photos/site/`, then commit and sync.

## Business details (`site.config.json`)

- [ ] `phone`: the number every Call button dials
- [ ] `phoneTakesTexts`: `true` if that number takes texts (adds a Text button on phones)
- [ ] `ownerFirstName`: optional, for "Call or text Joey"
- [ ] `email`: where estimate requests go
- [ ] `licensedLine`: the exact licensed and insured wording Joey can stand behind
- [ ] `responseTime`: e.g. `1 business day` (shown on the thank-you)
- [ ] `hours`: optional; stays hidden while blank
- [ ] `facebook`, `instagram`, `googleBusinessProfile`: full URLs (the icons link to them)
- [x] `baseLocation`: Chattanooga, TN
- [x] `serviceArea`: Chattanooga and the surrounding counties

## Estimate form

- [ ] Basin account under the business email; create a form; paste its URL into `formEndpoint`
- [ ] In Basin: file uploads on, notification email set, redirect URL `https://<site>/thanks`, honeypot field `_gotcha`
- [ ] Send a test request from a phone with three photos and check the email

## Photos

- [ ] Fixed spots: every file listed in `photos/site/README.txt` (32 photos; the hero shots matter most)
- [ ] Projects: replace the three `Sample:` folders in `projects/` with real jobs (see `HOW-TO-ADD-A-PROJECT.md`)

## Copy

- [ ] Home Construction page intro (2 to 3 sentences from Joey) in `src/pages/home-construction.html`
- [ ] Ad landing page headline, if the ad wording differs from "Shed & Garage Pad Preparation" (`src/pages/lp-shed-garage-pads.html`)

## Online

- [ ] GitHub: Settings > Pages > Source: **GitHub Actions** (once), then every sync publishes
- [ ] Domain, when bought: `site.config.json > domain`, then Settings > Pages > Custom domain, then DNS
- [ ] Tracking IDs in `site.config.json > tracking` once the Google and Meta accounts exist
- [ ] Final run-through on a phone: tap every button and phone number, send one real-looking estimate
