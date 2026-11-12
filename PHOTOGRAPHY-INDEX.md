# Photography index

The running record of every photo in the master library, where each one is used on the site, and what is still available. Update it on every photo review.

- **Master library:** `G:\My Drive\TVIS\Images` (Google Drive for Desktop). Joey adds new job photos there. It is read-only for the website work: never delete, rename, move, overwrite or reorganize anything in it. Website copies live in `photos/site/` and `projects/`.
- **Last full review:** 2026-11-03. 230 files: 173 unique photos (all looked at), 43 " (1)" duplicates Drive created, 14 videos (not reviewed yet).
- **Status of the 173:** 74 used on the site, 45 available, 21 weak (one of them the scribbled-on pad photo), 33 not usable for this site (house interiors, framing, decks and other trades, phone screenshots, site-walk reference shots).
- **Older copy:** `TVIS-20261102T004909Z-1-001/` in this folder is a 2026-11-02 download of the same library. It is git-ignored and not the source of truth.

## How to run the next review

1. List `G:\My Drive\TVIS\Images` and compare it with the catalogue below; anything not listed is new.
2. Make viewable copies in a temp folder outside Drive. These iPhone HEIC files don't open in sharp or Windows; `heic-decode` (npm) works: decode to raw pixels, then sharp to JPEG.
3. Look at each new photo; give it a category, subject and quality note, and add a row below.
4. Compare it with the photo in the spot it would fill (tables below). Recommend swaps to Jeremy; change site images only after he approves.
5. When a site photo changes, update its row here and the note in `photos/site/PICKS.txt`.

## Done in the 2026-11-03 review (Jeremy approved all four)

1. **Shed pad photo cleaned up.** `home-svc-pads` (homepage), `pads-step-2` (Homeowners and Shed & Garage Pads pages) now use the clean `IMG_6867.heic` (also `projects/2025-10-garage-pad/progress-1.jpg`). The `IMG_6867.jpg` copy in Drive has red pen marks drawn on it and must never be used. The clean file is only 1024x768; ask Joey for the full-size original if he still has it.
2. **Homepage Concrete card** is now `IMG_8183` (new concrete driveway up to two new homes). It also opens the Chattanooga concrete driveway project, which is fine.
3. **Builders concrete slider, before** is now `IMG_8425` (pour underway, mixer truck, crew from behind). `IMG_8429` had the photographer's shadow across the wet pour.
4. **Homeowners cleanup** is now `IMG_5661` (cleared, graded lot on a bright day). It also appears in the Home site prep project.

## Still open

- **Ask Joey about the stamped concrete patio** (`IMG_5062`, `IMG_5074`). If TVIS poured it, it is a good second Concrete project or the Concrete page panel.
- **Cleanup before/after is half there.** `IMG_8985`, `IMG_8986`, `IMG_8988`, `IMG_8993` are overgrown yards around one house. With "after" shots of the same views from Joey, that becomes a real cleanup project and slider.
- **Still missing from the library:** a real teardown for the Demolition page photos (the 2026-11 mobile home teardown project has one now, see below; the page photos still use land clearing), drainage before/after (standing water, then dry yard), a shed sitting on a finished gravel pad, and a compacted-gravel pad (`pads-step-3` uses `IMG_0163`, a gravel construction entrance, as a stand-in; replaced on 2026-11-09 by the Facebook gravel pad `fb122108116389532034`). Worth asking Joey to shoot these on upcoming jobs.
- **On the bench:** `IMG_3836` (clean gravel drive to a white house, unused) for Gravel Driveways or a new project; `IMG_7245`/`IMG_7246` are close cousins, so don't add more from that set.

## Home hero (2026-11-07)

The homepage hero was rebuilt and now shows **finished work only** (Jeremy turned down an "In progress" photo). Main photo `home-hero` = IMG_8482 (East Ridge hillside drive under tall pines; also hillside after-2), picked by Jeremy from six candidates. A row of three small "More finished work" photos (IMG_7070, IMG_8753, 116BADD9) was tried under it the same day and taken out by Jeremy for less clutter.

How it was picked: about 90 photos compared side by side, with full-size decodes of the strongest HEICs. Most finished-job photos put the house in the middle of the frame, so the hero photo sits on the right and fades into the dark behind the words. The other five candidates Jeremy saw, for a future change: IMG_8483 (same hillside drive, house small), IMG_3836 (white farmhouse with new gravel drive; unused anywhere, but no project page), 823cc44f (Harrison drive between two homes, stone beds), IMG_8753 (gray two-story, Chattanooga), IMG_7070 (Harrison lawn). IMG_8428 (finisher edging a fresh pour) is the strongest craft shot if an in-progress photo is ever wanted elsewhere. The mobile home teardown photos are too harsh (sun in frame) for a hero.

## Facebook photos (second source)

Joey also posts job photos on the TVIS Facebook page that aren't in Drive. New ones are saved in `photos/facebook/` (stripped of metadata, named `<post date>_fb<photo id>.jpg`). Steps for the next pull and the log of every Facebook photo already looked at are in `photos/facebook/README.md`. First pull 2026-11-04: 26 looked at, 16 saved, 10 skipped (5 already in Drive: IMG_7069, IMG_8345, IMG_8352, IMG_8429, IMG_8483).

