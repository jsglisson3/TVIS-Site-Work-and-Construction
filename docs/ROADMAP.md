# TVIS website roadmap

Where the site is going, in order. Not a schedule. Each phase is done when its "done when" line is true, however long that takes. Read this with `docs/HANDOFF.md` (the brief and every decision) and the pro playbook (https://claude.ai/artifact/ATGxeZASGNvuWCpZX2wELV).

Last updated 2026-10-28.

## The end state

A site Jeremy would be proud to show anyone, and that does one job: turn people who see a TVIS ad on their phone into a phone call or an estimate request with photos.

- Looks premium and specific to TVIS: real jobsite photos, strong type, a sharp logo, motion only where it means something.
- Every page passes the five-second test on a phone: what TVIS does, that it's in Chattanooga, and how to get an estimate.
- The phone number and the estimate form work everywhere, and every request reaches Joey with its photos.
- Found on Google for Chattanooga driveway, pad, drainage and site-prep searches, on its own domain.
- Easy to keep fresh: add a project folder, sync, and it appears. Later, new projects post themselves to Facebook, Instagram and Google.

## The quality bar (every phase, every page)

- Jeremy signs off on each page at phone and desktop width before it counts as done.
- Built with the frontend-design and design-taste-frontend skills; Claude screenshots its own work and fixes what it sees before showing it.
- Lighthouse mobile 90+ in every category on every page. No sideways scroll at 390px. Works with reduced motion.
- Joey's wording is the source of truth. Never invent reviews, prices, license numbers, years or project counts. No stock or borrowed photos.
- No yellow placeholders or gray photo boxes on the public site at launch.

## Phase 1: Redesign (in progress)

Rebuild the look to a premium standard, in this order: header, footer, logo (traced to SVG), hero, homepage, then every other page.

- From Jeremy: review screenshots, approve the homepage before it rolls out to the other pages, commit and sync.
- Done when: every page uses the new look and Jeremy has approved it on his phone.

## Phase 2: Real content

Replace every placeholder with the real thing.

- From Joey (via Jeremy): phone number (and whether it takes texts), email for estimate requests, first name to show, the exact licensed and insured wording, whether estimates are free, typical response time, Home Construction intro (2 to 3 sentences). Nice to have: 3 short customer quotes, "starting at" prices.
- Photos: a wide hero shot first, then before-and-after pairs of a driveway, a pad and a drain, then the rest of the shot list in `photos/site/README.txt`. Real jobs replace the three "Sample:" projects.
- Claude: picks and crops the best shots, writes alt text, tightens copy into outcome-led sections for Joey to approve, adds a trust strip, uses one button label everywhere. If photos are short, layouts adapt to what exists instead of showing gray boxes.
- Done when: no placeholders remain and Joey has read and approved the words.

## Phase 3: Estimate form and tracking

- From Jeremy: a free Basin account under the business email (Claude walks through it), then the form's address. Later, Google Analytics and Meta Pixel IDs once those accounts exist.
- Claude: connects the form, sets up the thank-you page, turns on call and lead tracking.
- Done when: a test request sent from a phone with three photos arrives in Joey's inbox with the photos, a builder request with a PDF arrives too, and a mistake on the form keeps what was typed.

## Phase 4: Domain and local search

- From Jeremy and Joey: buy the domain; claim the Google Business Profile (verification can take days); the Facebook and Instagram page links.
- Claude: points the domain at the site with HTTPS, updates the form's return address, checks the business details match exactly on the site, Google and Facebook, submits the sitemap to Google Search Console, and checks the link preview when pasted into Facebook.
- Done when: the site loads on its own domain with the padlock and Google has the sitemap.

## Phase 5: Launch

- Final scoring pass: Claude scores copy, speed, phone layout, trust, motion and design out of 100 and fixes until 80+.
- Jeremy and Joey each tap every button and phone number on a real phone and send one real-looking estimate.
- The shed and garage pad ad page matches the ad's wording word for word.
- Done when: every line of the quality bar is true and the first ad can point at the site.

## After launch

- Keep adding real projects (`HOW-TO-ADD-A-PROJECT.md`); ask happy customers for Google reviews.
- More ad landing pages, copied from the shed and garage pad one, one per campaign.
- Auto-posting: new project folders post their before-and-afters to Facebook, Instagram and Google Business Profile. Keep the project folder format stable for this.
- "Visualize your project": an ad page where a homeowner uploads a photo, an AI tool sketches the finished job, and it comes in as an estimate request.

## Things that can slow this down

- Claude usage limits: the weekly limit resets Sundays at 8 AM. Finish each phase's most important piece first so a cutoff never leaves things half done, and keep `docs/HANDOFF.md` current.
- Jeremy's PC is off: Claude works in the project files and copies to his folder when it's back on. Jeremy commits and syncs from VS Code himself; each sync redeploys.
- Missing phone number or email: the site cannot launch without them.
- Photos late or few: launch with the best handful and adapt the layouts; never fill with stock.
