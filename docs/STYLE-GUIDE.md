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
- **Vertical rhythm inside a section:** a section heading (h2) sits 24px above its first line of text (20px on narrow screens), text sits 24px above a list, and text or a list sits 32px above a button. Cards keep their own smaller steps (title to text 8 to 16px). Don't add one-off margins; reuse these.
- **Backgrounds alternate:** never put two different light backgrounds (warm gray and olive tint) directly next to each other. The home page runs white, warm, white, warm, dark band, warm.
- **Buttons size to their label** on desktop and tablets, everywhere. Only on phones (under 600px) do buttons in a text column run full width.
- **Grids never leave a card alone on a row:** on tablets an odd last project card spans the row, photo left and words right; on the desktop Projects page, when the count leaves one card over, the newest project runs the full width at the top.
- Header bar 116px on desktop (1360px up), 108px at 1181 to 1359px, 100px at 1024 to 1180px, 88px on tablets and small laptops (600 to 1023px), 76px on phones; plus the 4px olive stripe and the 1px hairline (`--hdr-h`, `--hdr-edge`). The header is fixed and the body carries a matching top padding, so nothing under it moves when the bar changes. From 1024px up it settles to an 84px bar with a 62px logo once the page has scrolled past 140px and grows back above 48px.
- Breakpoints: 1360px (Facebook mark joins the header), 1181px (phone number joins), 1024px (menu button becomes the real nav and the estimate button), 900px (everything stacks to one column, except that tablets from 600 to 900px keep the home audience cards, the More Services list and the footer link groups two across), 600px (phone header), 560px (small phones).
- Every page must work at 390px and 1440px with no sideways scroll.
- Content is left-aligned. Centre text only inside buttons.

## 5. Shape, borders and shadows

- **Square corners on everything.** No border-radius, except the round Facebook mark.
- Hairlines: 1px `--stone`. Card accent: 4px `--olive` top border (8px on the big CTA card).
- **Shadows are allowed, but only in these places.** Jeremy asked for them on 2026-10-29. The standard soft shadow is:
  `0 1px 3px rgba(35,43,46,.08), 0 18px 40px -20px rgba(35,43,46,.35)`
  Use it on: the fixed header, the estimate form card, the Talk to TVIS card, the How it works card. Primary buttons in the header and the form send button get a small olive shadow and lift 1px on hover (Jeremy asked for the snazzy header and its drop shadow on 2026-10-29; keep them). Don't put shadows on photos, plain sections or text.

## 6. Components (reuse these, don't invent new ones)