Placed on the site 2026-11-04 (Jeremy asked for it; he commits and pushes):
- **New project `projects/2026-10-chattanooga-backyard-wall-stamped-patio/`** (Concrete): before-1 `fb122102111919532034` (covered patio before), before-2 `fb122102112177532034` (dig-out by the porch steps), progress-1 `fb122097566991532034` (excavator digging), progress-2 `fb122102112009532034`, after-1 `fb122102127279532034` (stamped patio with drain; Joey's caption says TVIS did it), after-2 `fb122102112147532034` (finished block wall). Same white house with the covered patio in every shot, but the stamped patio came from a separate post: **confirm with Joey** that it's the same job, and the month (2026-10 is the posting month; the leaves look like spring).
- **Hillside driveway project:** new progress-3 `fb122102098029532034` (gravel base before the pour; the old progress-3 and -4 became -4 and -5) and after-4 `fb122102098203532034` (finished drive beside the house).
- **Not used, on the bench:** `fb122102115807532034` and `fb122102115783532034` (graded red-clay and gravel drive in the woods; a closer look showed they read as dirt, not as the crushed-stone base `pads-step-3` needs, so that spot keeps IMG_0163), `fb122102098005532034` and `fb122102098293532034` (the hillside job already has two pour shots and two lot shots), `fb122097567753532034` and `fb122102112093532034` (the wall job, toys and an SUV in frame), and the roadside mini-excavator pair from 2026-11-03 (ask Joey what that job is).
- **Pull of 2026-11-09 (placed the same day, Jeremy asked for it):** new project `projects/2026-11-gravel-parking-pad/` (Driveways, the first Driveways job, so it also shows on Gravel Driveways; town Harrison, per Jeremy): before-1 `fb122108116359532034`, after-1 `fb122108116389532034`, both cropped to the bottom 1536x1152 to cut the sky. `pads-step-3` now uses the same after crop (was IMG_0163), with new alt text on Homeowners and Pads. Notes from the pull: A gravel parking pad beside a white house, same view before (`fb122108116359532034`: leaves over thin old gravel, a pile of new stone) and after (`fb122108116389532034`: fresh compacted crushed stone), Kubota backhoe and mini excavator in both. First real compacted-gravel pad in the library: candidate for `pads-step-3` (replacing the IMG_0163 stand-in), a Gravel Driveways before/after slider, or a small new project. Both are about 40% sky, so crop tight. Ask Joey the town and whether it's a parking pad or a drive.
- **Pull of 2026-11-11 (placed the same day, Jeremy asked for it):** new project `projects/2026-11-downtown-chattanooga-new-home-driveway/` (Concrete; town Downtown Chattanooga, per Jeremy; status In Progress): before-1 `fb122109137487532034` (trench beside the new home, top cropped), progress-1 `fb122109137535532034` (digging the trench, portrait), progress-2 `fb122109137451532034` (gravel base ready for concrete, cropped to drop a For Sale sign with a phone number). Until there is an after photo, the slider shows before-1 against progress-2. Joey's post says the concrete goes in on 2026-11-12: **when he posts the finished drive, add it as after-1 and change status to Completed.** Not finished work, so keep these off the hero.
- **Glare cleanup (2026-11-11, Jeremy asked):** every site and project photo checked for sun in frame and lens flare. Jeremy turned down tight crops ("super zoomed in, not showing the yard"), so the full frame is kept and only the sky is touched: the blown sun disc is filled with the surrounding sky colour, and on the two worst mobile home shots the white glare veil is also pulled back. Done on drainage after-2 and after-3, mobile home before-2, progress-1 and after-1, concrete driveway after-3 and after-4, and page photo svc-drainage-hero. Cropped instead: East Brainerd after-3 (a light streak down the frame, trimmed off the left) and downtown driveway before-1 (recut from the Facebook original). Left as is: final grading after-2 / svc-driveways-hero (only faint flare rays in the trees). The untouched originals stay in Drive and Facebook.
- The stamped patio answers the old "Ask Joey about the stamped concrete patio" item only partly: `IMG_5062`/`IMG_5074` in Drive are a different patio.

## Google Business Profile picks (2026-11-04)

15 photos chosen for the Google Business Profile, saved as full-size JPG copies in `C:\Users\jsgli\Desktop\TVIS Google Business Photos\` (with `PICKS.txt` giving the reason for each): IMG_8314, IMG_8428, IMG_8753, fb122102127279532034, fb122102112147532034, IMG_7070, IMG_5473, 116BADD9, IMG_6867.heic, IMG_5203, IMG_7245, IMG_4281, IMG_1175, IMG_8083, 1000035915. One or two per job across 11 jobs.

New in Drive since the last review: `joey rocks .jpg` (2048x1152, stone-edged landscape bed beside a new asphalt drive). `2a621362-1b11-4c47-b72c-b73ae168889e.jpg` is gone (only its " (1)" copy is left), and `joey rocks .jpg` is byte-for-byte identical to that copy: the same photo, renamed in Drive. The site copy (`home-homeowner`, Harrison after-4) is unaffected.

## Notes on repeats

- On the pages, each photo appears once, except `IMG_7069` (rock swale), which is used on Homeowners and on the Drainage page in two different crops, and `IMG_6867.heic` (the pad in forms), which is the homepage pad card and step 2 of the pad sequence.
- Many page photos also appear in their own project's gallery (for example the hillside driveway photos). That is expected: the project page is the full story of the job.

## Where each site photo comes from

Matched by comparing every website image against every Drive photo (crops allowed). "Match" is the similarity score; 0.78 and up was checked as the same photo.

### Page photos (`photos/site/`)

| Spot | Page | Drive original | Match |
|---|---|---|---|
| builders-concrete-after | Builders (before/after slider) | IMG_8484.HEIC | 0.93 |
| builders-concrete-before | Builders (before/after slider) | IMG_8425.HEIC | 0.88 |
| builders-final-grading-after | Builders (before/after slider) | IMG_8070.PNG | 0.83 |
| builders-final-grading-before | Builders (before/after slider) | IMG_7043.HEIC | 0.86 |
| builders-hero | builders | IMG_5203.HEIC | 0.80 |
| builders-site-prep | builders | IMG_5304.HEIC | 0.82 |
| builders-utilities | builders | 1000035893.jpg | 0.80 |
| home-band | Home | IMG_5196.HEIC | 0.86 |
| home-builder | Home | 1000035915.jpg | 0.80 |
| home-hero | Home (hero, since 2026-11-07) | IMG_8482.HEIC | same file as hillside after-2 |
| home-homeowner | Home | 2a621362-1b11-4c47-b72c-b73ae168889e.jpg | 0.91 |
| home-svc-concrete | Home | IMG_8183.HEIC | 0.85 |
| home-svc-demolition | Home | IMG_7245.HEIC | 0.82 |
| home-svc-drainage | Home, svc-drainage | IMG_5473.HEIC | 0.86 |
| home-svc-driveways | Home | IMG_1175.HEIC | 0.89 |
| home-svc-pads | Home | IMG_6867.heic | 0.82 |
| home-svc-siteprep | Home | IMG_0134.HEIC | 0.91 |
| homeowners-cleanup | homeowners | IMG_5661.HEIC | 0.86 |
| homeowners-drainage | homeowners | IMG_7069.HEIC | 0.92 |
| homeowners-driveways-after | Homeowners (before/after slider) | IMG_8483.HEIC | 0.90 |
| homeowners-driveways-before | Homeowners (before/after slider) | IMG_8353.HEIC | 0.89 |
| homeowners-hero | homeowners | IMG_7070.HEIC | 0.90 |
| lp-pads-after | Shed pad ad page (before/after slider) | Resized_20250811_145314.jpeg | 0.86 |
| lp-pads-before | Shed pad ad page (before/after slider) | Resized_20250711_121118.jpg | 0.93 |
| lp-pads-hero | lp-shed-garage-pads | 116BADD9-EC01-4F9E-A86D-EACCDC2757E1.HEIC | 0.97 |
| more-cleanup | more-services, svc-demolition-cleanup | IMG_5197.HEIC | 0.84 |
| more-demolition | more-services, svc-demolition-cleanup | IMG_4281.HEIC | 0.87 |
| more-dirt-gravel | more-services | Resized_20251104_165035.jpeg | 0.92 |
| more-hero | more-services | IMG_7246.HEIC | 0.80 |
| more-small-excavation | more-services | Resized_20251104_165127.jpeg | 0.91 |
| pads-feature | homeowners, svc-shed-garage-pads | B551ACFE-430D-43BD-A530-05A8C01A5D5F.HEIC | 0.86 |
| pads-step-1 | homeowners, svc-shed-garage-pads | Resized_20250711_121100.jpg | 0.85 |
| pads-step-2 | homeowners, svc-shed-garage-pads | IMG_6867.heic | 0.82 |
| pads-step-3 | homeowners, svc-shed-garage-pads | Facebook fb122108116389532034 (since 2026-11-09; was IMG_0163) | same file |
| pads-step-4 | homeowners, svc-shed-garage-pads | Resized_20251023_153542.jpg | 0.88 |
| svc-concrete-hero | svc-concrete | IMG_8753.HEIC | 0.89 |
| svc-concrete-panel | svc-concrete | IMG_8428.HEIC | 0.81 |
| svc-drainage-hero | svc-drainage | IMG_7069.HEIC | 0.89 |
| svc-driveways-hero | svc-gravel-driveways | IMG_8083.HEIC | 0.90 |
| svc-driveways-panel | svc-gravel-driveways | IMG_5478.HEIC | 0.88 |
| svc-pads-panel | svc-shed-garage-pads | Resized_20250816_095517.jpg | 0.91 |
| svc-siteprep-hero | svc-site-prep-excavation | IMG_4999.HEIC | 0.88 |
| svc-siteprep-panel | svc-site-prep-excavation | IMG_4997.HEIC | 0.89 |

### Project gallery (`projects/`)

| Project file | Drive original | Match |
|---|---|---|
| 2025-02-chattanooga-concrete-driveway/after-1.jpg | IMG_8183.HEIC | 0.90 |
| 2025-02-chattanooga-concrete-driveway/after-2.jpg | IMG_8753.HEIC | 0.89 |
| 2025-02-chattanooga-concrete-driveway/after-3.jpg | IMG_8184.HEIC | 0.96 |
| 2025-02-chattanooga-concrete-driveway/after-4.jpg | IMG_8185.HEIC | 0.93 |
| 2025-02-chattanooga-concrete-driveway/progress-1.jpg | IMG_4997.HEIC | 0.89 |
| 2025-05-backyard-grading/after-1.jpg | IMG_0153.HEIC | 0.92 |
| 2025-05-backyard-grading/after-2.jpg | IMG_0151.HEIC | 0.92 |
| 2025-05-backyard-grading/after-3.jpg | IMG_0163.HEIC | 0.95 |
| 2025-05-backyard-grading/progress-1.jpg | IMG_0140.HEIC | 0.87 |
| 2025-05-backyard-grading/progress-2.jpg | IMG_0134.HEIC | 0.91 |
| 2025-05-backyard-grading/progress-3.jpg | IMG_0141.HEIC | 0.91 |
| 2025-05-backyard-grading/progress-4.jpg | IMG_0136.HEIC | 0.88 |
| 2025-08-east-brainerd-two-new-homes/after-1.jpg | IMG_1179.HEIC | 0.93 |
| 2025-08-east-brainerd-two-new-homes/after-2.jpg | IMG_1156.HEIC | 0.93 |
| 2025-08-east-brainerd-two-new-homes/after-3.jpg | IMG_1174.HEIC | 0.93 |
| 2025-08-east-brainerd-two-new-homes/after-4.jpg | IMG_1175.HEIC | 0.86 |
| 2025-08-east-brainerd-two-new-homes/after-5.jpg | IMG_1178.HEIC | 0.95 |
| 2025-10-garage-pad/after-1.jpg | Resized_20251023_153410.jpg | 0.93 |
| 2025-10-garage-pad/after-2.jpg | Resized_20251023_153542.jpg | 0.88 |
| 2025-10-garage-pad/before-1.jpg | Resized_20250711_121118.jpg | 0.93 |
| 2025-10-garage-pad/progress-1.jpg | IMG_6867.heic | 0.82 |
| 2025-10-garage-pad/progress-2.jpg | Resized_20250811_145314.jpeg | 0.86 |
| 2025-10-garage-pad/progress-3.jpg | Resized_20250816_095534.jpg | 0.90 |
| 2026-02-lot-clearing/after-1.jpg | IMG_4599.HEIC | 0.84 |
| 2026-02-lot-clearing/before-1.jpg | IMG_4214.HEIC | 0.71 |
| 2026-02-lot-clearing/progress-1.jpg | IMG_4281.HEIC | 0.87 |
| 2026-02-lot-clearing/progress-2.jpg | IMG_4282.HEIC | 0.89 |
| 2026-04-lot-clearing-footings/after-1.jpg | IMG_5337.HEIC | 0.95 |
| 2026-04-lot-clearing-footings/after-2.jpg | IMG_5333.HEIC | 0.89 |
| 2026-04-lot-clearing-footings/after-3.jpg | IMG_5334.HEIC | 0.86 |
| 2026-04-lot-clearing-footings/before-1.jpg | IMG_5197.HEIC | 0.81 |
| 2026-04-lot-clearing-footings/progress-1.jpg | IMG_5204.HEIC | 0.83 |
| 2026-04-lot-clearing-footings/progress-2.jpg | IMG_5202.HEIC | 0.81 |
| 2026-04-lot-clearing-footings/progress-3.jpg | IMG_5205.HEIC | 0.82 |
| 2026-05-home-site-prep/progress-1.jpg | IMG_5661.HEIC | 0.89 |
| 2026-05-home-site-prep/progress-2.jpg | IMG_5662.HEIC | 0.87 |
| 2026-05-home-site-prep/progress-3.jpg | IMG_5663.HEIC | 0.85 |
| 2026-06-harrison-drainage-yard/after-1.jpg | IMG_7070.HEIC | 0.90 |
| 2026-06-harrison-drainage-yard/after-2.jpg | IMG_7069.HEIC | 0.94 |
| 2026-06-harrison-drainage-yard/after-3.jpg | IMG_7071.HEIC | 0.94 |
| 2026-06-harrison-drainage-yard/after-4.jpg | 2a621362-1b11-4c47-b72c-b73ae168889e.jpg | 0.91 |
| 2026-06-harrison-drainage-yard/after-5.jpg | 823cc44f-d9b5-4031-9e36-839d21db7e11.jpg | 0.87 |
| 2026-06-harrison-drainage-yard/after-6.jpg | 71c10fbf-d7c8-49ee-ad4e-93104386ce15.jpg | 0.83 |
| 2026-09-new-home-final-grading/after-1.jpg | IMG_8070.PNG | 0.83 |
| 2026-09-new-home-final-grading/after-2.jpg | IMG_8083.HEIC | 0.90 |
| 2026-09-new-home-final-grading/after-3.jpg | IMG_8090.PNG | 0.96 |
| 2026-09-new-home-final-grading/before-1.jpg | IMG_7043.HEIC | 0.86 |
| 2026-09-new-home-final-grading/before-2.jpg | IMG_7044.HEIC | 0.92 |
| 2026-09-new-home-final-grading/progress-1.jpg | IMG_7045.HEIC | 0.86 |
| 2026-10-hillside-driveway/after-1.jpg | IMG_8483.HEIC | 0.90 |
| 2026-10-hillside-driveway/after-2.jpg | IMG_8482.HEIC | 0.91 |
| 2026-10-hillside-driveway/after-3.jpg | IMG_8484.HEIC | 0.93 |
| 2026-10-hillside-driveway/before-1.jpg | IMG_8353.HEIC | 0.89 |
| 2026-10-hillside-driveway/progress-1.jpg | IMG_8314.HEIC | 0.90 |
| 2026-10-hillside-driveway/progress-2.jpg | IMG_8345.HEIC | 0.87 |
| 2026-10-hillside-driveway/progress-3.jpg | IMG_8425.HEIC | 0.77 |
| 2026-10-hillside-driveway/progress-4.jpg | IMG_8429.HEIC | 0.88 |

## Every photo in the Drive library

Status: **Used** (on the site now), **Available** (usable, not on the site), **Weak** (usable only if nothing better), **Not usable** (interiors, screenshots, carpentry or other trades, site-walk references), **Duplicate** (a " (1)" copy Drive made; the original is listed), **Video** (not reviewed yet).

| Drive file | Status | Category | Subject | Where used | Notes |
|---|---|---|---|---|---|
| 1000035893 (1).jpg | Duplicate |  |  |  | Copy of 1000035893.jpg |
| 1000035893.jpg | Used | Utilities | Trench dug across a gravel/dirt lot, mini excavator behind | spot `builders-utilities` (builders) | Good, landscape; shadows. 2048x946 |
| 1000035894 (1).jpg | Duplicate |  |  |  | Copy of 1000035894.jpg |
| 1000035894.jpg | Available | Utilities | Same trench, slightly different angle |  | Near-duplicate of 1000035893. 2048x946 |
| 1000035915.jpg | Used | Site prep | Graded lot with silt fence, excavator and worker | spot `home-builder` (Home) | Good, wide landscape. 2048x946 |
| 116BADD9-EC01-4F9E-A86D-EACCDC2757E1.HEIC | Used | Pads/slab | Finished dark board-and-batten building on slab, covered porch | spot `lp-pads-hero` (lp-shed-garage-pads) | Strong finished shot; truck at right edge. 5712x4284 |
| 2a621362-1b11-4c47-b72c-b73ae168889e (1).jpg | Duplicate |  |  |  | Copy of 2a621362-1b11-4c47-b72c-b73ae168889e.jpg |
| 2a621362-1b11-4c47-b72c-b73ae168889e.jpg | Used | Driveway/landscape | New asphalt drive with stone-edged landscape bed beside home | spot `home-homeowner` (Home); project `2026-06-harrison-drainage-yard/after-4.jpg` | Strong, clean. 2048x1152 |
| 3901490307064749172.jpg | Not usable | Other (carpentry) | New wood stairs/deck at a home |  | Not core service; portrait. 1440x1920 portrait |
| 71c10fbf-d7c8-49ee-ad4e-93104386ce15 (1).jpg | Duplicate |  |  |  | Copy of 71c10fbf-d7c8-49ee-ad4e-93104386ce15.jpg |
| 71c10fbf-d7c8-49ee-ad4e-93104386ce15.jpg | Used | Landscape/retaining | Patio steps, block retaining wall, lawn | project `2026-06-harrison-drainage-yard/after-6.jpg` | Good; trailer at right edge. 2048x1152 |
| 823cc44f-d9b5-4031-9e36-839d21db7e11 (1).jpg | Duplicate |  |  |  | Copy of 823cc44f-d9b5-4031-9e36-839d21db7e11.jpg |
| 823cc44f-d9b5-4031-9e36-839d21db7e11.jpg | Used | Driveway/landscape | Same drive and stone bed, wider, two homes | project `2026-06-harrison-drainage-yard/after-5.jpg` | Good; companion to 2a621362. 2048x1152 |
| A06B1ABC-CA9E-4739-9A68-0C685472324F.HEIC | Available | Pads/slab | Same dark building straight on |  | Strong; truck at right. 5712x4284 |
| B551ACFE-430D-43BD-A530-05A8C01A5D5F.HEIC | Used | Pads/slab | Same building wide, fresh gravel, tall pines | spot `pads-feature` (homeowners, svc-shed-garage-pads) | Strong; mailbox number may show. 5712x4284 |
| IMG_0057.HEIC | Available | Concrete | Fresh slab on a graded lot, trees behind |  | OK, portrait. 3024x4032 portrait |
| IMG_0127.HEIC | Available | Final grade | New home side, steps, bare graded dirt |  | OK. 4032x3024 |
| IMG_0134.HEIC | Used | Site prep | Graded backyard beside new home, skid steer far back | spot `home-svc-siteprep` (Home); project `2025-05-backyard-grading/progress-2.jpg` | Good. 4032x3024 |
| IMG_0136.HEIC | Used | Final grade | New craftsman home rear, graded dirt yard | project `2025-05-backyard-grading/progress-4.jpg` | Good. 4032x3024 |
| IMG_0139.HEIC | Available | Final grade | Graded yard seen from covered porch, skid steer |  | Good framing, distinctive. 4032x3024 |
| IMG_0140.HEIC | Used | Final grade | Same from porch, other angle | project `2025-05-backyard-grading/progress-1.jpg` | Near-duplicate of IMG_0139. 4032x3024 |
| IMG_0141.HEIC | Used | Final grade | Graded yard from deck, skid steer | project `2025-05-backyard-grading/progress-3.jpg` | Near-duplicate set. 4032x3024 |
| IMG_0142.HEIC | Available | Final grade | Same as 0141 |  | Near-duplicate. 4032x3024 |
| IMG_0150.HEIC | Weak | Final grade | Side yard path beside home |  | Weak, portrait. 3024x4032 portrait |
| IMG_0151.HEIC | Used | Final grade | Graded side/rear yard of new home | project `2025-05-backyard-grading/after-2.jpg` | OK. 4032x3024 |
| IMG_0152.HEIC | Available | Final grade | Graded yard around new home |  | Good. 4032x3024 |
| IMG_0153.HEIC | Used | Final grade | Graded rear yard, porch | project `2025-05-backyard-grading/after-1.jpg` | Good. 4032x3024 |
| IMG_0163.HEIC | Used | Driveway (gravel) | Gravel construction entrance, orange fencing | project `2025-05-backyard-grading/after-3.jpg` (was spot `pads-step-3` until 2026-11-09) | OK. 4032x3024 |
| IMG_0165.HEIC | Weak | Final grade | New two-story home front, graded lot; person and SUV in frame |  | Person/vehicle; avoid. 4032x3024 |
| IMG_1156.HEIC | Used | Final grade | Two new homes, graded lot, gravel; hazy sky | project `2025-08-east-brainerd-two-new-homes/after-2.jpg` | OK, lens flare. 4032x3024 |
| IMG_1174.HEIC | Used | Final grade | Blue home with new stairs, gravel | project `2025-08-east-brainerd-two-new-homes/after-3.jpg` | OK; lens flare. 4032x3024 |
| IMG_1175.HEIC | Used | Driveway (gravel) | Fresh gravel up to new blue home | spot `home-svc-driveways` (Home); project `2025-08-east-brainerd-two-new-homes/after-4.jpg` | Good. 4032x3024 |
| IMG_1178.HEIC | Used | Final grade | Two new homes from the street, graded lot | project `2025-08-east-brainerd-two-new-homes/after-5.jpg` | OK. 4032x3024 |
| IMG_1179.HEIC | Used | Final grade | Two homes rear, graded dirt | project `2025-08-east-brainerd-two-new-homes/after-1.jpg` | Good. 4032x3024 |
| IMG_1180.HEIC | Available | Final grade | Same as 1179 |  | Near-duplicate. 4032x3024 |
| IMG_2682.HEIC | Not usable | Interior (not ours) | House interior, drywall, fan |  | Not usable for sitework. 4032x3024 |
| IMG_2840.HEIC | Not usable | Interior (not ours) | House interior |  | Not usable. 4032x3024 |
| IMG_2841.HEIC | Not usable | Interior (not ours) | House interior |  | Not usable. 4032x3024 |
| IMG_2842.MOV | Video |  |  |  |  |
| IMG_2861.PNG | Not usable | Screenshot | Phone screenshot of a video, framing interior |  | Not usable. 1284x2295 portrait |
| IMG_2863.PNG | Not usable | Screenshot | Phone screenshot of a video |  | Not usable. 1284x2778 portrait |
| IMG_2864.PNG | Not usable | Screenshot | Phone screenshot of a video |  | Not usable. 1284x2778 portrait |
| IMG_3836.HEIC | Available | Driveway (gravel) | White home with new gravel drive |  | Good. 4032x3024 |
| IMG_4214 (1).HEIC | Duplicate |  |  |  | Copy of IMG_4214.HEIC |
| IMG_4214.HEIC | Used | Clearing | Wooded lot mid-clearing, burn pile | project `2026-02-lot-clearing/before-1.jpg` | OK, busy. 4032x3024 |
| IMG_4216 (1).MOV | Duplicate |  |  |  | Copy of IMG_4216.MOV |
| IMG_4216.MOV | Video |  |  |  |  |
| IMG_4279 (1).MOV | Duplicate |  |  |  | Copy of IMG_4279.MOV |
| IMG_4279.MOV | Video |  |  |  |  |
| IMG_4280 (1).MOV | Duplicate |  |  |  | Copy of IMG_4280.MOV |
| IMG_4280.MOV | Video |  |  |  |  |
| IMG_4281 (1).HEIC | Duplicate |  |  |  | Copy of IMG_4281.HEIC |
| IMG_4281.HEIC | Used | Clearing/demolition | Cleared lot, stump pile burning, excavator | spot `more-demolition` (more-services, svc-demolition-cleanup); project `2026-02-lot-clearing/progress-1.jpg` | Good. 4032x3024 |
| IMG_4282 (1).HEIC | Duplicate |  |  |  | Copy of IMG_4282.HEIC |
| IMG_4282.HEIC | Used | Clearing | Cleared lot, smoke, wide | project `2026-02-lot-clearing/progress-2.jpg` | Good. 4032x3024 |
| IMG_4599 (1).HEIC | Duplicate |  |  |  | Copy of IMG_4599.HEIC |
| IMG_4599.HEIC | Used | Clearing | Lot cleared and graded | project `2026-02-lot-clearing/after-1.jpg` | OK, dull light; replaced on Homeowners 2026-11-03. 4032x3024 |
| IMG_4603.HEIC | Available | Concrete | Polished slab inside framed building |  | Good slab shot; interior. 3024x4032 portrait |
| IMG_4604.HEIC | Available | Concrete | Slab inside framing |  | Near-duplicate set. 3024x4032 portrait |
| IMG_4606.HEIC | Available | Concrete | Slab inside framing |  | Near-duplicate set. 3024x4032 portrait |
| IMG_4607.HEIC | Available | Concrete | Slab inside framing |  | Near-duplicate set. 3024x4032 portrait |
| IMG_4611.HEIC | Available | Concrete | Slab inside framing |  | Near-duplicate set. 3024x4032 portrait |
| IMG_4871.HEIC | Weak | Site prep | Lot from porch, skid steer, debris |  | Messy, portrait. 3024x4032 portrait |
| IMG_4872.HEIC | Weak | Site prep | Lot from covered porch, skid steer, lumber |  | OK, messy. 4032x3024 |
| IMG_4997.HEIC | Used | Site prep | Two new homes on freshly graded lot, dozer | spot `svc-siteprep-panel` (svc-site-prep-excavation); project `2025-02-chattanooga-concrete-driveway/progress-1.jpg` | Good, wide. 4032x3024 |
| IMG_4999.HEIC | Used | Site prep | New home on graded lot, dozer behind | spot `svc-siteprep-hero` (svc-site-prep-excavation) | Good. 4032x3024 |
| IMG_5062.HEIC | Available | Concrete (stamped) | Covered stamped-concrete patio, retaining wall beyond |  | Good; clutter on patio. 4032x3024 |
| IMG_5074.HEIC | Available | Concrete (stamped) | Covered stamped patio along house side |  | Good; portrait. 4032x3024 |
| IMG_5196 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5196.HEIC |
| IMG_5196.HEIC | Used | Site prep/footings | Wide cleared lot with poured footings | spot `home-band` (Home) | Good. 4032x3024 |
| IMG_5197 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5197.HEIC |
| IMG_5197.HEIC | Used | Clearing | Cleared lot, big trees kept; photographer shadow | spot `more-cleanup` (more-services, svc-demolition-cleanup); project `2026-04-lot-clearing-footings/before-1.jpg` | Shadow (recut on site). 4032x3024 |
| IMG_5198 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5198.HEIC |
| IMG_5198.HEIC | Weak | Footings | Footing trench poured; photographer shadow |  | Shadow. 4032x3024 |
| IMG_5199 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5199.HEIC |
| IMG_5199.HEIC | Weak | Footings | Poured footing corner; photographer shadow |  | Shadow. 4032x3024 |
| IMG_5200 (1).JPG | Duplicate |  |  |  | Copy of IMG_5200.JPG |
| IMG_5200.JPG | Weak | Clearing | Graded strip through woods |  | Weak, small portrait. 1980x3520 portrait |
| IMG_5202 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5202.HEIC |
| IMG_5202.HEIC | Used | Footings | Poured footings close; photographer shadow | project `2026-04-lot-clearing-footings/progress-2.jpg` (cropped 2026-11-11 to drop the shadow) | Shadow cropped out. 4032x3024 |
| IMG_5203 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5203.HEIC |
| IMG_5203.HEIC | Used | Footings | Footings poured on cleared lot | spot `builders-hero` (builders) | Strong. 4032x3024 |
| IMG_5204 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5204.HEIC |
| IMG_5204.HEIC | Used | Footings | Footings, other corner | project `2026-04-lot-clearing-footings/progress-1.jpg` | Good. 4032x3024 |
| IMG_5205 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5205.HEIC |
| IMG_5205.HEIC | Used | Footings | Footings, wide | project `2026-04-lot-clearing-footings/progress-3.jpg` | Good. 4032x3024 |
| IMG_5300 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5300.HEIC |
| IMG_5300.HEIC | Available | Footings/site prep | Graded pad, worker and screed/form |  | Worker in frame. 4032x3024 |
| IMG_5301 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5301.HEIC |
| IMG_5301.HEIC | Available | Footings | Footing trench in graded pad |  | Good. 4032x3024 |
| IMG_5302 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5302.HEIC |
| IMG_5302.HEIC | Available | Footings | Footing trench corner |  | Good. 4032x3024 |
| IMG_5303 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5303.HEIC |
| IMG_5303.HEIC | Available | Footings | Footing trench |  | Similar set. 4032x3024 |
| IMG_5304 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5304.HEIC |
| IMG_5304.HEIC | Used | Footings | Footing trench corner | spot `builders-site-prep` (builders) | Good. 4032x3024 |
| IMG_5305 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5305.HEIC |
| IMG_5305.HEIC | Available | Footings | Footing trench end-on |  | Good. 4032x3024 |
| IMG_5306 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5306.HEIC |
| IMG_5306.HEIC | Available | Footings | Footing trench corner |  | Similar set. 4032x3024 |
| IMG_5307 (1).HEIC | Duplicate |  |  |  | Copy of IMG_5307.HEIC |
| IMG_5307.HEIC | Available | Footings | Pier holes in graded pad |  | OK. 4032x3024 |
| IMG_5322.MOV | Video |  |  |  |  |
| IMG_5324.MOV | Video |  |  |  |  |
| IMG_5326.HEIC | Available | Driveway (gravel) | Gravel entrance, modular units delivered |  | Tire in foreground. 4032x3024 |
| IMG_5328.HEIC | Weak | Clearing | Gravel/dirt drive through trees, vehicles |  | Weak. 4032x3024 |
| IMG_5333.HEIC | Used | Pads/footings | Modular home unit beside new footing pad | project `2026-04-lot-clearing-footings/after-2.jpg` | OK, unusual. 4032x3024 |
| IMG_5334.HEIC | Used | Pads/footings | Modular units on footings | project `2026-04-lot-clearing-footings/after-3.jpg` | OK. 4032x3024 |
| IMG_5337.HEIC | Used | Pads/footings | Modular home set on foundation | project `2026-04-lot-clearing-footings/after-1.jpg` | OK. 4032x3024 |
| IMG_5393.heic | Available | Concrete | Slab poured, walls framed on it |  | Good, portrait; was the homepage concrete card until 2026-11-03. 4284x5712 portrait |
| IMG_5473.HEIC | Used | Drainage | Mini excavator digging drainage trench in yard | spot `home-svc-drainage` (Home, svc-drainage) | Good, portrait. 3024x4032 portrait |
| IMG_5478.HEIC | Used | Driveway/culvert | Culvert under new gravel entrance; SUV | spot `svc-driveways-panel` (svc-gravel-driveways) | SUV in frame (cropped on site). 4032x3024 |
| IMG_5479.HEIC | Weak | Site prep | Silt fence, materials, truck |  | Messy. 4032x3024 |
| IMG_5660.HEIC | Weak | Clearing | Cleared strip in woods |  | Weak, portrait. 3024x4032 portrait |
| IMG_5661.HEIC | Used | Clearing/grading | Graded lot, mobile home behind | spot `homeowners-cleanup` (homeowners); project `2026-05-home-site-prep/progress-1.jpg` | Good, wide. 4032x3024 |
| IMG_5662.HEIC | Used | Clearing/grading | Graded lot beside mobile home | project `2026-05-home-site-prep/progress-2.jpg` | Good. 4032x3024 |
| IMG_5663.HEIC | Used | Clearing/grading | Graded lot, mobile home, car | project `2026-05-home-site-prep/progress-3.jpg` | OK. 4032x3024 |
| IMG_5665.HEIC | Not usable | Reference | Arm pointing, site walk |  | Not usable. 3024x4032 portrait |
| IMG_5668.HEIC | Not usable | Reference | Arm pointing, site walk |  | Not usable. 4032x3024 |
| IMG_5834.MOV | Video |  |  |  |  |
| IMG_5836.HEIC | Weak | Site prep | New house wrapped, graded dirt, debris |  | OK, messy. 4032x3024 |
| IMG_5893.HEIC | Available | Site prep | New house wrapped, front |  | OK. 4032x3024 |
| IMG_5895.HEIC | Not usable | Interior (framing) | Framing interior, distorted |  | Not usable. 4032x3024 |
| IMG_5898.HEIC | Not usable | Interior (framing) | Framing interior |  | Not usable. 4032x3024 |
| IMG_5899.HEIC | Not usable | Interior (framing) | Framing interior |  | Not usable. 4032x3024 |
| IMG_6867.heic | Used | Pads | Graded pad inside wood forms | spot `home-svc-pads` (Home); spot `pads-step-2` (homeowners, svc-shed-garage-pads); project `2025-10-garage-pad/progress-1.jpg` | Strong and clean, but small file. 1024x768 |
| IMG_6867.jpg | Weak | Pads | Same as IMG_6867.heic with red pen markup drawn on |  | Markup; never use, the .heic is the clean one. 2193x1645 |
| IMG_6894.heic | Available | Pads/forms | Forms on grass in a backyard |  | Portrait. 4284x5712 portrait |
| IMG_7039.HEIC | Weak | Final grade | New home, graded dirt, trash bag |  | Debris in foreground. 4032x3024 |
| IMG_7040.HEIC | Available | Final grade | Home side, gravel |  | OK. 4032x3024 |
| IMG_7041.HEIC | Weak | Clearing | Graded wooded lot, trash bags |  | Debris. 4032x3024 |
| IMG_7043.HEIC | Used | Final grade | New home on rough graded lot | spot `builders-final-grading-before` (Builders (before/after slider)); project `2026-09-new-home-final-grading/before-1.jpg` | Good. 4032x3024 |
| IMG_7044.HEIC | Used | Final grade | New home on rough graded lot, wide | project `2026-09-new-home-final-grading/before-2.jpg` | OK. 4032x3024 |
| IMG_7045 (1).HEIC | Duplicate |  |  |  | Copy of IMG_7045.HEIC |
| IMG_7045.HEIC | Used | Final grade | New home close, rough dirt, lumber | project `2026-09-new-home-final-grading/progress-1.jpg` | OK, debris. 4032x3024 |
| IMG_7069 (1).HEIC | Duplicate |  |  |  | Copy of IMG_7069.HEIC |
| IMG_7069.HEIC | Used | Drainage | Rock swale beside block wall, lawn; sun in frame | spot `homeowners-drainage` (homeowners); spot `svc-drainage-hero` (svc-drainage); project `2026-06-harrison-drainage-yard/after-2.jpg` | Good. 4032x3024 |
| IMG_7070 (1).HEIC | Duplicate |  |  |  | Copy of IMG_7070.HEIC |
| IMG_7070.HEIC | Used | Drainage/landscape | Finished lawn, paved drive, stone drain bed | spot `homeowners-hero` (homeowners); project `2026-06-harrison-drainage-yard/after-1.jpg` | Strong; best light in the library. 4032x3024 |
| IMG_7071 (1).HEIC | Duplicate |  |  |  | Copy of IMG_7071.HEIC |
| IMG_7071.HEIC | Used | Landscape | Finished lawn and drive; sun flare | project `2026-06-harrison-drainage-yard/after-3.jpg` | OK. 4032x3024 |
| IMG_7139.HEIC | Weak | Other | Overgrown bank, small block; blue paint |  | Weak. 3024x4032 portrait |
| IMG_7140.HEIC | Weak | Other | Same overgrown bank |  | Weak. 4032x3024 |
| IMG_7245 (1).HEIC | Duplicate |  |  |  | Copy of IMG_7245.HEIC |
| IMG_7245.HEIC | Used | Clearing | Mini excavator pushing through heavy brush | spot `home-svc-demolition` (Home) | Good, action. 4032x3024 |
| IMG_7246 (1).HEIC | Duplicate |  |  |  | Copy of IMG_7246.HEIC |
| IMG_7246.HEIC | Used | Clearing | Clearing a wooded lot, mini excavator | spot `more-hero` (more-services) | Good, action. 4032x3024 |
| IMG_7247.HEIC | Available | Clearing | Cleared path in woods |  | OK. 4032x3024 |
| IMG_7514.PNG | Not usable | Screenshot | Phone screenshot of a video (Harrison) |  | Not usable. 1284x2778 portrait |
| IMG_7515.PNG | Not usable | Screenshot | Phone screenshot of a video |  | Not usable. 1284x2778 portrait |
| IMG_7516.PNG | Not usable | Screenshot | Phone screenshot of a video |  | Not usable. 1284x2778 portrait |
| IMG_7517.PNG | Not usable | Screenshot | Phone screenshot of a video |  | Not usable. 1284x2778 portrait |
| IMG_7885.HEIC | Not usable | Other (carpentry) | Tall new deck/stairs on wrapped house |  | Not core service. 3024x4032 portrait |
| IMG_7973.HEIC | Not usable | Interior | Drywall interior |  | Not usable. 4032x3024 |
| IMG_7976.HEIC | Not usable | Interior | Drywall interior |  | Not usable. 4032x3024 |
| IMG_7977.HEIC | Not usable | Interior | Drywall interior |  | Not usable. 4032x3024 |
| IMG_7978.HEIC | Not usable | Interior | Drywall interior |  | Not usable. 4032x3024 |
| IMG_7979.HEIC | Not usable | Interior | Drywall interior |  | Not usable. 4032x3024 |
| IMG_7980.HEIC | Not usable | Interior | Drywall interior |  | Not usable. 4032x3024 |
| IMG_8041.HEIC | Available | Driveway (gravel) | New gravel drive along a cut bank |  | Good, portrait. 3024x4032 portrait |
| IMG_8047.HEIC | Available | Driveway (gravel) | Gravel drive below new homes |  | OK, portrait. 3024x4032 portrait |
| IMG_8070 (1).PNG | Duplicate |  |  |  | Copy of IMG_8070.PNG |
| IMG_8070.PNG | Used | Final grade | Finished new home, gravel drive, deck, seeded yard | spot `builders-final-grading-after` (Builders (before/after slider)); project `2026-09-new-home-final-grading/after-1.jpg` | Strong. 1284x868 |
| IMG_8075.MOV | Video |  |  |  |  |
| IMG_8076.MOV | Video |  |  |  |  |
| IMG_8077.MOV | Video |  |  |  |  |
| IMG_8078 (1).MOV | Duplicate |  |  |  | Copy of IMG_8078.MOV |
| IMG_8078.MOV | Video |  |  |  |  |
| IMG_8080.HEIC | Weak | Final grade | Graded slope, home far back |  | Weak, portrait. 3024x4032 portrait |
| IMG_8083.HEIC | Used | Driveway (gravel) | Gravel drive to new home | spot `svc-driveways-hero` (svc-gravel-driveways); project `2026-09-new-home-final-grading/after-2.jpg` | Good. 4032x3024 |
| IMG_8086.MOV | Video |  |  |  |  |
| IMG_8090.PNG | Used | Site prep | Cleared dirt pad below wooded bank, small house | project `2026-09-new-home-final-grading/after-3.jpg` | Good. 1252x885 |
| IMG_8183.HEIC | Used | Concrete | New concrete driveway up to two new homes | spot `home-svc-concrete` (Home); project `2025-02-chattanooga-concrete-driveway/after-1.jpg` | Strong. 4032x3024 |
| IMG_8184.HEIC | Used | Concrete | Concrete drive, homes, rough slope | project `2025-02-chattanooga-concrete-driveway/after-3.jpg` | OK. 4032x3024 |
| IMG_8185.HEIC | Used | Concrete | Concrete drive, homes, plastic on slope | project `2025-02-chattanooga-concrete-driveway/after-4.jpg` | OK. 4032x3024 |
| IMG_8216.HEIC | Weak | Other | Tall house rear with stairs, low angle |  | Weak. 4032x3024 |
| IMG_8273.HEIC | Not usable | Other (carpentry) | House rear with new deck, lumber |  | Not core. 4032x3024 |
| IMG_8274.HEIC | Not usable | Other (carpentry) | Same |  | Not core. 4032x3024 |
| IMG_8275.HEIC | Not usable | Other (carpentry) | Same |  | Not core. 4032x3024 |
| IMG_8308.MOV | Video |  |  |  |  |
| IMG_8314.HEIC | Used | Excavation/site prep | Mini excavator on hillside lot, two-story home | project `2026-10-hillside-driveway/progress-1.jpg` | Strong; overcast. The homepage hero until 2026-11-07 (Jeremy wants finished work only in the hero now). 4032x3024 |
| IMG_8316.HEIC | Available | Site prep | Graded lot, mini excavator, gravel, pallet |  | OK. 4032x3024 |
| IMG_8345.HEIC | Used | Site prep | Hillside lot, excavator, long shadow, road | project `2026-10-hillside-driveway/progress-2.jpg` | Shadow. 4032x3024 |
| IMG_8352.HEIC | Available | Driveway (before) | Hillside lot before the driveway |  | Good. 4032x3024 |
| IMG_8353.HEIC | Used | Driveway (before) | Same, tighter | spot `homeowners-driveways-before` (Homeowners (before/after slider)); spot `home-hero-before` (Home hero, shown for a second before the blade sweep, since 2026-11-07); project `2026-10-hillside-driveway/before-1.jpg` | Good. 4032x3024 |
| IMG_8425.HEIC | Used | Concrete | Fresh pour, mixer truck, crew | spot `builders-concrete-before` (Builders (before/after slider)); project `2026-10-hillside-driveway/progress-3.jpg` | Good. 4032x3024 |
| IMG_8427.HEIC | Weak | Concrete | Fresh pour, crew member facing camera |  | Face visible; avoid. 4032x3024 |
| IMG_8428.HEIC | Used | Concrete | Finisher edging fresh pour, mixer truck | spot `svc-concrete-panel` (svc-concrete) | Strong. 4032x3024 |
| IMG_8429.HEIC | Used | Concrete | Fresh pour, photographer shadow | project `2026-10-hillside-driveway/progress-4.jpg` | Shadow; replaced on Builders 2026-11-03. 4032x3024 |
| IMG_8482.HEIC | Used | Concrete | Finished drive to hillside home under tall pines, blue sky | spot `home-hero` (Home hero, since 2026-11-07); project `2026-10-hillside-driveway/after-2.jpg` | Strong: house centred, clear light. Jeremy's pick for the hero. 4032x3024 |
| IMG_8483.HEIC | Used | Concrete | Finished drive, curve, tall pines | spot `homeowners-driveways-after` (Homeowners (before/after slider)); project `2026-10-hillside-driveway/after-1.jpg` | Strong. 4032x3024 |
| IMG_8484.HEIC | Used | Concrete | Finished drive close | spot `builders-concrete-after` (Builders (before/after slider)); project `2026-10-hillside-driveway/after-3.jpg` | Good. 4032x3024 |
| IMG_8559.PNG | Available | Concrete | Collage of a finished concrete drive |  | Collage; don't use as a photo. 1284x899 |
| IMG_8652.HEIC | Not usable | Other (carpentry) | New covered porch/pavilion framing |  | Not core. 4032x3024 |
| IMG_8753.HEIC | Used | Concrete | Finished concrete drive up to gray two-story home | spot `svc-concrete-hero` (svc-concrete); project `2025-02-chattanooga-concrete-driveway/after-2.jpg` | Strong. 4032x3024 |
| IMG_8854.HEIC | Not usable | Other (renovation) | Worker on ladder, house siding |  | Not core. 3024x4032 portrait |
| IMG_8856.HEIC | Not usable | Other (renovation) | Workers on ladders, house rear |  | Not core. 3024x4032 portrait |
| IMG_8884.HEIC | Weak | Other | House front, debris, dumpster |  | Weak. 4032x3024 |
| IMG_8886.HEIC | Not usable | Other (carpentry) | House with new deck stairs |  | Not core. 4032x3024 |
| IMG_8985.HEIC | Available | Cleanup (before) | Overgrown brush beside a house, truck |  | Good "before" for cleanup; truck/plate check. 4032x3024 |
| IMG_8986.HEIC | Available | Cleanup (before) | Overgrown slope behind house, deck |  | Good "before". 4032x3024 |
| IMG_8988.HEIC | Available | Cleanup (before) | Brush pile beside house |  | OK "before". 4032x3024 |
| IMG_8991.HEIC | Available | Other | House gable end, blue sky |  | Not useful. 4032x3024 |
| IMG_8992.HEIC | Weak | Cleanup (before) | Dormant lawn, house on slope |  | Weak. 4032x3024 |
| IMG_8993.HEIC | Available | Cleanup (before) | Overgrown beds at house front |  | OK "before". 4032x3024 |
| IMG_9299.HEIC | Available | Site prep | New farmhouse-style home, gravel, lumber |  | OK, portrait. 3024x4032 portrait |
| IMG_9302.HEIC | Not usable | Interior (framing) | Framing interior |  | Not usable. 3024x4032 portrait |
| IMG_9303.HEIC | Not usable | Interior (framing) | Attic framing |  | Not usable. 3024x4032 portrait |
| IMG_9304.HEIC | Available | Site prep | New home front, lumber pile |  | OK, portrait. 3024x4032 portrait |
| IMG_9305.HEIC | Available | Site prep | New home, rough lot |  | OK, portrait. 3024x4032 portrait |
| IMG_9360.HEIC | Available | Landscape/retaining | Stone block wall, wheelbarrow, wet gravel |  | OK, portrait. 3024x4032 portrait |
| IMG_9361.HEIC | Available | Landscape/retaining | Same |  | Near-duplicate. 3024x4032 portrait |
| IMG_9733.MOV | Video |  |  |  |  |
| IMG_9830.HEIC | Not usable | Interior | Hallway interior renovation |  | Not usable. 4032x3024 |
| Resized_20250711_121100 (1).jpg | Duplicate |  |  |  | Copy of Resized_20250711_121100.jpg |
| Resized_20250711_121100.jpg | Used | Pads | Forms set on grass for a pad | spot `pads-step-1` (homeowners, svc-shed-garage-pads) | OK, portrait; person edge. 1093x1457 portrait |
| Resized_20250711_121118 (1).jpg | Duplicate |  |  |  | Copy of Resized_20250711_121118.jpg |
| Resized_20250711_121118.jpg | Used | Pads | Forms on grass | spot `lp-pads-before` (Shed pad ad page (before/after slider)); project `2025-10-garage-pad/before-1.jpg` | Good. 1452x1936 portrait |
| Resized_20250811_145314 (1).jpeg | Duplicate |  |  |  | Copy of Resized_20250811_145314.jpeg |
| Resized_20250811_145314.jpeg | Used | Pads/concrete | Poured slab beyond graded dirt | spot `lp-pads-after` (Shed pad ad page (before/after slider)); project `2025-10-garage-pad/progress-2.jpg` | OK, portrait. 1500x2000 portrait |
| Resized_20250816_095517 (1).jpg | Duplicate |  |  |  | Copy of Resized_20250816_095517.jpg |
| Resized_20250816_095517.jpg | Used | Pads | Walls going up on the new slab | spot `svc-pads-panel` (svc-shed-garage-pads) | OK. 1457x1093 |
| Resized_20250816_095534 (1).jpg | Duplicate |  |  |  | Copy of Resized_20250816_095534.jpg |
| Resized_20250816_095534.jpg | Used | Pads | Framing on slab, lumber | project `2025-10-garage-pad/progress-3.jpg` | OK. 2000x1500 |
| Resized_20251023_153410.jpg | Used | Pads | Finished dark building front, porch | project `2025-10-garage-pad/after-1.jpg` | Good. 696x522 |
| Resized_20251023_153422.jpg | Available | Pads | Building side and breezeway |  | OK. 410x308 |
| Resized_20251023_153542.jpg | Used | Pads | Building rear, lawn | spot `pads-step-4` (homeowners, svc-shed-garage-pads); project `2025-10-garage-pad/after-2.jpg` | Good. 696x522 |
| Resized_20251104_165035.jpeg | Used | Dirt/gravel | Skid steer spreading dirt | spot `more-dirt-gravel` (more-services) | OK, portrait. 1500x2000 portrait |
| Resized_20251104_165127 (1).jpeg | Duplicate |  |  |  | Copy of Resized_20251104_165127.jpeg |
| Resized_20251104_165127.jpeg | Used | Excavation | Mini excavator on a graded lot | spot `more-small-excavation` (more-services) | OK, portrait. 1500x2000 portrait |

## Metadata audit (2026-11-03, afternoon)

- Shipped images: all 508 files in `dist/` carry no EXIF, XMP or IPTC (no GPS, no camera data).
- Each project's month matches its photos' capture dates. Towns came from GPS in the originals during the 2026-11-02 review; the Drive copies no longer carry GPS, so towns can't be re-checked from the files.
- Fixed the same day with Jeremy's go-ahead: the Homeowners `pads-step-3` alt text described a concrete slab, but the photo is a gravel entrance; it now matches the Pads page wording.
- Re-checked the same afternoon and put back: `IMG_6867` (garage pad progress-1) and `IMG_8090` (final grading after-3). Their capture dates fit the jobs (IMG_6867 is 9 Aug 2025, two days before that slab was poured; IMG_8090 is the day after the other final-grading photos), and the earlier review placed them using GPS, which the Drive copies no longer carry. Joey can still confirm.

Second pull 2026-11-07 (Jeremy sent the photos; dates are Joey's posts of 2026-11-06):
- **New project `projects/2026-11-mobile-home-teardown/`** (Property Cleanup, so it is also the "Recent job like this" on the Demolition & Cleanup page): before-1 `fb122105896875532034` / after-1 `fb122105896815532034` (slider), (before-2 `fb122105896851532034`, the backhoe in front of the home, was taken off on 2026-11-11: Jeremy said it "does not show anything"; the slider before is the wide shot of the whole home, sun toned out), progress-1 `fb122105896893532034`, progress-2 `fb122105896827532034` (cropped), after-2 `fbnoid-cleared-lot` (cropped). Crops keep the dumpster company's sign and phone number off the site. Town unknown: ask Joey.
- **Homepage "Meet Joey"**: `photos/site/home-owner.jpg` is `fb122105881167532034` (Joey with Tom, the customer), lightly brightened, 4:3.
- **Not used:** `fb122105893143532034` (house number and people on the porch).
- **Worth a swap later:** the Demolition page and homepage demolition card still show brush clearing; `fb122105896893532034` (excavator on the debris pile) is the first real teardown shot.

