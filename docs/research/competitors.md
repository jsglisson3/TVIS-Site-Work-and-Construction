# Competitor website research: TVIS Site Work and Construction

Researched 2026-10-28. Ten contractor sites were reviewed: six in or near Chattanooga and four strong examples from elsewhere in the US. Two more were set aside (see "Excluded / notes").

## Method and limits (read first)

- **There are no screenshots.** This session's network proxy blocks outbound connections from the container to arbitrary hosts. Playwright returned `net::ERR_TUNNEL_CONNECTION_FAILED`, and curl got `CONNECT tunnel failed, response 403` on every contractor domain, including example.com. Nothing was saved in `shots/`.
- **What a text-only read could not judge.** All findings come from WebFetch, which turns each page into text and summarises it. That means the following were **not verified** for any site:
  - visual quality: colors, type, layout density, how the hero looks
  - sticky mobile CTA bars
  - whether phone numbers are tap-to-call links (except where the link markup was visible)
  - whether a photo is real or stock, beyond what filenames, alt text and captions suggest
- **What counts as a "dated / cheap" signal here.** These are things visible in the text: placeholder copy, broken links, typos, conflicting facts. They are not visual design judgments.
- **Finding the sites was hard.** Standard WebSearch mostly returned directories such as HomeAdvisor, BBB and Procore. Extended search found the local contractor sites.

---

## Chattanooga-area sites

### 1. Badger Dirtworx: badgerdirtworx.com
- **Location:** Chattanooga, Ooltewah, Cleveland and Hamilton County, TN. The footer lists 12 towns, including Apison, Collegedale and Signal Mountain.
- **Leads with:** H1 "Excavation & Drainage Contractor in Chattanooga, TN". The subhead lists residential and commercial excavation, grading, yard drainage, augering and trenching. The CTA is "request estimate", and the phone (423-280-1170) is in the header.
- **Section order:** services (6 cards) → "We solve Yard drainage problems" → differentiators (Reliability / Efficiency / Communication) → before/after → 3 reviews → "Meet the Owner: Baker Zarzour" → estimate form.
- **Photos:** The before/after photos look like real job photos. Filenames are camera-style (`IMG_1624-scaled`), and the alt text describes the work ("disturbed yard before sod placement", "Drainage Inlet and Pipe Installation"). Service-card captions are keyword-heavy ("gravel driveways ducktown, tn").
- **Estimate ask:** A short form with Name, Email, Phone, Services (checkboxes), Additional details and Send. There is **no photo upload**. Two "CALL NOW" buttons appear mid-page.
- **Dated / cheap:**
  - The "Services" nav item links to `#`.
  - Typos: "We are you go-to excavation contractor", "REquest an Estimate", "Oitewah".
  - Reviews are undated.
  - The owner section has no photo or bio text.
  - The before/after photos sit in a 2024 upload folder.
- **Worth copying:** A homeowner-problem section ("We solve yard drainage problems") placed directly before real before/after photos, with an owner/operator message: "work directly with the owner/operator."

### 2. Trench It, LLC: trenchitchattanooga.com
- **Location:** Chattanooga, TN. It serves about 18 TN communities plus Ringgold, GA.
- **Leads with:** A problem-first hero: "Dealing with Water Leaks or Drain Problems? Call Us for Fast Fixes." The subhead is "Chattanooga's Utility and Drainage Specialists." The CTAs are "Call Now" and "Get a free estimates today" (grammar error in the original).
- **Photos:** The slider images carry Pixel-phone filenames (`PXL_2025…`), which points to real job photos. The gallery tiles have no captions and there are no before/after pairs.
- **Estimate ask:** A 7-field form: Name, Email, Phone, City, Message, **"Upload Photo/ Video"**, and a second "Upload File". The phone (423-596-1856) is a click-to-call link and appears in the header, hero and footer. The site advertises "24/7 Emergency Services."
- **Trust:** A HomeAdvisor badge, 3 named testimonials, "Licensed and Insured" (shown twice), and "over 20 years of professional experience."
- **Dated / cheap:**
  - Template placeholders are still live in both sliders: "Slide title", "Write your caption here", "Button".
  - The first service card's image label ("Gas & Power Line Installation") doesn't match its heading (Water Line Repair).
  - The footer hours (8–5 Mon–Sun) conflict with the 24/7 claim.
  - "Oolteway, TN" is misspelled.
  - The "Services" nav item links to `#`.
  - The meta keywords include "Emergency Plumbing".
