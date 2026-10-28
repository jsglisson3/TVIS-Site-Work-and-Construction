# TVIS Site Work and Construction website

Marketing site for an excavation and sitework company in Chattanooga, TN. Its one job is to turn visitors (mostly phone users from Facebook and Instagram ads) into estimate requests, by call or by form with photos.

**Before doing anything, read `docs/HANDOFF.md`.** It has the full brief, the design system as built, the decisions already made, and what's left. `docs/ROADMAP.md` has the phases to launch. The early mockups in `docs/design/` are superseded by the build; the research is in `docs/research/`.

## Commands

- `npm install`: run once.
- `npm run dev`: build into `dist/` and preview at http://localhost:8080.
- `npm run build`: build only.
- `node scripts/make-samples.mjs`: re-render the drawn pictures in the three `Sample:` project folders (only after changing `scripts/diagrams.mjs`).

## Rules

- Use the brief's copy as written. Never invent reviews, testimonials, license numbers, years in business, project counts, awards, prices, response times or service towns. Missing details stay as visible `[PLACEHOLDERS]` driven by `site.config.json`.
- Never use photos from other companies. A photo spot with no photo stays hidden or shows a drawn cross-section from `scripts/diagrams.mjs`; never a gray box, and never a drawing presented as a photo. Add `?slots` to a page URL to see the empty spots.
- Stay inside the design system in HANDOFF.md:
  - light pages; the olive field only for page openings (full screen on the homepage, a short band inside); charcoal only for text, the footer and the builder call-out; Jeremy likes the green but it must not overpower everything
  - the colours and the five type sizes listed there, headlines in two lines or fewer at every width
  - square flat buttons, one label everywhere ("Get an estimate"), no shadows at rest, no gradients beyond the photo scrim
  - no carousels, counters, icon-card grids or tiny letter-spaced labels
- Motion is limited to one planned moment per page (homepage load-in, the pad build-up on `/homeowners`, the footer dozer), and it must respect `prefers-reduced-motion`.
- Every page must work at 390px and 1440px with no sideways scroll.
- Lighthouse mobile must score 90+ on every page. Check pages in a real browser, look at the screenshots, and fix what you see before calling anything done.
- Keep the `projects/` folder format and `project.txt` fields stable. A future automation depends on them.
- Shared pieces live in `src/partials/`, page files in `src/pages/`, and business details only in `site.config.json`. Don't hard-code the phone number or email anywhere.
- Jeremy commits and pushes himself from VS Code to github.com/jsglisson3/TVIS-Site-Work-and-Construction. Never run git push or set up anything that pushes for him. Keep the folder tidy and update README.md when the structure changes.
