# TVIS Construction: style guide

**Locked 2026-11-02.** This is the look Jeremy approved on the live site (tvisconstruction.com, deploy "Estimate page polish", 2026-10-29). Build every new page and section from what is here. Don't restyle the existing pages. If something new needs a pattern that isn't listed, reuse the closest one and add it here.

Source of truth for the values is `src/assets/site.css` (tokens at the top under `:root`). This file explains how they are used.

---

## 1. The feel in one paragraph

Rugged, practical, trustworthy. A white header and a dark, photo-led opening, then calm light sections with real jobsite photos doing the talking. Charcoal anchors the bottom of the page. Olive is the brand accent, used sparingly: buttons, short bars under headings, bullets, the top stripe and active states. Headings are tall, condensed and uppercase, like stencil lettering on equipment. Corners are square everywhere. Nothing bounces or slides around. The page feels like a well-run crew: clean, direct, no gimmicks.

## 2. Colour

| Token | Hex | Use |
|---|---|---|
| `--ink` / `--charcoal` | #232B2E | All body text, headings, the footer, dark bands, step numbers |
| `--charcoal-2` | #2E373B | Second dark tone on charcoal |
| `--ink-soft` | #4A5256 | Secondary text only (notes, captions, "optional") |
| `--olive` | #72852E | Accent bars, underlines, top stripe, card top borders |
| `--olive-deep` | #5E6E24 | Buttons and olive text on white (5.6:1) |
| `--olive-deeper` | #4F5D1E | Button hover |
| `--olive-light` | #A3B654 | Olive on charcoal (footer headings, icons on dark) |
| `--pale` | #DCE4B9 | Hover fill on light olive surfaces, step connector line |
| `--tint` | #EEF1E2 | Light olive section background, photo placeholders, upload box |
| `--warm` | #F3F2EE | Warm-gray section background (page openings, estimate band) |
| `--stone` | #E4E1D8 | Hairlines and card borders |
| `--paper` | #FFFFFF | Page background, cards |