- **Header:** white, 4px olive stripe on top, hairline and soft shadow under it (a deeper shadow once scrolled). The full-colour logo is 88px tall on desktop (80 / 74 / 64 / 56px down the width tiers). Nav is Barlow uppercase 17px (16px under 1360px) with an olive underline that draws in on hover and focus and marks the current page; hover also turns the word olive. Then a divider, the Facebook mark, the phone with a small "Call us" label, and the olive "Get an Estimate" button, which lifts 1px on hover and presses flat on click. Its left and right edges line up with the content column at every width. On phones and tablets it shows the logo, "Call" and "Menu"; the menu slides down from under the bar and its links settle in one after another.
- **Home hero:** full-bleed jobsite photo, on desktop 520 to 700px tall (84% of the screen under the header, so the service strip and a peek of the next section fit the first screen) with a 56 to 78px headline. Above the headline a "where" line (`.hero-eyebrow`: a short olive dash, then "Excavation & Sitework · Chattanooga, TN" in Barlow 16px light olive, 14px on phones). Then the white H1 with its olive bar, one plain-sentence subhead ("Site prep, driveways, drainage, concrete and pads for homeowners and builders."), and "Get an Estimate" (olive) beside "Call us" (white outline). The scrim is left-to-right only (`.84 → .60 → .06 → 0`) with a faint foot at the top for the header edge and none at the bottom. On phones the photo sits on top (38% of the screen height) with the text on charcoal below and the two buttons side by side, both above the fold at 390x844.
- **Service strip (`.svc-strip`):** a white row directly under the hero photo with all six services as links, each a Barlow 18px title over a 14px gray descriptor, hairlines between cells. 6 across from 1024px, 3 by 2 on tablets, and on phones wrapped 44px chips with titles only ("Shed Pads"). Hover and focus: the olive line draws in under the title, the title turns olive, the cell goes warm gray. One partial (`src/partials/service-strip.html`), used under the home hero and again at the foot of each service page under an "All our services" heading, where the current service's cell is marked (tinted, olive title, line drawn; olive outline on the phone chip).
- **Page opening (`.phero`):** warm-gray band with H1, olive bar, one intro line, and optionally a photo. On desktop the photo is the big thing: it fills the full height of the band, top edge to bottom edge, with its right edge on the content edge (never the screen edge: Jeremy, 2026-11-02 15:57, "bleeds off the page", "too wide"; and never shrunk inside the band's padding: Jeremy, 16:14, "now it just looks so small"). The photo column is a little wider than the text column (1 : 1.12, 64px gap), which keeps every title on two lines where it fits, and the text sits centred beside the photo. Every opening with a photo is the same height at a given screen width (40% of the width, 480 to 600px); the photo fills that frame (about 604 x 600px on a 1440px screen) and never sets the height by its own shape. A longer heading can still make the band taller. Openings are near-square, so pick a 4:3 photo for them, never a panorama (the Drainage page got its own 4:3 cut, `svc-drainage-hero`). On phones the photo runs edge to edge under the text. The project pages use the same split and gap for their title and before/after slider. On Homeowners, Builders and More Services the opening also carries an audience line above the title (`.phero-eyebrow`, like the home hero) and a white proof card on the photo's lower-left corner (`.phero-job`: "In this photo", the project title, town, arrow square) that links to the job in the picture. The card overhangs the photo by 28px on desktop. Only add a card where the photo is a job with a project page, and take the town from project.txt.
- **Page titles:** one size everywhere except the home hero: 36 to 60px on desktop, 32 to 48px on phones (`--t-h1`), always with the 80 x 7 olive bar under it.
- **Buttons:** `.btn-primary` (olive), `.btn-light` (white on dark), `.btn-outline` (white outline on dark), `.btn-ink` (charcoal). 54px tall minimum, square, Barlow uppercase. Every button lifts 1px on hover and presses flat; the outline button fills white with charcoal text. Text says exactly what happens, and **every estimate button says "Get an Estimate"** (the form submit says "Send estimate request"; the project page says "Get an Estimate for a job like this").
- **Text links:** `.textlink` (olive, uppercase, 3px line that thickens to 5px on hover while the arrow nudges 4px). Call links: `.call-link` with a phone icon, reading "Call us" or "Or call us" (2px line thickens to 3px; the light version turns light olive on charcoal). Small links everywhere else (card titles, "See all photos", footer links, 404 links, related links) get the **draw-in line**: an olive (light olive on charcoal) line that grows from the left under the text on hover and focus, one line per text line. It is a solid-colour `background-image` sized from 0 to 100% wide, so it is not a visible gradient.
- **Who cards (Homeowner / Builder):** photo, olive rule, title, short line, olive arrow square. Hover: border turns olive, the photo eases to 103% over 0.4s, the title line draws in, the arrow nudges.
- **Service cards:** 4:3 photo, title, one line, "See … " link. Shown 3 across on desktop. Hover: the photo eases to 103%, the title turns olive and its line draws in; the "See …" line stays still.
- **Before/after slider (`.ba`):** 4:3, white drag handle, "Before" tag in charcoal and "After" in olive. Thumb-scrolls freely on phones.
- **Project card:** slider, title, town and category (a chip only for a job in progress), one-line description, "See all photos". The slider means the card is not one link; the title and "See all photos" carry the draw-in line.
- **Statement band:** charcoal with a darkened photo behind, big heading left, paragraph right.
- **Service area + CTA card:** towns list on the left, white CTA card with an 8px olive top border on the right.
- **How it works card:** four numbered charcoal squares joined by a pale-olive line, with the last step in olive. A charcoal result bar with a check mark sits at the bottom.
- **Form:** white card on the warm band. Inputs 58px tall, 1.5px gray border that darkens on hover, olive glow on focus. "I'm a…" is a three-way segmented control whose charcoal highlight slides to the option you tap (stacked on narrow phones, it slides down). "Add photos" is a tinted box with an olive camera square.
- **Footer:** charcoal, 8px olive ground line with the small dozer, white logo, then Contact, Services, Pages and Service area columns. Copyright says "TVIS Construction. From the Ground Up."
- **Phone call bar:** fixed at the bottom on phones ("Call" and "Get an Estimate"). On the home page it appears once the hero buttons scroll away.
- **Phone menu links:** a short olive bar slides in beside the link you press and the word shifts right and turns olive.
- **How it works on the home page:** the same card as the service pages, on a white band between the service cards (warm) and Recent projects (warm), with the heading "Start with a few photos".

## 7. Photos

- Only Joey's real jobsite photos. Never stock or other companies' photos.
- Crops: 4:3 for cards and sliders, 16:10 for the who cards, full-bleed with a scrim for the hero and the statement band.
- **Ask for enough pixels.** A photo cropped by its frame (a wide shot in a tall panel, a 4:3 shot in a taller opening) needs a file wider than the frame. Set its `sizes` to the width the photo is actually drawn at, not the frame's width: the wide panoramas in the Homeowners and Builders sections use `(min-width: 1440px) 1000px, (min-width: 900px) 90vw, 150vw` and their other section photos `(min-width: 1440px) 680px, (min-width: 900px) 60vw, 100vw`, the page-opening photos `(min-width: 1440px) 620px, (min-width: 900px) 48vw, 80vw`, the drainage opening (a panorama) `(min-width: 1440px) 820px, (min-width: 900px) 64vw, 120vw`. The home hero stays at `(max-width: 900px) 80vw, 100vw` for phone speed. Cards: `(min-width: 900px) 33vw, (min-width: 600px) 45vw, calc(100vw - 40px)` (two columns start at 600px); the Projects page grid uses `80vw` on phones because ten cards load at once; the project page slider uses `96vw` on phones so it shares a file with the gallery photo below it. Gallery tiles get their `sizes` from the build, one per tile shape.
- Pick bright, level, in-focus shots that show finished work or equipment working. Before/after pairs should be taken from about the same spot.
- Photos live in `photos/site/` (named by slot, e.g. `home-svc-concrete.jpg`) and `projects/<date-slug>/` (before-*, progress-*, after-*). The build resizes them. Record picks in `photos/site/PICKS.txt`.
- No filters or colour grading. The only treatment is the dark scrim for text.
- **Section photos line up with their text, inside the page width.** Only the home hero and the statement band run to the screen edge. On desktop every section photo (`.sv-media` on Homeowners and Builders, `.lp-two .sv-media` on the service pages and the ad page, `.pads-pic`) sits in its own half of the content width, its top level with the heading and its bottom level with the button, never shorter than 5:3 (when the text is short the button moves down to meet the photo's bottom edge). Sides alternate down the page, and the photo edges fall on the same two lines as the opening photo above. The project page slider also stops at the content edge. On phones and tablets the photo runs edge to edge, between the heading and the words. Before 2026-11-02 15:40 UTC the Homeowners and Builders photos ran top to bottom of their band and out to the screen edge, so neighbouring photos met corner to corner and wide shots lost half their width; Jeremy said the image spacing felt wrong.
- **Never stack two photos in one column.** A full section of space separates any section photo from the photo above it.
- **Project galleries never leave an empty cell.** The build (`galleryLayout` in scripts/build.mjs) gives each photo its tile. Desktop: one photo runs the full width at 16:9; two or four sit two across; three or more lead with the first photo (two thirds wide, two rows tall) beside two smaller ones, and the rest go three across, finishing with pairs when a row of three would leave a gap. Tablets and phones: an odd count leads with one full-width photo; two or four sit two across (two stack on phones); six or more open and close with a full-width photo. Put the best finished shot first in `project.txt`.
- A crop that cuts a subject is fixed per slot with `.photo[data-slot="…"]>img{object-position:…}` in site.css, never by editing the photo.

## 8. Motion

- One planned moment per page: the hero settling in on load (on desktop the photo eases from 104.5% to 100% over 1.8s while the text settles in), and the dozer rolling into the footer once.
- Small responses to the user's own actions are fine, and they all share one curve and length: `--ease: cubic-bezier(.2,.7,.2,1)` and `--dur: .25s` (photo zooms 0.4s). The vocabulary is fixed: a line draws in under text, a photo eases to 103%, a button lifts 1px, an arrow nudges 4px, a highlight slides. Don't add a new kind of hover; reuse one of these.
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
- **Project pages** open with the title beside the before/after slider (title left, slider right, its right edge on the content edge). A gallery group with one photo spans the row at 16:9.
- **Font stand-ins.** `--display` and `--text` carry metric-matched fallback faces second in the stack; keep them when changing fonts (re-measure `size-adjust` if the webfont changes).
- **Estimate page opening.** The estimate page has no photo opening: its title, intro and call link sit at the top of the form column, with the contact card and "How it works" level with the title on desktop. Keep that layout; do not add a hero photo or band above the form.
- **One related job on a service page** uses the whole row: slider on the left two thirds, title and text on the right (`proj-grid-one`). Two jobs fill the row half each (`proj-grid-two`); three use the normal three-card grid; tablets show two across.

## 11. Quality bar before calling anything done

- Screenshot phone (390px) and desktop (1440px), look at them and fix what you see.
- Lighthouse mobile 90+ on every page.
- No sideways scroll and no broken links.
- Jeremy sees screenshots of any change to the header, hero, footer or logo before it goes to his folder.