- **Worth copying:** Photo **and video** upload directly on the estimate form, plus a hero that names the customer's problem instead of the company.

### 3. L & S Excavation: landsexcavation.com
- **Location:** Chattanooga, TN. It says it covers TN and North Georgia within a "30-mile radius."
- **Leads with:** "If it's dirt or concrete, it's us." The subhead is "The Greater Chattanooga area's definitive excavation & concrete crew." The CTAs are "Request an estimate", "Text Call" and "WhatsApp". A stat strip follows: "20+ years on the dirt", "100% family-run", and hours 7am–5pm.
- **Section order:** keyword ticker → stats → chat assistant ("L & S Assistant") → video reel "Equipment in motion" → services → 4-step process → photo grid "Boots, machines, results." → Facebook feed → reviews → service areas → FAQ → closing CTA.
- **Photos:** Nine grid images use generic filenames (`fb-00`…`fb-08`), probably pulled from Facebook, with **empty alt text** and no captions. The eight video tiles each appear twice.
- **Estimate ask:** There is no form on the homepage; every CTA goes to a contact page. The FAQ and process copy ask for "the address, a few photos, and what you want to build." A written estimate is promised "within a few business days" after a free site visit. Text and WhatsApp options sit next to the phone number.
- **Trust:** The header reads "4.3/5 from 6 Google reviews", but only 4 reviews are shown. 20+ years. The FAQ says they can pull simple grading or driveway permits.
- **Dated / cheap:**
  - Internal numbers conflict: "20+ service areas" against about 47 listed, and 6 reviews claimed against 4 shown.
  - The same field note is repeated three times.
  - 44 services are listed, which dilutes focus.
  - Showing a 4.3 rating from 6 reviews in the header works against them.
- **Worth copying:** Text as a first-class contact option next to the phone, and plain-language process copy telling people exactly what to send: address, photos, and what they want.

### 4. Pullen's Land Works: pullenslandworktn.com
- **Location:** Cleveland, TN (Bradley County), with Chattanooga, Athens and Knoxville listed as "Beyond Bradley County." Owner-run; the owner is a firefighter.
- **Leads with:** H1 "EXCAVATION CONTRACTOR IN CLEVELAND TN". The subhead references building "for the clay soil and rainfall Bradley County actually gets." The CTAs are "GET YOUR FREE QUOTE" (a popup) and "OUR WORK". A stat counter block follows.
- **Section order:** problem intro (pooling water, steep lots) → reviews → service deep-dives → gallery of 6 before/after pairs → cost explainer ("What excavation costs in Cleveland TN?") → benefits → 4-step process → about (founder Jack and foreman Zack) → coupons ($50 off driveway grading, $100 off dirt work, $200 off walls) → service areas → FAQ → form.
- **Photos:** The gallery captions use real job stages: "before construction", "during construction", "after completion". Some images are reused (one retaining-wall photo appears in both the services section and the gallery). Alt text follows a formula.
- **Estimate ask:** Name, Email, Phone, Address, a service dropdown (6 options) and two SMS consent checkboxes with long disclosures. **No photo upload**, although the drainage copy says "Send us a photo of your wet spot." The page promises "We respond within a few hours, usually same day."
- **Dated / cheap:**
  - The stat counters render as **"0+ Years Experience", "0% Customer Satisfaction"** in the fetched text. These are probably animation counters that never fired, but that is what a crawler (and possibly a slow phone) sees.
  - The reviews section shows a heading with no reviews.
  - The "Services" nav item links to `#`.
  - Several "View Now" buttons go to the wrong pages (Pond Excavation → Synthetic Turf).
  - Two different SMS numbers appear.
  - "Cheque" spelling, and the FAQ says credit cards are not accepted.
- **Worth copying:**
  - Local soil and terrain copy (clay, rainfall, steep lots).
  - A plain cost explainer listing what drives price: access, slope, rock, wet ground, haul distance.
  - A named owner and foreman.
  - A fixed-price promise covering conditions the team "should have caught."