Rules:
- The scheme is light. Charcoal shows up only in the hero, the statement band, the footer and small dark accents.
- Keep olive as an accent. Don't make full olive screens or stack olive sections (Jeremy: "don't make it overpower everything").
- Facebook uses its own brand blue (#1877F2) in the round "f" mark. That's the only outside colour.
- Gradients are only for the dark scrim that keeps text readable over a photo.

## 3. Type

- **Headings, buttons, labels, nav:** Barlow Condensed 700 (800 for the big phone number), UPPERCASE. Self-hosted in `src/assets/fonts/`.
- **Everything else:** Source Sans 3, 400 body, 600 to 700 for emphasis.

| Role | Size | Notes |
|---|---|---|
| H1 | clamp(44px, 6.8vw, 104px), line-height .96 | One per page. Followed by the olive bar. |
| H2 | clamp(31px, 3.8vw, 52px) | Section titles |
| H3 | clamp(22px, 1.8vw, 26px) | Card titles |
| Statement | clamp(64px, 12vw, 170px) | Only the home statement band |
| Body | 17px / 1.5 | Max line length 68ch |
| Small | 16px | Notes, lists in cards, footer |
| Labels | Barlow 700 uppercase, letter-spacing .04 to .08em | Form labels, tags, "Call us" |

Headings use `text-wrap: balance`. Never accent one word in a heading with a different colour or italic.

## 4. Layout and spacing

- Content width 1320px max (`--max`), side gutter clamp(20px, 4vw, 56px) (`--gut`).
- Section padding clamp(64px, 7vw, 104px) top and bottom (`--sec`).
- Header height 108px desktop, 72px on phones.
- Breakpoints: 1180px (nav collapses to the menu button), 900px (everything stacks to one column), 560px (small phones).
- Every page must work at 390px and 1440px with no sideways scroll.
- Content is left-aligned. Centre text only inside buttons.

## 5. Shape, borders and shadows

- **Square corners on everything.** No border-radius, except the round Facebook mark.
- Hairlines: 1px `--stone`. Card accent: 4px `--olive` top border (8px on the big CTA card).
- **Shadows are allowed, but only in these places.** Jeremy asked for them on 2026-10-29. The standard soft shadow is:
  `0 1px 3px rgba(35,43,46,.08), 0 18px 40px -20px rgba(35,43,46,.35)`
  Use it on: the sticky header, the estimate form card, the Talk to TVIS card, the How it works card. Primary buttons in the header and the form send button get a small olive shadow and lift 1px on hover. Don't put shadows on photos, plain sections or text.

## 6. Components (reuse these, don't invent new ones)

- **Header:** white, 4px olive stripe on top, hairline and soft shadow under it. The full-colour logo is 92px tall on desktop and 56px on phones. Nav is Barlow uppercase 17px with an olive underline that draws in on hover and marks the current page. Then a divider, the Facebook mark, the phone with a small "Call us" label, and the olive "Get an Estimate" button. On phones it shows the logo, "Call" and "Menu".
- **Home hero:** full-bleed jobsite photo, left-to-right dark scrim, white H1 with an olive bar, a subhead, a serving line, then "Request an Estimate" (olive) and "Call us" (white outline). On phones the photo sits on top with the text on charcoal below.
- **Page opening (`.phero`):** warm-gray band with H1, olive bar, one intro line, and optionally a photo that bleeds to the screen edge.
- **Buttons:** `.btn-primary` (olive), `.btn-light` (white on dark), `.btn-outline` (white outline on dark), `.btn-ink` (charcoal). 54px tall minimum, square, Barlow uppercase. Text says exactly what happens ("Get an Estimate", "Send estimate request").
- **Text links:** `.textlink` (olive, uppercase, 3px underline, arrow nudges on hover). Call links: `.call-link` with a phone icon, reading "Call us" or "Or call us".
- **Who cards (Homeowner / Builder):** photo, olive rule, title, short line, olive arrow square.
- **Service cards:** 4:3 photo, title, one line, "See … " link. Shown 3 across on desktop.
- **Before/after slider (`.ba`):** 4:3, white drag handle, "Before" tag in charcoal and "After" in olive. Thumb-scrolls freely on phones.
- **Project card:** slider, title, "Completed" chip and category, one-line description, "See all photos".
- **Statement band:** charcoal with a darkened photo behind, big heading left, paragraph right.
- **Service area + CTA card:** towns list on the left, white CTA card with an 8px olive top border on the right.
- **How it works card:** four numbered charcoal squares joined by a pale-olive line, with the last step in olive. A charcoal result bar with a check mark sits at the bottom.
- **Form:** white card on the warm band. Inputs 58px tall, 1.5px gray border that darkens on hover, olive glow on focus. "I'm a…" is a three-way segmented control (charcoal when chosen). "Add photos" is a tinted box with an olive camera square.
- **Footer:** charcoal, 8px olive ground line with the small dozer, white logo, then Contact, Services, Pages and Service area columns. Copyright says "TVIS Construction. From the Ground Up."
- **Phone call bar:** fixed at the bottom on phones ("Call" and "Get an Estimate"). On the home page it appears once the hero buttons scroll away.

## 7. Photos

- Only Joey's real jobsite photos. Never stock or other companies' photos.
- Crops: 4:3 for cards and sliders, 16:10 for the who cards, full-bleed with a scrim for the hero and the statement band.
- Pick bright, level, in-focus shots that show finished work or equipment working. Before/after pairs should be taken from about the same spot.
- Photos live in `photos/site/` (named by slot, e.g. `home-svc-concrete.jpg`) and `projects/<date-slug>/` (before-*, progress-*, after-*). The build resizes them. Record picks in `photos/site/PICKS.txt`.
- No filters or colour grading. The only treatment is the dark scrim for text.
- **Section photos are panels, not pictures in boxes.** On desktop a section photo (`.sv-media`, `.pads-pic`, `.lp-two .sv-media`) runs the full height of its section and bleeds to the near screen edge (`--bleed`), with the heading in the text column beside it. On phones it runs edge to edge above the text. Don't put a section photo inside the content column with padding around it; that is the "bolted on" look.
- **Project galleries lead with one photo.** The first photo in `.pd-grid` is the feature (two columns, two rows) when there are three or more; two or four photos use equal tiles in two columns. Put the best finished shot first in `project.txt`.
- A crop that cuts a subject is fixed per slot with `.photo[data-slot="…"]>img{object-position:…}` in site.css, never by editing the photo.

## 8. Motion

- One planned moment per page: the hero text settling in on load, and the dozer rolling into the footer once.
- Small responses to the user's own actions are fine: the nav underline, a button lifting 1px, an arrow nudging 3px.
- Everything respects `prefers-reduced-motion`.
- No carousels, counters, parallax or fade-in-on-scroll sections.

## 9. Words

- Joey's wording from the original brief is the source of truth. Plain, direct, first person plural ("We look them over and call to talk it through").
- The phone number appears in the header (desktop), the footer, the estimate page contact card, the thank-you message and the 404 page. Everywhere else, say "Call us" or "Or call us" and still link the number (Jeremy found it excessive on 2026-10-29).
- Never invent reviews, licence claims, years in business, counts, prices, response times or towns. Missing details come from `site.config.json`, and blank ones hide on the live site.
- No text option yet (calls only).

## 10. Logo

- Wide logo (`logo.svg`, `logo-reverse.svg` for dark) in the header and footer. It's traced vector art matching Joey's new "TVIS CONSTRUCTION" artwork (`NewLogo.jpg`).
- The round badge (built by `scripts/build.mjs`) is for the browser-tab icon, the phone home-screen icon and Google.
- Never stretch, recolour or add effects to the logo.

- **Tap targets.** Anything clickable that is not a link inside a sentence is at least 24px tall on desktop and 44px on phones. Pad the link, don't change the look (the footer links, "See all photos" and the "← All projects" crumb are done this way).
- **Page endings.** The closing band is heading and one sentence on the left, "Get an estimate" and "Or call us" side by side on the right, centred. Never stack the two actions on desktop.
- **Project pages** open with the title beside the before/after slider (title left, slider right, bleeding to the edge). A gallery group with one photo spans the row at 16:9.
- **Font stand-ins.** `--display` and `--text` carry metric-matched fallback faces second in the stack; keep them when changing fonts (re-measure `size-adjust` if the webfont changes).
- **Estimate page opening.** The estimate page has no photo opening: its title, intro and call link sit at the top of the form column, with the contact card and "How it works" level with the title on desktop. Keep that layout; do not add a hero photo or band above the form.
- **One related job on a service page** uses the whole row: slider on the left two thirds, title and text on the right (`proj-grid-one`). Two or three jobs use the normal three-card grid; tablets show two across.

## 11. Quality bar before calling anything done

- Screenshot phone (390px) and desktop (1440px), look at them and fix what you see.
- Lighthouse mobile 90+ on every page.
- No sideways scroll and no broken links.
- Jeremy sees screenshots of any change to the header, hero, footer or logo before it goes to his folder.
