# Launch checklist

What is done and what the site is still waiting on. Business details go in `site.config.json`, photos in `photos/site/` or a project folder, then commit and sync; every sync redeploys. With `launchMode: true` a blank optional detail is simply left out, so nothing yellow shows on the public site. `docs/ROADMAP.md` puts the bigger items in phases.

Last updated 2026-11-02 (pre-launch review; full report linked in `docs/HANDOFF.md`).

## Must do before telling people about the site

- [ ] **Joey confirms the ten project write-ups.** Every `projects/*/project.txt` description starts with `[CONFIRM]`: they were written from the photos, not from Joey. The prefix is hidden on the live site, so the words already show as fact. Have Joey read each one (title, town, description, month) and fix anything wrong, then delete `[CONFIRM] `. Towns marked from photo GPS (Harrison, East Ridge, Sequatchie County, East Brainerd) need the same check.
- [ ] **More Services opening card** says "Clearing a wooded lot, East Ridge, TN, June 2026". That job is not a project yet; the town and month come from the photo's GPS and date. Confirm it with Joey, or say so and it gets changed.
- [ ] **Search Console:** the verification tag is in. Submit `https://tvisconstruction.com/sitemap.xml` (Indexing > Sitemaps), then use URL Inspection > Request indexing on the home page.
- [ ] **GitHub Pages > Enforce HTTPS** ticked (Settings > Pages). Not readable from here.
- [ ] **www address:** open `http://www.tvisconstruction.com` and `https://www.tvisconstruction.com` on a phone; both should land on `https://tvisconstruction.com/`. Not testable from here.
- [ ] **One real estimate request** from a phone with three photos; check it reaches info@tvisconstruction.com with the photos attached (Basin dashboard too).
- [ ] **Phone run-through:** tap every Call button, the header Get an Estimate, the phone menu, and the Facebook mark on an iPhone (Safari) and an Android (Chrome). Safari and Firefox could not be tested here.

## Accounts and settings (outside the code)

- [x] **Google Business Profile:** verified 2026-11-04. Maps link, review link, address and map pin are in site.config.json; the Google marks now link to the profile.
- [ ] **DMARC:** the DNS record still has the placeholder `rua=mailto:you@tvisconstruction.com`. Change it to `v=DMARC1; p=none` (or a real address you read).
- [ ] **Basin:** add `tvisconstruction.com` under Allowed Domains (free). The free plan is 50 requests a month, 100 MB, 30-day history: move up a plan before running ads.
- [ ] **Google Workspace billing** set up before 2026-11-11, or info@ stops receiving estimate emails.
- [ ] **Tracking IDs** in `site.config.json > tracking` once the GA4, Google Ads and Meta accounts exist. The events are already wired: `generate_lead` on a sent estimate, `phone_call_click` on every Call link.
- [ ] **Deploy workflow:** GitHub warns that the Pages actions run on Node 20. It still deploys; bump the action versions when GitHub releases Node 24 versions.

## Business details (`site.config.json`)

- [x] `phone`: 423-225-7038 since 2026-11-04 (Jeremy: "use this number now"; it replaced the temporary 423-618-3112). Change it here only: it updates every page, every call button and the schema. Update the Google Business Profile and Facebook to the same number.
- [x] `email`: info@tvisconstruction.com
- [x] `facebook`, `baseLocation`, `serviceArea`, `serviceTowns`, `domain`, `formEndpoint`, `googleSiteVerification`
- [ ] `phoneTakesTexts`: `false` now. Set `true` if Joey takes texts (adds a Text button on phones)
- [ ] `licensedLine`: only the exact licensed and insured wording Joey can stand behind (hidden while blank)
- [ ] `responseTime`: e.g. `1 business day` (the thank-you says "We'll be in touch soon" until then)
- [ ] `hours`, `ownerFirstName`, `instagram`: optional, hidden while blank

## Content that only Joey can give

- [ ] Real Google reviews, word for word with the reviewer's first name: paste into the hidden reviews section of `src/pages/index.html` and remove `hidden`. Never write or paraphrase one.
- [ ] Two or three more sentences per service page in Joey's words (what he does differently, typical job size, what affects the price). The six service pages are short; more real detail is the next best thing for Google after the Business Profile.
- [ ] Home Construction page intro (2 to 3 sentences) in `src/pages/home-construction.html`; the page stays unlisted until then.
- [ ] Full-size originals of the two garage pad "After" photos (`projects/2025-10-garage-pad/after-1.jpg`, `after-2.jpg` are 696px Facebook copies, a little soft on phones).

## Quality bar (re-check after any change)

- [x] Pre-launch review 2026-11-02: 26 pages at ten widths (320 to 1920px), no sideways scroll, no console errors, no broken links or images
- [x] Lighthouse mobile over HTTP/2 (like GitHub Pages): performance 96 to 100 on every page; accessibility and best practices 100; SEO 100 on every page meant for Google
- [x] axe (WCAG 2.2 AA) 0 violations at 390 and 1440; text over photos measured pixel by pixel (all pass, lowest 4.91:1); keyboard: skip link, visible focus on every stop, focus never hidden under the header or the phone call bar, phone menu traps focus and closes on Escape
- [x] Estimate form: prefill, inline errors, focus stays where you type, photo upload, server error, works without JavaScript
- [ ] Jeremy approves every page on his phone