### 5. Evergreen Excavation & Landscaping: evergreenexcavation.com (Chattanooga page)
- **Location:** Ocoee, TN (Polk County, east of Cleveland). It has a dedicated Chattanooga service-area page.
- **Leads with:** H1 "Excavation Contractor in Chattanooga, TN for Driveways, Grading, and Drainage". The CTAs are "Get a Free Estimate" and "View Our Services". The phone, (423) 716-1551, appears in the top bar, near the hero, in the final CTA and in the footer.
- **Content:** A services grid (Site Preparation, Land Clearing & Grading, Utility Trenching, Light Demolition), copy on ridge-and-valley terrain, a soil and drainage conditions list, nearby areas, and 6 five-star Google reviews (one from a home-inspection company). The Services menu says "Free, written estimates after we walk your property."
- **Photos:** Filenames are hashed, the same few images repeat many times, most alt text is empty, and there are no before/after pairs. Real vs stock could not be confirmed.
- **Estimate ask:** It links to `/contact/#form`. The form fields were not verified.
- **Dated / cheap:**
  - Image reuse makes it feel thin.
  - Review dates are relative ("a year ago"), so they age badly.
  - The meta description is truncated.
  - No license or insurance statement.
- **Worth copying:** A city-specific landing page whose content is genuinely local (ridge lots, soil and drainage conditions), and the line "written estimates after we walk your property." The service mix overlaps closely with TVIS.

### 6. Outdoor, Inc.: getoutdoorinc.com
- **Location:** Hixson, TN. It serves Chattanooga, Lookout Mountain, Signal Mountain, Ooltewah, Collegedale and Soddy Daisy. Landscaping-led, with excavation as one division.
- **Leads with:** A 4-slide hero carousel (landscape design → maintenance → "Land Clearing, Excavation & Site Grading" → a long mission statement). Every slide's button says "Contact Us."
- **Photos:** Numbered filenames (`144.jpg`) with a gradient overlay. Alt text is keyword-stuffed ("best landscaping company in chattanooga") and does not describe the image. No before/after.
- **Estimate ask:**
  - Form fields: First Name, Last Name, Company (optional), Email, and a "Contacting Outdoor Inc in Regard to:" dropdown.
  - The form has **no phone field and no message box**.
  - **It is disabled unless the visitor accepts the reCAPTCHA cookie.**
  - The phone link is malformed (`http://tel.1.423.618.0345`), so tap-to-call likely fails.
- **Dated / cheap:**
  - Slider controls read "Previous Previous Previous".
  - Copy says "lawncare" on a construction page.
  - An unsupported "#1 Top Landscaping Company" claim.
  - Projects menu labels link to the wrong pages ("Road Construction" → `/projects/screens-2/`).
  - No reviews on the homepage.
  - No year in the copyright.
- **Worth copying:** Very little. Mainly a lesson in what breaks: a rotating carousel that hides the excavation offer behind landscaping slides, and a form that can silently fail.

---

## Strong examples elsewhere

