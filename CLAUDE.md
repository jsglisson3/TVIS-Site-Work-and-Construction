# TVIS Site Work and Construction website

Marketing site for an excavation and sitework company in Chattanooga, TN. Its one job is to turn visitors (mostly phone users from Facebook and Instagram ads) into estimate requests, by call or by form with photos.

**Before doing anything, read `docs/HANDOFF.md`.** It has the full brief, the approved design system, the decisions already made, and the ordered list of what's left. The approved mockups are in `docs/design/`, and the research is in `docs/research/`.

## Commands

- `npm install`: run once.
- `npm run dev`: build into `dist/` and preview at http://localhost:8080.
- `npm run build`: build only.

## Rules

- Use the brief's copy as written. Never invent reviews, testimonials, license numbers, years in business, project counts, awards, prices, response times or service towns. Missing details stay as visible `[PLACEHOLDERS]` driven by `site.config.json`.
- Never use photos from other companies. Use placeholder blocks labeled with the shot (`{{photo slot=... label=...}}`) until real photos land in `photos/site/` or `projects/`.
- Stay inside the approved design system:
  - light scheme
  - colors and type listed in HANDOFF.md
  - square flat buttons, no shadows at rest, no gradients beyond the photo scrim
  - no carousels or counters
- Motion is limited to one planned machine moment per page, and it must respect `prefers-reduced-motion`.
- Every page must work at 390px and 1440px with no sideways scroll.
- Lighthouse mobile must score 90+ on every page. Check pages in a real browser and fix what you see before calling anything done.
- Keep the `projects/` folder format and `project.txt` fields stable. A future automation depends on them.
- Shared pieces live in `src/partials/`, page files in `src/pages/`, and business details only in `site.config.json`. Don't hard-code the phone number or email anywhere.
- Jeremy commits and syncs from VS Code. Keep the folder tidy and update README.md when the structure changes.
- `setup/deploy.yml` belongs in `.github/workflows/deploy.yml`. Move it there as the first step.
