> Copied into the repo on 2026-11-02 from the overnight research thread. The desktop and phone mockups of Concept C are in `docs/design/concept-c-desktop.jpg` and `docs/design/concept-c-phone.jpg`; the other concept images referenced below (A, B, D, the mega-menu header) stay in the project Library (`tvis-research/mockups/`) because they are large. Concept C was built the same night, without the proof card and with the current header kept; see `HANDOFF.md` > "Concept C and the ruthless pass".

# TVIS Construction: next-level website plan

Overnight research and strategy, 2026-11-02 (written 06:30 to about 09:30 UTC). Nothing on the live site was changed. Nothing was submitted to Google or anywhere else.

**DECISION 2026-11-02 06:47 UTC (Jeremy): Concept C approved, "let's keep building on C". The Meet Joey / About section (Top 10 #1, roadmap 1.6) is left off for now. The coordinator handed the build to the Final touches thread (the only writer of site files) to start Priority 1.**

**UPDATE 2026-11-02 06:48 UTC (Jeremy): build Concept C "with extra love", but WITHOUT the proof card ("I don't like the pop up in the picture") and KEEP THE CURRENT HEADER exactly as it is, social icons included. Header items 1.1 and 3.3 (Services mega menu, nav rename, moving social icons, slimmer bar) are OFF. Still in: eyebrow, plain subhead, lighter scrim, service strip, one CTA label, How it works, tablet hero.**

**How to use this file tomorrow.** Read section 2 (Top 10) and section 9 (tomorrow's roadmap) first. Everything else is the reasoning and the evidence behind them. The build thread should copy this file into `docs/NEXT-LEVEL-PLAN.md` in the repo. It sits alongside `docs/ROADMAP.md` and `docs/STYLE-GUIDE.md` and doesn't replace them.

**Mockups.** The hero and header concepts are drawn with the real fonts, logo and Joey's photos. They're in `/mnt/project-files/tvis-research/mockups/` (PNG files plus the `source/` that draws them), and the side-by-side comparison page is https://claude.ai/artifact/SwDvUrDgCmVRUbUYeuS5VF.

**What this research could and couldn't do.**
- The live site was rebuilt locally from the repo (commit `88f40b0`, "Search polish and page title sizes") and screenshotted at 390, 820, 1440 and 1920 px.
- Other companies' websites could only be **read as text** (WebFetch). This container's network blocks screenshots of outside sites, so visual judgments about them come from their structure and what reviewers say, not from looking at them.
- **Keyword search volumes could not be measured.** Google's keyword tools and autocomplete are blocked from here. The keyword plan uses evidence instead: how competitors and directories name the same services, the national figures from the 2026-10-28 research (`/mnt/project-files/tvis-design/practices.md`), and what currently ranks. Section 8 says how to get real local numbers for free.

---

## 1. Overall assessment

**The site is already better built than every local competitor.** The Chattanooga-area excavation sites researched on 2026-10-28 have broken "Services" links, leftover template text ("Slide title"), counters that read "0+ Years", disabled forms and typos. TVIS has none of that. It has:
- real job photos and before/after sliders
- a clean, consistent look with a locked style guide
- six service pages and ten real projects
- correct titles, descriptions and business structured data on every page
- Lighthouse mobile scores in the 90s
- an estimate form that takes photos

On craft and speed, TVIS is ahead.

**What holds it back is trust, not design.** A visitor can see that TVIS does good work. Nothing on the page yet says *who* TVIS is or why they should feel safe calling. These are all missing:
- no owner name or face
- no reviews (the section exists but is hidden)
- no years of experience
- no licence or insurance line
- no hours
- no "what happens after I call"
- no equipment
- no FAQ

Every top-tier contractor site researched puts a person and proof right after the hero. Two examples:
- [M4 Landworks](https://www.m4excavation.com) shows "5.0★ 100+ reviews", its licence number and "Meet the Owner".
- [Badger Dirtworx](https://badgerdirtworx.com) here in Chattanooga has "Meet the Owner" on its homepage.

That is the single biggest gap, and most of it needs answers from Joey, not code (section 10).

**The second gap is how the site is organised.** The six service pages exist but aren't in the main menu. The menu is built around *audiences* (Homeowners, Builders) plus a vague "More Services". Visitors think in *jobs*: "my driveway washed out", "I need a shed pad". Top sites put services first.

**The third gap is search visibility.** That's normal for a site that is four days old with a suspended Google Business Profile. Searches for Chattanooga sitework services currently return mostly directories (HomeAdvisor, Thumbtack, Angi, cost-guide sites) and very few real local contractors. That's good news: the field is weak, and a fast, well-organised site with real local projects can win page-one spots once Google trusts it.

**Scorecard, home page today** (my judgment, out of 10):

| Area | Score | Why |
|---|---|---|
| Visual craft and consistency | 8 | Clean, consistent, strong type, real photos. Mobile is good. |
| Header | 7 | Well built, but the menu hides the services, has two coloured social icons (one a "coming soon" placeholder) and takes about 13% of a laptop screen. |
| Hero | 7 | Strong photo and headline. Doesn't say *where* in the first glance, and the dark overlay makes the sky gray and murky. |
| Says what TVIS does within 5 seconds | 7 | The subhead does it. The headline itself is a slogan. |
| Trust and credibility | 3 | No person, no reviews, no years, no licence or insurance line, no hours. |
| Calls to action | 8 | Clear and repeated, but three different labels ("Get an Estimate", "Request an Estimate", "Request an estimate"). |
| Local SEO groundwork | 8 | Titles, descriptions, schema and sitemap are done. Missing: local depth on the service pages, the Google profile, reviews, FAQ. |
| Speed and accessibility | 9 | Lighthouse 92 to 100, axe clean. |

---

## 2. Top 10 highest-impact recommendations

Ranked by how much each changes what a first-time visitor feels, against the effort.

| # | Recommendation | Impact | Effort | Now or wait |
|---|---|---|---|---|
| 1 | **Put a person on the site.** "Meet Joey" block on the home page plus an About page: one photo of Joey with a machine, three or four sentences in his words, and how long he's done this work. | Very high | Easy to build, needs Joey's photo and words | Build the frame now, fill it when Joey answers |
| 2 | **Restructure the header around services.** Services (drop-down with all six, with photos), Homeowners, Builders, Projects, About. Move the social icons out of the desktop bar and drop the "coming soon" Google mark until the profile is live. One button label everywhere. | High | Medium (1 session) | Now |
| 3 | **Refine the hero, don't replace it (Concept C).** Add a "where" line above the headline, use a lighter and more targeted overlay, add a small "The job in this photo → East Ridge" card that links to the real project, and add a service strip under the hero. | High | Medium | Now |
| 4 | **Add "How it works" to the home page** (send photos → we look and call → we do the work). The component already exists on the estimate page. It answers "what happens if I reach out?" | High | Easy | Now |
| 5 | **Get ready to collect Google reviews.** Review link, a printed leave-behind card with a QR code, a text template Joey sends after each job, and the hidden reviews section turned on at 3+ real reviews. | Very high (long term) | Easy | Prepare now, use after reinstatement |
| 6 | **Answer the licence and insurance question.** Hamilton, Bradley and Marion counties require a TN *home improvement* licence for residential jobs between $3,000 and $25,000, and driveways are named in the law. Jobs of $25,000+ need a contractor licence. Find out what Joey holds, then show it (or don't). | High (trust and legal) | Joey's answer only | Ask now |
| 7 | **Book one planned photo day** (shot list in section 4.6): a golden-hour wide shot of a machine working, Joey's portrait, the truck and equipment line-up, matched before/after pairs. | High | One morning of Joey's time | Next job |
| 8 | **Give each service page local depth**: 3 to 5 FAQs, "what affects the price", Hamilton County's driveway-culvert ("driveway tile") rules on the Drainage page, and the real projects from that service. | High for SEO | Medium, spread over sessions | Start now, add Joey's answers as they come |
| 9 | **Set up GA4 plus conversion tracking** (estimate form sent, phone taps). Without it we can't tell what works once ads or the Google profile go live. | Medium-high | Easy (Jeremy creates the property, the build thread wires it) | Now, needs Jeremy's OK |
| 10 | **Clean up the service area and show real job locations.** Use one consistent list of towns (no "Downtown" next to "North Georgia"). Add a "Where we've worked" map built from the GPS in Joey's photos (East Ridge, Harrison, East Brainerd, Chattanooga, Sequatchie County). It's honest local proof. | Medium | Medium | Now (towns are already approved) |

---

## 3. Header and navigation plan

### 3.1 What's there now (measured at 1440 px)
- 4px olive stripe and a white bar about 116px tall (120 with the stripe). It shrinks to 84px after scrolling. Logo 88px, then 62px.
- Nav: Homeowners · Builders & Contractors · Projects · More Services.
- Then a divider, Facebook (blue) and Google (multi-colour, not a link yet, "coming soon" tooltip), a phone icon with "Call us 423-618-3112", and an olive "Get an Estimate" button with a shadow.
- Phones show the logo, "Call" and "Menu". The menu slides down, and a call bar is fixed at the bottom.

### 3.2 What's good and stays
- White bar, olive stripe, full-colour logo, Barlow uppercase nav, the drawn underline, the shrink on scroll, the phone number with its small label, the olive button, the phone call bar. These match the locked style and match what top sites do.

### 3.3 What to change, and why

**1. Make "Services" the first menu item, with a photo drop-down.** (Mockup: `header-mega.png`)
- *Problem:* the six service pages, which are the best pages for search and for ads, are only reachable from the footer and the home-page cards. "More Services" doesn't say what's inside.
- *Why it matters:* visitors arrive with a job in mind. Every strong contractor site researched leads with services. [M4 Landworks](https://www.m4excavation.com) groups "Land Services" in its menu, and [siteprep.com](https://www.siteprep.com) lists Foundations, Excavation and Backyard. It also gives Google a clear map of the site from every page.
- *Recommendation:*
  - Menu: **Services ▾ · Homeowners · Builders · Projects · About**.
  - The drop-down is a white panel the width of the page, with six tiles (small 4:3 photo, service name, one line) and a warm-gray side box: "Not sure what you need? Send a few photos…" plus the estimate button.
  - "More Services" becomes a text link inside the panel.
  - Shorten "Builders & Contractors" to "Builders" in the bar to make room. The page title keeps the full name.
- *Behaviour:* opens on hover (with a short delay so it doesn't flicker) and on click, closes with Esc, works with the keyboard, no animation beyond a 150 ms fade. On phones the menu shows the six services as a list with small thumbnails.
- *Effort:* medium (one session including phone and keyboard testing). *Timing:* now.

**2. Quieter right side.**
- *Problem:* two coloured brand icons in the bar pull the eye away from the phone and button. The Google one is a placeholder that does nothing, which reads as unfinished.
- *Why it matters:* top-tier sites ([Woodhull](https://www.woodhullmaine.com), [Gerding Builders](https://gerdingbuilders.com)) keep social links in the footer. Jeremy asked for *quiet* social marks in the header on 2026-10-28.
- *Recommendation (pick one):*
  - (a) Remove them from the desktop bar and keep them in the footer, phone menu and estimate card. **This is my pick.**
  - (b) Keep Facebook as a small charcoal outline icon and hide Google until the profile is live.
- *Effort:* easy. *Timing:* now.

**3. One button label everywhere.**
- Today the header says "Get an Estimate", the hero says "Request an Estimate" and the closing card says "Request an estimate".
- Use **"Get an Estimate"** everywhere now. It becomes **"Get a Free Estimate"** if Joey confirms estimates are free, which is the single best-converting phrase in this trade, and every competitor that offers it says so.
- *Effort:* easy. *Timing:* now.

**4. Slightly slimmer bar at rest on laptops.**
- *Problem:* at 1440×900 the header plus stripe takes 120px, about 13% of the screen, before the hero starts.
- *Recommendation:* 104px at rest (logo 76px), 80px scrolled (logo 58px). The logo stays clearly the biggest thing in the bar. The concept mockups use this size.
- *Effort:* easy (tokens). *Timing:* now, and show Jeremy before/after screenshots (style guide rule).

**5. Header over the photo on the home page only (optional, decide by eye).** (Mockup: `concept-a.png`)
- *What:* on the home page on desktop, the header starts see-through over the top of the hero photo with the white logo, and turns solid white with the full-colour logo after about 48px of scrolling.
- *Why consider it:* it gives the photo about 120px more room and joins the header and hero into one picture. It's a common premium move.
- *Why I don't recommend it as the default:* the full-colour logo on white is the brand's strongest asset and is in the locked style. The olive in the logo also loses contrast on a busy photo.
- Show both to Jeremy. My pick is to keep the solid white header (Concept C).

**6. Small craft details.**
- Give the drop-down's active item the same 3px olive underline as the current page.
- `aria-expanded` on the Services button.
- A visible focus ring on every item.
- The phone number keeps `data-nosnippet`.
- Keep "Call us" as the label above the number. It reads well and matches the style guide.

### 3.4 Phone and tablet
- **Phones:** keep logo / Call / Menu and the bottom call bar. Inside the menu, order it as: the call link, the six services with thumbnails, Homeowners, Builders, Projects, About, the estimate button, then the social icons.
- **Tablets (600 to 1023 px):** today the hero stacks (photo on top, text on charcoal below), so at 820px wide the buttons stretch to 750px and look heavy. Use the desktop layout (text over the photo) from 700px up, or at least cap the button width at about 320px.

---

## 4. Hero analysis: the current design against four concepts

All mockups use the real photos, fonts and logo. Files are in `mockups/`. The current design is in `current-desktop.png`, `current-tablet.png` and `current-phone.png`.

### 4.1 The current hero, honestly
- **Strengths:** a real TVIS job (the East Ridge hillside lot, Oct 2026) with a yellow Deere excavator, a strong condensed headline, clear buttons, and a good phone version. The photo is real, which most competitors can't say.
- **Weaknesses:**
  1. The headline says *how* (done right), but not *what* or *where*. The "what" lives in a title-case subhead, and the "where" is in small gray text on the fourth line.
  2. The overlay is heavy across the left 40%, which turns the overcast sky a flat gray and makes the scene look gloomier than the job was.
  3. The finished house is the brightest object in the frame, so it can read as "we build houses" rather than "we did the groundwork".
  4. There's no proof element: nothing says "this is our job, here's how it turned out".
  5. It's a phone photo with wide-angle lean on the trees. Fine at this size, but it's the ceiling of what this image can do.

### 4.2 The concepts

**Concept A: Refined single image, header over the photo** (`concept-a.png`)
- Same photo, with a "where" line above the headline ("EXCAVATION & SITEWORK · CHATTANOOGA, TN"), a shorter plain-sentence subhead, a lighter overlay, a see-through header, and a thin row of service links along the bottom of the photo.
- *Good:* most immersive, cleanest. *Weak:* loses the white header and full-colour logo, the service row is hard to read over grass, and it still has no proof.

**Concept B: Editorial composition, three photos** (`concept-b.png`)
- A charcoal text panel on the left. On the right, one tall photo plus two smaller ones (finished asphalt drive, excavator clearing a wooded lot), each with a small caption.
- *Good:* shows range at a glance. It's the "editorial" look many architecture sites use.
- *Weak:*
  - Joey's photos vary a lot in light and colour (overcast gray, bright blue sky, deep shade). Side by side the differences jump out and look less professional than one strong image.
  - Each photo is small, so none of them has impact.
  - On a phone it collapses to one photo anyway.
  - It looks more like a magazine than a dirt contractor.
- This concept *could* work after a planned photo day with matched light. Not with today's library.

**Concept C: Refined image + proof card + service strip** (`concept-c.png`, phone: `mobile-c.png`) **← recommended**
- Keeps the white header and the single big photo, slightly shorter (about 676px at 1440×900, so the first section peeks into view).
- Adds:
  - the "where" line above the headline
  - a plain-sentence subhead: "Site prep, driveways, drainage, concrete and pads for homeowners and builders."
  - a lighter, better-targeted overlay
  - **a small white card at the bottom right: "THE JOB IN THIS PHOTO · Hillside lot and concrete drive · East Ridge · October 2026 · See the before & after →"**, with the finished-driveway thumbnail
  - a white **service strip** directly under the hero with all six services, each one a link
- On phones the card sits on the bottom corner of the photo, and the services become a row of tappable chips.
- *Why it wins:*
  - It answers what, where and who in the first glance.
  - The card is honest proof: it turns the hero from a nice picture into evidence. It's also unusual, since no competitor researched does it.
  - It keeps everything Jeremy already approved.
  - It works with today's photos.
- When a better hero photo arrives, the card simply points to that job instead.

**Concept D: Before/after hero** (`concept-d.png`)
- The hero itself is a full-width before/after slider with the headline on the "before" side.
- *Good:* memorable, and it shows transformation, which is what sells sitework.
- *Weak:*
  - It needs a perfectly matched pair, taken from the same spot and height, wide and level. The mockup shows the problem: the East Ridge before and after were shot from different angles, so the slider doesn't line up and looks broken.
  - Dragging a hero on a phone fights with scrolling.
  - The headline sits over a busy image.
- Keep the idea for later: once Joey shoots matched pairs (section 4.6), a before/after could become the *statement band* or a project spotlight, not the hero.

**Also considered and rejected:**
- *Background video:* Joey's videos are vertical phone clips, so they'd be soft at hero size, heavy on mobile data, and the style guide allows one motion moment.
- *Rotating carousel:* the research consistently shows carousels hide the message. Outdoor, Inc. in Hixson buries its excavation offer behind landscaping slides.
- *Stock photography:* never.

### 4.3 Comparison against the seven questions (1 = weak, 5 = strong)

| Question | Current | A | B | **C** | D |
|---|---|---|---|---|---|
| Looks more professional | 4 | 4 | 3 | **5** | 3 |
| Communicates trust | 2 | 2 | 3 | **4** | 4 |
| Says what the company does right away | 3 | 4 | 4 | **5** | 3 |
| Makes the work look impressive | 4 | 4 | 3 | **4** | 4 (with a matched pair) |
| Better user experience | 4 | 3 | 4 | **5** | 2 |
| Works beautifully on mobile | 4 | 4 | 3 | **5** | 2 |
| Encourages action | 4 | 4 | 4 | **5** | 3 |
| **Total** | 25 | 25 | 24 | **33** | 21 |

### 4.4 Recommendation
**Build Concept C.** Keep the white header and the single big photo, and add the "where" line, plain subhead, lighter overlay, proof card and service strip. Show Jeremy desktop and phone screenshots before it goes to his folder.

**Revisit the hero photo itself after the photo day.** The *layout* is the right one for a long time, but the *image* has more to give.

### 4.5 Hero photo and cropping rules (for whoever builds it)
- **Source:** 4032px wide original, landscape, horizon roughly level, the main subject in the right two-thirds, and quiet ground or sky on the left where the text sits.
- **Crop:** `object-position` about 60% 58% for the current photo at 1440. Check at 1280, 1440, 1920 and 2560. At 2560 the image must not soften (serve the 2400 build).
- **Overlay:** a left-side gradient that ends by about 64% of the width. Use a bottom shade only where the proof card needs it. No overlay on the right third.
- **Phone:** photo on top at about 34 to 36% of the screen height, so the headline and *both* buttons are visible on a 390×844 screen without scrolling (they're just at the edge today).
- **Load:** keep `fetchpriority="high"`, the existing widths and the 1.8s settle.

### 4.6 Photos worth getting (a shot list for Joey's next job)
Not stock. Each one has a specific job on the site.

1. **Hero wide, machine working.** Mini excavator or skid steer mid-task (bucket in the dirt, not parked). Shot at golden hour (the hour after sunrise or before sunset), landscape, phone at chest height, held level, standing back far enough that the machine fills about a third of the frame, with open ground on the left. Take 10 and we pick one.
2. **Joey's portrait.** Joey standing beside a machine or the truck, looking at the camera, natural light, workwear. For the About block and the Google profile. (Faces are OK per Jeremy, 2026-11-02.)
3. **Equipment line-up.** Every machine and the truck/trailer side by side, wide. For an "Our equipment" strip.
4. **Matched before/after pairs.** Before starting, take the "before" from a spot you can find again (a mailbox, a tree, a corner of the house), phone at the same height. Take the "after" from the exact same spot. One for each of: driveway repair, drainage fix, shed pad, lot clearing.
5. **Detail close-ups.** Compacted gravel layers, a culvert end with its headwall, forms before a pour, a French drain trench with fabric and stone. These make service pages look expert.
6. **Drone or high shot (optional, later).** A finished lot from above. Only if Joey or a friend has a drone (FAA Part 107 rules apply for business use). Don't buy anything for this.

---

## 5. Recommended landing page direction

Keep the current order and look. Add trust, and tighten. Proposed home page order (new items marked ★):

1. Header (Services menu)
2. Hero, Concept C, with the proof card
3. ★ Service strip (six links)
4. Who's the project for? (Homeowner / Builder cards). Tighten them: the builder card's two-line title pushes its arrow lower than the homeowner card's. Align the arrows to the title and make the whole card clickable.
5. The work we do most (six service cards). Make each whole card the link, with a gentle 1.03 photo zoom on hover.
6. ★ How it works (3 or 4 steps, reusing the estimate-page component): Send photos → We look and call → Fair written estimate (wording pending Joey) → We do the work.
7. Recent projects (3 sliders)
8. ★ Meet Joey (photo, 3 to 4 sentences, "Call Joey" link). Built now with `launchMode` so it stays hidden until there's a photo and text.
9. Statement band (charcoal)
10. ★ Reviews (already built, hidden). Turn on at 3+ real Google reviews and show them as quoted text with first name, town and month. No widgets.
11. Service area + estimate card, with a cleaned town list and ★ the "Where we've worked" map
12. ★ Short FAQ (4 to 6 questions, only ones Joey has answered)
13. Footer (add hours once known)

**Copy notes for the hero.** Joey's wording is the source of truth, so these are proposals for Jeremy and Joey to approve:
- Keep **"Groundwork Done Right."** It's strong, short and ownable.
- Add the "where" line above it: **"Excavation & Sitework · Chattanooga, TN"**.
- Change the subhead from title case ("Professional Sitework, Driveways, Drainage & Property Improvements.") to a plain sentence: **"Site prep, driveways, drainage, concrete and pads for homeowners and builders."**

**Trust signals we can show today, with no invention:**
- Real job photos labelled by town and month.
- The proof card.
- "Send photos with your request."
- "Homeowners and builders."
- The service-area map from GPS.
- The info@ email and phone.

**Trust signals that need Joey:** owner name and photo, years, licence and insurance, reviews, hours, response time, equipment.

---

## 6. Visual design and professional polish (small things that add up)

Each one is easy unless marked.

1. **Photo consistency pass (medium; needs Jeremy's OK because it bends a style-guide rule).**
   - The style guide says "no filters or colour grading".
   - This would *not* be a filter. It's what a professional retoucher does: level horizons, correct the wide-angle lean on verticals, even out exposure and white balance so overcast and sunny shots sit together.
   - Done once at build time by a script, with each photo checked by eye.
   - This is the biggest "looks expensive" upgrade available without new photos.
2. **Lighter, more targeted hero overlay.** Covered in section 4.
3. **Eyebrow labels.** Small olive uppercase labels above section titles (for example "What we do", "Recent work", "How it works"). They add a layer of hierarchy that premium sites use. Keep them short and true.
4. **Whole-card links and hover.** Service, who and project cards: the whole card is the link, with one 3px olive underline on the title and a 1.03 photo zoom over 400 ms. Respect reduced motion.
5. **Card alignment.** Equal title baselines and arrows in the two who cards. Service card text sits at the same top edge.
6. **Tablet hero.** See 3.4.
7. **Section rhythm.** White → warm gray → white → charcoal → warm gray → charcoal footer works. When the new sections are added, never put two warm-gray sections next to each other. Put "How it works" on white, "Meet Joey" on the olive tint `#EEF1E2`, and the FAQ on white.
8. **Service area list.** Use one level of place names. Proposed: Chattanooga, Red Bank, Signal Mountain, Hixson, Soddy-Daisy, East Ridge, East Brainerd, Ooltewah, Harrison, Collegedale\*, Cleveland, Jasper, Sequatchie County, North Georgia (Ringgold, Rossville, Fort Oglethorpe\*). Neighbourhoods like Downtown and St. Elmo fold into Chattanooga, and "Highway 58" becomes Harrison. \*Only if Joey confirms; don't add towns he doesn't serve.
9. **Numbers in type.** Phone numbers and dates use `font-variant-numeric: tabular-nums` so they line up.
10. **Footer.** Add hours and "Calls only" when known, and keep the rest. It's one of the best parts of the site.
11. **Accessibility keepers:** axe clean, focus rings, 44px tap targets on phones, alt text describing the job and town. Keep checking all of them on every change.

---

## 7. Competitor and industry research

### 7.1 Local (Chattanooga area)

Detailed notes from 2026-10-28 are in `/mnt/project-files/tvis-design/competitors.md`. Headlines:

| Site | What works | What to borrow | Where TVIS is already ahead |
|---|---|---|---|
| [Badger Dirtworx](https://badgerdirtworx.com) | Specific H1 "Excavation & Drainage Contractor in Chattanooga, TN"; "Meet the Owner"; a yard-drainage problem section right before real before/afters | Problem-first drainage copy; the owner section | Their "Services" link is broken, they have typos, and the owner section has no photo |
| [L & S Excavation](https://www.landsexcavation.com) | "If it's dirt or concrete, it's us."; text and call side by side; plain process copy ("send the address, a few photos, and what you want") | Telling people exactly what to send | Their review count contradicts itself, 44 services dilute the focus, and photos have empty alt text |
| [Pullen's Land Works](https://pullenslandworktn.com) (Cleveland) | Local soil copy (clay, rainfall, steep lots); a cost explainer; named owner and foreman | "What affects the price" sections; local terrain copy | Their counters show "0+ Years" to crawlers, and buttons go to the wrong pages |
| [Evergreen Excavation](https://evergreenexcavation.com) | A Chattanooga page with genuinely local ridge and valley terrain content; "written estimates after we walk your property" | Local conditions copy on service pages | Repeated images, empty alt text |
| [Trench It](https://trenchitchattanooga.com) | Photo **and video** upload on the form; a hero that names the customer's problem | Problem-first lines on service pages | Live "Slide title" placeholders |

**Takeaway:** the bar locally is low, and TVIS clears it on craft. The things worth borrowing are all *content*: owner, local terrain, price drivers, process.

### 7.2 Best-in-class examples elsewhere (with what to adapt)

1. **[M4 Landworks](https://www.m4excavation.com)** (NW Oregon, excavation and gravel). The closest model for TVIS.
   - Services grouped in the menu, a hero with a rating badge and licence number, quick-link cards under the hero.
   - "Local, Family-Run" owner section with a photo, a stats bar (rating, reviews, communities, response time), service area, FAQ, and a floating mobile bar with call and text.
   - *Adapt:* service-first menu (3.3.1), owner section (#1), stats strip *only with true numbers*, FAQ.
   - *Don't copy:* its italic one-word accents in headings, which our style guide forbids.
2. **[Site Prep (siteprep.com)](https://www.siteprep.com/shed-pad-foundation-pa/)** (shed pad specialist).
   - The shed-pad page lays out the method step by step (grade, perimeter, 4 to 6 inches of compacted stone, make the pad 1 ft bigger than the shed), plus a diagram, sizing rules, use cases (sheds, hot tubs, gazebos), an FAQ (gravel vs concrete, why not blocks) and how off-level ground changes the price.
   - *Adapt:* our Shed & Garage Pads page already has the four-step build. Add a sizing rule, uses beyond sheds and a gravel-vs-concrete FAQ, in Joey's numbers only.
3. **[Woodhull](https://www.woodhullmaine.com)** (Maine design-build).
   - A calm, full-width hero with "See our Work" and "Contact Us", a 12-tile project grid, a numbered process, press logos, and the closing line "Every project begins with a conversation."
   - *Adapt:* restraint (phone and social in the footer, not the bar), the numbered process, and the closing-line tone.
4. **[Gerding Builders](https://gerdingbuilders.com)** (commercial GC).
   - A big type headline "Building a Better Standard", two stats (59 years, 700+ projects), one featured project, many named testimonials, and licence numbers in the footer.
   - *Adapt:* licence line in the footer once confirmed, and one *featured* project on the home page instead of three equal ones (optional).
5. **[JG Grading](https://jggrading.com)** (NC family grading and clearing).
   - Google rating in the header, a family-legacy story, a satisfaction guarantee, "A Reputation Earned, Not Given" reviews, and "Leave us a review" links.
   - *Adapt:* a guarantee line if Joey is comfortable making one, and a "Leave us a review" link in the footer after reinstatement.
6. **[Revolution Contractors](https://revolutionflorida.com)**: "Start My Project" and "Our Services" hero buttons and photos of completed projects. Shows that a two-button hero with an action-specific label works. (Webflow's write-up: [webflow.com/blog/construction-websites](https://webflow.com/blog/construction-websites).)

Lists consulted: [Webmarketers: 10 best excavation websites](https://webmarketers.ca/resources/the-10-best-excavation-website-design-examples/) (mostly big civil firms, useful mainly for colour discipline), [Webflow construction websites](https://webflow.com/blog/construction-websites), [CyberOptik hardscape sites](https://cyberoptik.net/blog/best-hardscape-design-websites), and [Dirt River Design on what excavation sites should do](https://www.dirtriverdesign.com/blog/what-excavation-company-website-should-do). The last one is a good checklist: show equipment and what it can reach, explain what moves price, state coverage limits, describe the utility-locate process (Tennessee 811), and show the licence.

### 7.3 What separates the best from average contractor sites (pattern summary)
1. A person and a story (owner face, family-run, years).
2. Third-party proof (Google rating and count, named reviews with towns).
3. Services first in the menu, each with its own page.
4. Real job photos with places and dates.
5. One clear action repeated, plus call (and text where offered).
6. Process and price transparency ("what happens next", "what affects the price").
7. Local specifics (terrain, county rules, towns with real jobs).
8. Restraint: no carousels, no stock, no clutter in the header.

TVIS already has 3 (partly), 4, 5 and 8. Items 1, 2, 6 and 7 are the plan.

---

## 8. Google readiness and local SEO

### 8.1 Status today
- **Search Console:** verified at the domain level, sitemap submitted (22 URLs in the current build). Indexing requested for `/` and `/estimate` (2026-11-02).
- **On-site:**
  - unique titles of 60 characters or fewer and descriptions on every page
  - `HomeAndConstructionBusiness` + `WebSite` + `BreadcrumbList` + `Service` structured data
  - `robots.txt` with the sitemap
  - `noindex` on the ad page, the thank-you page and the 404
  - phone wrapped in `data-nosnippet`
  - favicon and web manifest
  - That's all in place, and better than every local competitor.
- **Google Business Profile:** suspended on creation. One appeal submitted 2026-11-02 01:35 UTC. Google says decisions can take up to 5 business days and arrive by email. Appeals can be submitted only once. Status shows in the GBP Appeals Tool ([Google help](https://support.google.com/business/answer/13597551)).
- **Analytics:** none (`tracking` IDs are blank in `site.config.json`).
- **TVIS doesn't show yet in a general web search** for "TVIS Construction" Chattanooga. That's expected four days after launch.

### 8.2 Google readiness checklist

**A. Safe to do now (doesn't touch the appeal)**
- [ ] **Don't edit the Business Profile, don't create a second one, and don't file another appeal** while the decision is pending. Wait for the email. Then check the Appeals Tool.
- [ ] Keep the name **exactly "TVIS Construction"**, the same phone (423-618-3112) and the same website on the site, Facebook and anywhere else. Don't list the business in any new directory until the phone number is permanent (see the citations note in 8.3).
- [ ] **GA4** (Jeremy creates it, signed in as the business Google account if possible, then pastes the Measurement ID into `site.config.json → tracking.googleAnalyticsId`; the build thread wires it). Track as key events:
  - the `/thanks` page view (estimate sent)
  - `tel:` link clicks (`data-track="call"` already exists on the links)
  - estimate-form start (optional)
  - Turn on Google Signals: no. Data retention: 14 months.
- [ ] **Bing Webmaster Tools:** import from Search Console (one click, after signing in with the same Google account). It also feeds DuckDuckGo and ChatGPT search. Jeremy's call, since it's a new account.
- [ ] **Structured data tidy-up** (build thread):
  - `areaServed` as proper `City` / `AdministrativeArea` entries matching the cleaned town list
  - add `openingHours` once known
  - add the GBP link to `sameAs` after reinstatement
  - check with the [Rich Results Test](https://search.google.com/test/rich-results)
  - Don't mark up our own star ratings: Google doesn't show self-served review stars for local businesses.
- [ ] **robots.txt:** remove `Disallow: /lp/` and rely on the page's `noindex`. While the URL is blocked, Google can't see the `noindex` and could list the bare URL if an ad link gets shared.
- [ ] **Prepare the review kit** (nothing is sent until reinstatement):
  - a text template
  - a one-page leave-behind card with a QR code
  - an email signature line
  - a short "how to reply to reviews" note for Joey
- [ ] **Prepare the GBP content pack**, a doc for Joey to paste after reinstatement:
  - **Business description** (750 characters, no phone, no links, no keyword stuffing)
  - **Services** with short descriptions
  - **Up to 20 service areas** (towns and counties; radius isn't allowed)
  - **Hours**
  - **Photos:** already prepared in `/mnt/project-files/tvis-gbp/photos/`
- [ ] **Cloudflare:** keep DNS-only and leave the Workspace MX/TXT/DKIM records untouched.
- [ ] **Google Workspace billing card before 2026-11-11**, or info@ stops. This is Google-related and urgent.

**B. Do the moment the appeal is approved**
- [ ] Put the profile link into `site.config.json → googleBusinessProfile`. The Google mark becomes a real link everywhere, and the build adds it to `sameAs`.
- [ ] Complete the profile from the content pack:
  - **Category:** Primary "Excavating contractor". Secondary only if true (check the names in GBP): "Concrete contractor", "Grading contractor", "Drainage service", "Demolition contractor", "Land clearing service".
  - **Location:** service-area business with the address hidden.
  - **Hours, description, services, opening date.**
  - **Photos:** 10+, including Joey and the equipment.
- [ ] Get the short review link ("Ask for reviews" in GBP) and start asking **every** past and new customer. No gating (asking only happy customers) and no incentives of any kind. Both are against Google's rules and the [FTC's 2024 fake-review rule](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials).
- [ ] Reply to every review within a couple of days, by name, and mention the job and town naturally.
- [ ] Post a photo update for each finished job (town + service + one sentence), roughly weekly.
- [ ] Add the website to the Facebook page's About section (if it isn't already) with identical name and phone.
- [ ] Turn on the website's reviews section once there are 3+ reviews.

**C. Later (after reinstatement and a permanent phone number)**
- [ ] A handful of consistent citations, not dozens: Apple Business Connect (Apple Maps), Bing Places (imports from GBP), Nextdoor Business, BBB (free listing, optional), Yelp (optional).
- [ ] Ask Hamilton County Engineering to add TVIS to their **list of known driveway-tile (culvert) contractors**. Their spec sheet says the list is shared on request ([Hamilton County driveway tile specs](https://www.hamiltontn.gov/PDF/Engineering/Driveway%20Tile%20Specs%205%20%20Newest.pdf)). Joey's decision. Check the licence question first.
- [ ] Google Ads / Local Services Ads: only when Jeremy and Joey decide on paid ads. LSA needs a licence and insurance check.

### 8.3 Local SEO research

**The market.** Searches for TVIS's services around Chattanooga return mostly directories and cost guides (HomeAdvisor, Angi, Thumbtack, HomeBlue, ContractorPlus, Procore and DOZR rental pages) and very few real local contractors. Evidence from tonight's searches:
- "excavation contractor Chattanooga TN"
- "gravel driveway repair Chattanooga TN"
- "French drain yard drainage contractor Chattanooga"
- "gravel shed pad installation Chattanooga Ooltewah Hixson"
- "land clearing lot clearing Chattanooga TN company"

These searches used a non-Google engine, so treat them as a strong hint, not a Google ranking report. Where the field is mostly directories, a fast local site with real projects, a verified Google profile and reviews tends to break through. The map pack (the three businesses with pins) is decided almost entirely by the Google profile, reviews and closeness, which is why the appeal and reviews matter more than anything on the site.

**Local language worth using.** Use it naturally, and only where it's true.
- **"Driveway tile".** Hamilton County Engineering calls a driveway culvert a *driveway tile*. Locals who've dealt with the county may search that phrase.
- **County rules that show expertise.** In county right-of-way:
  - pipe at least 15 inch
  - CMP, RCP or gray HP-Storm only, no black corrugated plastic
  - headwalls on both ends
  - rock or crusher run backfill near the road edge
  - a right-of-way permit, with an inspector deciding the size
  - Source: [county spec sheet](https://www.hamiltontn.gov/PDF/Engineering/Driveway%20Tile%20Specs%205%20%20Newest.pdf).
  - A short "Driveway culverts in Hamilton County" section on the Drainage page is exactly the kind of genuinely local, useful content Google rewards, and no competitor has it. Confirm with Joey that this matches how he works.
- **Terrain.** Ridge and valley lots, clay soil, heavy rain, steep driveways, and rock on Signal and Lookout. Competitors (Pullen's, Evergreen) use this. Use it only with Joey's real experience behind it.
- **Shed-pad buyers.** Portable and rent-to-own sheds are big in this region. Phrases like "gravel pad for shed", "shed pad", "shed foundation" and "level a spot for a shed" come from buyers whose shed company told them to prepare a level pad.

**Keyword map: one main search per page** (no duplicate targeting). Volumes are unknown locally; ★ marks national "near me" volume leaders from the 2026-10-28 research.

| Page | Main phrase | Supporting phrases | Notes |
|---|---|---|---|
| Home | excavation & sitework, Chattanooga TN | ★ excavation contractor near me, ★ excavating company, sitework contractor Chattanooga | Title already set. Add the "where" line on the page. |
| /site-prep-excavation | site prep & excavation Chattanooga | house pad, building pad, lot clearing and grading, final grading, mobile home site prep (only if true) | |
| /drainage | French drains & yard drainage Chattanooga | ★ yard drainage contractor, standing water in yard, downspout drain line, driveway culvert, **driveway tile Hamilton County** | Add the county culvert section. |
| /gravel-driveways | gravel driveway repair Chattanooga | ★ gravel driveway contractor near me, driveway washout, ruts and potholes, crusher run, new gravel driveway | |
| /concrete | concrete driveways & slabs Chattanooga | concrete pad, concrete slab for shed or garage, driveway apron, sidewalk | |
| /shed-garage-pads | gravel shed pad Chattanooga | ★ shed pad near me, shed foundation, garage pad, pad for portable building | Add a sizing rule and gravel vs concrete. |
| /demolition-cleanup | lot clearing & small demolition Chattanooga | ★ land clearing near me, brush clearing, shed tear-down, debris haul-off | |
| /builders | sitework subcontractor Chattanooga | site prep for builders, final grading for new homes, utility trenching (only if offered) | |
| /homeowners | driveways, pads & drainage for homeowners | | It's a guide page linking to the service pages. Keep it. |

**On-page improvements, in order:**
1. **H1s.**
   - Service pages are titled just "Drainage & Culverts". Add the "where" line (eyebrow) "Chattanooga, TN" above every page title. It's visible, consistent with the home hero, and helps visitors and Google alike.
   - The `<title>` tags already carry the place, so no change is needed there.
2. **FAQs on each service page** (3 to 5 real questions, Joey's answers).
   - Google no longer shows FAQ rich results for most sites, so this is for people and for relevance, not for stars.
   - Example questions: Do you do small jobs? How big should my shed pad be? Gravel or concrete? Do I need a permit for a driveway culvert? How soon can you start? Are estimates free?
3. **"What affects the price" block** on each service page (access, slope, rock, wet ground, haul distance, materials), with no prices unless Joey gives real ones.
4. **Internal links.**
   - Each project page links to its service page and vice versa (mostly in place).
   - The home "Recent projects" cards link to the projects.
   - Add a "Related services" row at the bottom of each service page (Drainage ↔ Gravel Driveways ↔ Site Prep, Pads ↔ Concrete).
5. **Images.**
   - Alt text already describes the job.
   - Optional later: descriptive built filenames (for example `gravel-driveway-east-ridge-960.jpg` instead of slot names) and an image sitemap. Low priority.
6. **Location pages: not yet.**
   - Build a town page only where there are **real jobs and real local content**. Google's spam policy calls swapped-town-name pages "doorway" abuse ([Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)).
   - The first candidates, once each has 2 or 3 jobs: **East Ridge** (hillside drive, trenches, culvert, brush clearing), **Sequatchie County** (four projects at one site), **Harrison** (drainage yard, patio).
   - Until then, one strong **Service Area** section with the job map.

**Content that can bring in qualified leads** (one useful article a month is plenty; each written from Joey's real jobs and photos):
1. "Driveway culverts in Hamilton County: what the county requires" (the rules above, plus photos of a TVIS culvert job).
2. "How to get your yard ready for a portable shed" (pad size, level, gravel vs concrete, what the shed company expects).
3. "Why is water standing in my yard?" (clay, grading, downspouts: when a French drain helps and when regrading is better).
4. "Gravel driveway washing out? Repair vs regrade vs culvert".
5. "Clearing a wooded lot for a new home: what happens, in order" (from the Sequatchie County project photos).

**Measuring keywords for real (free, when Jeremy is ready).**
- **Search Console → Performance:** after 3 to 4 weeks, this shows the actual phrases people used to find TVIS. That's the best data there is.
- **Google Keyword Planner:** needs a Google Ads account, but no spending. Set the location to the Chattanooga DMA and check the phrases in the table above.

### 8.4 Shaping what Google's AI Overview says about TVIS

**What it says now (Jeremy's screenshot, 2026-11-02 06:41 UTC, search "tvis construction chattanooga"):**
- "TVIS Construction is a local construction and site services provider based in the Chattanooga, Tennessee area."
- Then the phone, email and website, and all six services by their exact names from the site.

**Verdict: this is a good start, and it's accurate.** Google is already reading the site correctly, four days after launch. It can be better in three ways:
1. **It's generic.** "Construction and site services provider" could be anyone. Nothing says who it's for (homeowners and builders), which towns, who runs it, how long, or what happens when you reach out.
2. **It has no proof.** No reviews, no rating, no owner. Once competitors have reviews, AI summaries tend to mention them ("highly rated for…").
3. **The search card beside it is stale.** It shows an old title ("Gravel Driveway Repair, Shed P…"), the old snippet with the phone number and email text that the 2026-11-02 `data-nosnippet` change now hides, and the old round icon. Google refreshes these on its next crawl over the coming days to weeks. No action needed beyond the indexing request Jeremy already made.

**How AI Overviews decide what to say.**
- Google's AI features use the same index and the same ranking systems as normal search. There's no special markup, file or trick for AI Overviews, and Google says the normal SEO best practices apply ([Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)).
- So the summary is built from:
  - the clear, plain sentences on the site
  - the Google Business Profile (once live)
  - reviews
  - what other sites say about the business
- Our job is to give Google plain, true, consistent sentences to quote.

**What to do (all within Google's rules):**
1. **One clear "who we are" sentence, used everywhere.** Proposed, for Joey to approve: *"TVIS Construction is a Chattanooga, TN excavation and sitework company that does site prep, drainage, gravel and concrete driveways, shed and garage pads, and small demolition for homeowners and builders."*
   - Put it on the About page, as the first line of the home page's service-area section, in the footer description, in the structured-data `description`, and (word for word) in the Google Business Profile description and the Facebook About section.
   - Consistency across sources is what makes an AI summary confident.
2. **An About page with facts in plain sentences.**
   - Who runs it ("Owned and run by Joey Glisson"), how long, where it's based, the towns it serves, and what it does and doesn't take on.
   - AI summaries love pulling "owned by", "serves", "since" facts. Only true facts, from Joey (section 10).
3. **A plain service-area sentence.** "We work throughout Chattanooga and Hamilton County, including Red Bank, Hixson, East Ridge…, plus Sequatchie County and North Georgia." A list in a sentence is easier to quote than a grid.
4. **An FAQ page (and short FAQs on the service pages)** with direct one-sentence answers first, then detail. For example:
   - "Are estimates free? Yes/No…"
   - "What areas do you serve?…"
   - "Do you take small jobs?…"
   - "How do I get an estimate? Send a few photos through the form or call…"
   - AI Overviews often answer exactly these questions, and they quote the clearest answer they can find. Answers come from Joey, never invented.
5. **Consistent business details across the web.** The exact name "TVIS Construction", the same phone, the same website and the same description on the site, GBP, Facebook and, later, Apple/Bing and a few directories.
   - Don't mix in "TVIS Site Work and Construction" or "Tennessee Valley Investment Services" in public listings, or the summary gets confused about the name.
   - The legal LLC name only belongs in legal documents.
6. **Reviews, after reinstatement.** Real Google reviews that mention the job and town in the customer's own words ("they fixed the washout in our gravel driveway in Hixson") are the strongest third-party signal AI summaries draw on.
   - Ask every customer, never pay or filter (see 8.2 B).
   - Reply to each one.
7. **Structured data already helps; keep it in sync.** Use the same description, `areaServed` towns and `sameAs` links (add GBP when live). It doesn't control the AI text, but it confirms the facts.
8. **Don't:**
   - write pages aimed at the AI
   - stuff town names
   - make up a founding year or review count
   - create pages for towns without real work
   - use `nosnippet` on content we want quoted (we only use it on the phone number, which is fine since the number still shows in the business card)

**Expected result.** Once the About page, the FAQ and the GBP are live and a few reviews exist, the summary should read more like: *"TVIS Construction is a Chattanooga excavation and sitework company owned by Joey Glisson, serving homeowners and builders across Hamilton County and nearby. It offers site prep, drainage and culverts, gravel and concrete driveways, shed and garage pads, and demolition. Customers mention…"*. That's a summary that sells.

**Technical SEO and performance: already strong.** Keep Lighthouse 90+, keep the hero image preloaded, and keep third-party scripts to GA4 only, loaded after the page.

---

## 9. Prioritized development roadmap for tomorrow

Each item has its effort and whether it needs anyone. Only one thread writes site files: **the build thread** builds these into Jeremy's folder, and Jeremy commits and Syncs. **Show Jeremy screenshots of any header, hero, footer or logo change before writing to his folder** (style guide rule).

### Priority 1: First impressions (tomorrow's session)

| # | Task | Effort | Needs |
|---|---|---|---|
| 1.1 | **Header:** Services drop-down with six photo tiles + side box; nav "Services · Homeowners · Builders · Projects · About"; social marks out of the desktop bar (keep them in the footer and phone menu); bar 104/80px; keyboard and Esc support; the phone menu gets the service list | Medium | Jeremy approves screenshots |
| 1.2 | **One CTA label:** "Get an Estimate" everywhere (→ "Get a Free Estimate" if Joey confirms) | Easy | Joey for "Free" |
| 1.3 | **Hero, Concept C:** where line, plain subhead, lighter overlay, proof card linking to the East Ridge project, phone layout with both buttons above the fold | Medium | Jeremy approves screenshots; Joey approves the subhead wording |
| 1.4 | **Service strip** under the hero (desktop strip, phone chips) | Easy | |
| 1.5 | **How it works** on home (reuse the component) | Easy | Joey's wording for step 3 |
| 1.6 | **About page + Meet Joey block,** built and hidden by `launchMode` until filled | Easy to medium | Joey's photo and words to go live |
| 1.7 | Tablet hero (overlay layout from 700px, or capped buttons) | Easy | |

### Priority 2: Website quality

| # | Task | Effort | Needs |
|---|---|---|---|
| 2.1 | Whole-card links, hover polish, who-card alignment | Easy | |
| 2.2 | Eyebrow labels on section titles and page titles ("Chattanooga, TN" on service pages) | Easy | |
| 2.3 | Photo consistency pass (levels, white balance, verticals) via the build script, checked by eye | Medium | Jeremy's OK to amend the "no grading" rule |
| 2.4 | Service area clean-up (one list, synced to schema) + "Where we've worked" map from GPS (static SVG, no map service) | Medium | Joey confirms the town list |
| 2.5 | Related-services row on each service page | Easy | |
| 2.6 | Re-run the checks: 390/820/1440/1920 screenshots, axe on every page, Lighthouse mobile 90+ | Easy | |

### Priority 3: Google readiness

| # | Task | Effort | Now / wait |
|---|---|---|---|
| 3.1 | Workspace billing card before 2026-11-11 | Jeremy, 5 min | **Now** |
| 3.2 | GA4 property + Measurement ID → build thread wires the events | Easy | Now (Jeremy's account action) |
| 3.3 | robots.txt `/lp/` fix; `areaServed` clean-up | Easy | Now |
| 3.4 | GBP content pack + review kit (docs, nothing submitted) | Easy | Now |
| 3.5 | Bing Webmaster import | Jeremy, 5 min | Optional, now |
| 3.6 | Wire the GBP link, complete the profile, start reviews | Easy | **Wait for the appeal** |
| 3.7 | Citations (Apple, Bing Places, Nextdoor…) | Easy | **Wait** for reinstatement + a permanent phone number |

### Priority 4: SEO launch preparation

| # | Task | Effort | Needs |
|---|---|---|---|
| 4.1 | FAQ + "what affects the price" on each service page | Medium (spread over sessions) | Joey's answers |
| 4.2 | Hamilton County driveway-culvert section on the Drainage page | Easy | Joey confirms he does county ROW culvert work and pulls permits |
| 4.3 | Shed pad sizing + gravel vs concrete on the Pads page | Easy | Joey's numbers |
| 4.4 | First helpful article (culverts or shed prep) | Medium | Joey's input and photos |
| 4.5 | Review Search Console queries at 3 to 4 weeks; adjust titles | Easy | Time |
| 4.6 | Town pages for East Ridge / Sequatchie County / Harrison | Medium | 2 to 3 real jobs each |

**Suggested order for the first session:** 1.2 → 1.1 → 1.3 + 1.4 → screenshots to Jeremy → 1.5 → 1.6 (hidden) → 2.1 → 2.2 → checks. If time remains: 3.3 and 2.5.

---

## 10. Missing business information (questions for Joey)

These are the answers that unlock most of the plan. They're grouped so Jeremy can text them to Joey.

**Trust (biggest impact)**
1. Can we show your **name and a photo of you** on the site? Can you write 3 or 4 sentences about how you got into this work?
2. **How many years** have you been doing excavation and sitework? (The LLC dates from January 2020. Is that when TVIS started doing this work, or earlier?)
3. **Licence:** do you hold a Tennessee **home improvement licence** or a **contractor licence**? Hamilton, Bradley and Marion counties require a home improvement licence for residential jobs over $3,000 and under $25,000, and driveways are specifically named. Jobs of $25,000+ need a state contractor licence. Sources: [TN home improvement requirements](https://tn.gov/commerce/regboards/hi/home-improvement-licensing-requirements.html), [counties that adopted it](https://tn.gov/commerce/regboards/hi/county-information-adopting-the-home-improvement-law.html), [TN contractor licence](https://tn.gov/commerce/regboards/contractor/license-requirements.html).
4. **Insurance:** do you carry general liability insurance? May we say "Insured"?
5. **Past customers** who'd leave a Google review once the profile is back? Any builders who'd let us name them as clients?

**How the business works**
6. Are **estimates free**? Do you come out to look, or estimate from photos first?
7. **Hours** and how fast you usually call back.
8. **Equipment:** which machines and trucks do you run (make and size)? Can you haul your own gravel or materials?
9. **Smallest job** you'll take? Any job you don't take?
10. Do you pull **permits** (for example Hamilton County right-of-way permits for driveway culverts) and call **Tennessee 811** before digging?
11. Any **guarantee** you're comfortable stating (for example "If something we did isn't right, we come back and fix it")?
12. Payment methods? Financing (only if real)?

**Area and contact**
13. Confirm the **town list** (section 6.8). Which North Georgia towns? Collegedale? Lookout Mountain?
14. Is **423-618-3112** permanent? If it's going to change, change it *before* the Google profile is completed and before any directory listings.
15. Will the number ever take **texts**? Many competitors offer "Call or Text".
16. Instagram account?

**Photos**
17. Can Joey do the shot list in section 4.6 on his next job (especially the golden-hour wide shot, his portrait and matched before/after pairs)?

---

## Appendix: files and evidence

- **Screenshots and mockups:** `/mnt/project-files/tvis-research/mockups/`
  - Current site: `current-desktop.png`, `current-tablet.png`, `current-phone.png`
  - Concepts: `concept-a.png` … `concept-d.png`, `header-mega.png`, `mobile-c.png`
  - The drawing source is in `source/` (`gen.py` writes the concept HTML; it expects `fonts/` and `img/` copied from the repo).
- **Earlier research (not repeated here):** `/mnt/project-files/tvis-design/competitors.md` and `practices.md` (2026-10-28).
- **Photo library and playbook:** `/mnt/project-files/tvis-photo-library/`
- **Google appeal steps:** `/mnt/project-files/tvis-gbp/APPEAL-STEPS.md`
- **Repo state reviewed:** `jsglisson3/TVIS-Site-Work-and-Construction` at commit `88f40b0` (2026-11-02 06:28 UTC).