### 7. M4 Landworks: m4excavation.com (NW Oregon), the best example found
- **Leads with:** "Gravel Driveways, Built to Last." Subhead: "Repair • Refinishing • Installation." The CTA is "Get a Free Estimate", with the phone (503-680-7446) beside it and a **"5.0★★★★★ 100+ Reviews"** badge in the hero. A "Licensed, Bonded & Insured" badge follows, and the license number (Oregon CCB# 246110) is shown.
- **Section order:**
  - Approach: "Fix the Cause, Not Just the Surface."
  - Services, each with its own estimate CTA: repair/refinishing, new installation, **steep-driveway erosion repair**, parking lots.
  - **3 before/after sliders**, each labeled with a town (Hillsboro, Scappoose, Rainier).
  - A 10-photo gallery.
  - A 4-step process.
  - Testimonials, then FAQ, then a 16-town service area, then a closing CTA.
- **Photos:** Clearly real. Filenames include the location (`gravel-driveway-repair-warren-oregonsq.jpg`). Alt text describes the action ("Roller compacting a repaired gravel driveway in Warren, Oregon"). The equipment shown includes a skid steer, a Harley rake and a roller.
- **Estimate ask:**
  - A dedicated request page that asks for "a few photos if you have them."
  - "Call or text Curtis" (the owner, by first name).
  - Promises: "We'll reach out within 1 to 2 business days." "You'll receive a written quote within 2 business days of the site visit."
  - A "Call Us / Request Estimate" bar appears near the bottom of the page. It may be a sticky mobile bar, but this was **not verified**.
  - The form fields themselves were not visible in the fetched text.
- **Dated / cheap:** Little. The testimonials heading rendered with no review text, which may be dynamic loading. The "Prefer to text?" block had no visible link. The site domain and email domain differ.
- **Worth copying:**
  - A tight driveway-first offer.
  - Location-captioned before/after pairs.
  - Rating and license credentials in the hero.
  - A named owner you can text.
  - Explicit response-time promises.

### 8. Excavation Contractors LLC: excavationcon.com (Franklin / Middle Tennessee)
- **Leads with:** "Less water. More usable yard." Subhead: "Standing water after every rain?" The CTA is "Get an estimate ↗", which asks for "project details and photos online."
- **Photos:** The alt text describes the work in detail ("Open French drain trench beside a home, showing drainage pipe, gravel and filter fabric"). A banner is captioned "Rock-lined swales & finish grading." There are no before/after pairs and no owner photo.
- **Pricing (published):**
  - Drainage: one problem area **$1,500–$3,500**; several connected fixes $3,500–$10,000; complex work $10,000–$50,000+.
  - Grading: small area $2,000–$5,000; larger yard or pad $5,000–$20,000.
  - Labeled "not fixed quotes," reviewed October 2026.
- **Trust:** One testimonial, about culvert replacement: "Troy was the most responsive and helpful out of all the contractors I spoke to…". No license, insurance or review count is shown.
- **Dated / cheap:**
  - The phone number appears **only in the footer**, which is a real miss for phone-first homeowners.
  - Two anchors look broken (`#drainage-pricing`, `#about-us`).
  - The local guides cover only Franklin.
- **Worth copying:** Outcome-first headline copy, honest price bands that pre-qualify leads, and a 3-step "A clear next step. Not a guessing game." section.

### 9. Mann Excavation & Sitework: mannexcavationsitework.com (Danville, IN)
- **Leads with:** A "★ Veteran Owned & Operated ★" badge, then H1 "Excavation, Site Work & Land Clearing in Central Indiana." Subhead: "Excavation, grading, forestry mulching and gravel driveway work." Buttons: "Request a Free Estimate" and "Call 317-206-0414". A Google reviews line follows.
- **Photos:** Effectively one image, the hero: an excavator and skid steer on gravel (`owned-excavation-equipment.jpg`). **No job photos or before/after** on the homepage.
- **Estimate ask:** Promises "we'll get back to you within one business day." The footer says "Call or Text for Free Quote." The form fields were not visible. The FAQ gives a concrete driveway spec: about 4" of #53 limestone over a prepared base for a roughly 12×100 ft drive.
- **Dated / cheap:**
  - The review line renders as "5.050 Google reviews" (rating and count run together).
  - The service area grows from header to FAQ to footer, ending at Indianapolis.
  - "Available Now" sits next to "call to check availability."
- **Worth copying:** One clear identity badge (veteran-owned) and a concrete spec answer in the FAQ that shows know-how. The homepage also shows the risk of having no job photos: it feels generic despite good copy.

### 10. S & S Excavation: ssdirtwork.com (Kansas City, MO), gravel driveway service page
- **Leads with:** H1 "Gravel Driveway Contractor in Kansas City, MO". The CTA is phone-led: "Call us today at 816-785-1130 for a free, no-obligation estimate!" The quote form sits **directly under the hero**.
- **Estimate ask:** About 8 fields: service type (9 checkboxes), residential or commercial, name, phone, email, address or ZIP, description, and an SMS/email opt-in. No photo upload. The phone repeats after nearly every section.
- **Photos:** Only one content photo, generic. No project images.
- **Pricing:** Published, but **internally contradictory**: the table says $4–$9/sq ft installed, while the FAQ says $1.25–$2.50/sq ft and puts a 1,500 sq ft drive at $1,800–$4,000.
- **Dated / cheap:**
  - No reviews, no years in business, no license number.
  - A Gmail address in the footer.
  - The OSHA link points to the wrong subpart.
  - Duplicate nav and footer links.
  - Keyword-stuffed meta tags.
- **Worth copying:** A residential/commercial toggle on the form (it fits TVIS's homeowner-plus-builder audience) and a form placed directly under the hero. Also a lesson: publish price ranges only if they agree everywhere.

---

## Excluded / notes
- **River City Excavating (rivercityexcavatingllc.com, Chattanooga).** It showed up in search for gravel services but returned an empty JavaScript shell to the fetcher, so it could not be assessed. It sets `user-scalable=no` in the viewport tag, which blocks pinch-zoom on phones.
- **chattanoogagrading.com** is a **lead-generation site**, not a contractor. Its form asks for ZIP code only. A footer note says people in photos are "actors or models." It has many near-identical city pages and uses an 833 number. It matters because it competes with TVIS for the same search terms ("driveway gravel installation Chattanooga"), and real local photos and reviews are the clearest way to look different from it.

---

## Synthesis

### (a) What the best sites do that TVIS should copy
1. **Lead with the customer's problem or result, not the company.** Good examples:
   - "Less water. More usable yard." (Excavation Contractors LLC)
   - "Gravel Driveways, Built to Last." (M4)
   - "Dealing with … Drain Problems?" (Trench It)

   For TVIS this could be one line per top job, e.g. a washed-out gravel driveway, a soggy yard, a level pad for a shed.
2. **Show real, captioned before/after pairs named by town.** The strongest sites (M4, Badger, Pullen's) show real equipment and before/during/after stages, and caption each pair with the location. Captions like "Gravel driveway rebuild, Hixson" do double duty as local SEO and as proof.
3. **Ask for photos on the estimate form.** Trench It has a photo/video upload. M4, L&S and Excavation Contractors LLC all ask for photos. For TVIS's phone-based Facebook leads, a camera-roll upload is the single most useful field: it lets them quote drainage and driveway jobs before driving out.
4. **Keep the form short, and include a homeowner/builder choice.**
   - Suggested fields: name, phone, address or town, job type, photos, optional notes.
   - The residential/commercial toggle (S & S) fits TVIS's two audiences.
   - The form directly under the hero (S & S) reduces scrolling on phones.
5. **Make phone and text equal options, and name the owner.**
   - "Call or text Curtis" (M4); Text and WhatsApp next to the phone (L&S); "Call or Text for Free Quote" (Mann).
   - Pair this with a named owner or foreman (M4, Pullen's, Badger). People from Facebook ads want a person, not a company.
6. **State response times and what happens next.**
   - "Reach out within 1 to 2 business days"; "written quote within 2 business days of the site visit" (M4).
   - "Usually same day" (Pullen's).
   - A 3–4 step process: request → site walk → written quote → schedule.
7. **Put trust signals in the hero, with numbers and credentials.** M4 puts "5.0★ 100+ Reviews" in the hero, plus "Licensed, Bonded & Insured" and a license number. TVIS should show its real Google rating and count, its TN license or insurance status, and service towns.
8. **Write local, specific copy.** Evergreen and Pullen's mention ridge lots, clay soil and heavy rain. The cost explainers list what drives price (access, slope, rock, wet ground, haul distance), and Excavation Contractors LLC publishes honest price bands. This screens out bad-fit leads and reads as expertise. A short "what affects your driveway/drainage price" block would serve TVIS well.

### (b) Mistakes to avoid
1. **Leaving template leftovers live.**
   - "Slide title / Write your caption here / Button" (Trench It).
   - "Previous Previous Previous" (Outdoor Inc).
   - Nav "Services" → `#` (Badger, Trench It, Pullen's).

   Every competitor except M4 had at least one of these. Check every link before launch.
2. **Counters and badges that render as zeros or garbage.** "0+ Years Experience / 0% Customer Satisfaction" (Pullen's) and "5.050 Google reviews" (Mann). Use static numbers, not animated counters.
3. **Contradicting your own facts.**
   - 6 reviews claimed vs 4 shown, and 20 areas claimed vs 47 listed (L&S).
   - 24/7 claimed vs 8–5 hours (Trench It).
   - Price-per-square-foot figures that disagree (S & S).
   - Different SMS numbers (Pullen's).

   Keep one source for phone, hours, areas and prices.
4. **Hiding or breaking the phone number.**
   - Footer-only phone (Excavation Contractors LLC).
   - Malformed `tel:` link (Outdoor Inc).

   Use a real `tel:` link in the header, plus a sticky Call / Text / Estimate bar on mobile.
5. **Forms that can fail or ask the wrong things.**
   - Outdoor Inc's form has no phone field and is disabled when reCAPTCHA cookies are refused.
   - Pullen's invites "send us a photo" but has no upload field.

   Test the form on a phone, without accepting cookies.
6. **Image problems.** Avoid:
   - stock or generic equipment-only photos (Mann, S & S)
   - one photo reused across the page (Evergreen, Pullen's)
   - empty or keyword-stuffed alt text (L&S, Outdoor Inc)

   Use descriptive, honest alt text.
7. **Carousels and service sprawl.**
   - A 4-slide carousel that buries excavation behind landscaping (Outdoor Inc).
   - 44 listed services (L&S) or 16 including dumpster rental and junk removal (Trench It).

   TVIS should lead with its 3–4 most-requested homeowner jobs and give builders their own short section.
8. **Thin or dishonest trust claims.**
   - Unsupported "#1" or "definitive" claims.
   - Undated or relative-dated reviews.
   - A 4.3-from-6 rating in the header.
   - No license or insurance statement (most local sites).

   Show only what can be backed up, with real names and towns.
