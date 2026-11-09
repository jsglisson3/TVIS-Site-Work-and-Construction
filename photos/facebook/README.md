# Photos from the TVIS Facebook page

Job photos Joey posted on the TVIS Facebook page (https://www.facebook.com/profile.php?id=61595961032699) that are **not** in the Drive library. They are website assets waiting for a spot: nothing here shows on the site until a copy goes into `photos/site/` or `projects/` (with Jeremy's OK). The build ignores this folder.

- **Names:** `<post date>_fb<photo id>.jpg`. The photo id is the `fbid=` number in the photo's Facebook address, so any file can be traced back to its post.
- **Files:** Facebook's full size (2048 x 1536), re-encoded by sharp with all metadata removed (no EXIF, no GPS).
- **What is skipped:** photos already in the Drive library (`G:\My Drive\TVIS\Images`, never touched), reposts, photos with children in them, and supplier or materials-yard shots.
- Captions are only read to work out the job or service. Post text is never copied to the site.

## How to run the next pull

No Facebook login is needed: the page's photos open one by one while signed out.

1. In the browser, open `https://www.facebook.com/profile.php?id=61595961032699&sk=photos`, close the login box, and note the photo links in the grid (`photo.php?fbid=...`).
2. Open the newest photo and step through the set with the page's "Next photo" button until it wraps around. For each one, record the `fbid`, the post date, and the full-size image address (the one `<img>` wider than 400px). The step-through can skip a photo the grid shows, so add the grid's links too.
3. Drop every `fbid` already listed in the log below. Download the rest to a temp folder.
4. Compare them with the Drive library by perceptual hash (dHash, 16x16; distance under about 20 out of 256 is the same photo; unrelated photos land around 100). HEIC files need `heic-decode`. Look at anything between 20 and 90 by eye.
5. Write a TSV (`fbid <TAB> date <TAB> image address or downloaded file`) of the keepers and run `node scripts/fb-import.mjs list.tsv`. It saves stripped copies here and skips files it already has.
6. Add every photo you looked at to the log below (kept or skipped, with the reason), and recommend spots to Jeremy against "Still open" in `PHOTOGRAPHY-INDEX.md`.

## Log of processed photos

Latest post covered: **2026-11-09**. 26 photos looked at on 2026-11-04; 8 more on 2026-11-07 (Jeremy downloaded them and sent them in, because Facebook is blocked from Claude's cloud workspace); 2 new on 2026-11-09 (pulled signed out from Jeremy's PC, where Facebook works).

About the ids: the 2026-11-06 rows use the number inside the image's file name, not the `fbid=` in the photo's address (for example address `fbid=122105894157532034` shows image `..._122105896893532034_...`). Both trace back to the same photo. From 2026-11-09 on, rows use the `fbid=` number, as the naming rule says.

Where the saved ones went on the site: "Facebook photos" in `PHOTOGRAPHY-INDEX.md`.

| fbid | Posted | Result | What it shows | Job (best guess) |
|---|---|---|---|---|
| 122108116389532034 | 2026-11-09 | Saved, used (project after-1 and pads-step-3) | After: fresh, smooth crushed-stone parking pad beside a white house, rock-edged bed, backhoe and mini excavator parked behind | Gravel parking pad, Harrison, Nov 2026 |
| 122108116359532034 | 2026-11-09 | Saved, used (project before-1) | Before, same view: thin old gravel under leaves, pile of new stone, same two machines | Same |
| 122105894061532034 (image 122105896839532034) | 2026-11-06 | Already saved as `2026-11-06_fbnoid-cleared-lot.jpg` (dHash distance 6) | Seeded and strawed lot, dumpster | Mobile home teardown |
| 122097560493532034 | 2026-10-28 | Skipped (a graphic, not a job photo) | | |
| 122105896875532034 | 2026-11-06 | Saved, used | Wide before: old mobile home, backhoe in front, mini excavator by the shed | Mobile home teardown (Joey's posts: "removal and clean up of an old mobile home", "seed and straw") |
| 122105896851532034 | 2026-11-06 | Saved, used | Backhoe parked in front of the mobile home, mini excavator behind | Same |
| 122105893143532034 | 2026-11-06 | Saved, not for the site | Before, machines and the home; two people on the porch steps and the house number on the post | Same |
| 122105896827532034 | 2026-11-06 | Saved, used (cropped) | From the backhoe seat: home half torn down, debris, mattresses, rented dumpsters (crop drops the dumpster company's sign) | Same |
| 122105896893532034 | 2026-11-06 | Saved, used | Mini excavator and backhoe on the flattened debris pile | Same |
| 122105896815532034 | 2026-11-06 | Saved, used | After: cleared lot, dumpster at the back | Same |
| (no id: Jeremy's file "s.jpg") | 2026-11-06 | Saved as `2026-11-06_fbnoid-cleared-lot.jpg`, used (cropped) | After: lot seeded and strawed, dumpster with the dumpster company's sign at the right (crop drops it) | Same |
| 122105881167532034 | 2026-11-06 | Saved, used on the homepage | Joey (right) with Tom, the customer, beside the mini excavator and debris | Same; "Meet Joey" photo `photos/site/home-owner.jpg` |
| 122102962827532034 | 2026-11-03 | Saved | Orange mini excavator on a strip of dirt along a road beside a brick building | Roadside job, Nov 2026 (ask Joey) |
| 122102962803532034 | 2026-11-03 | Saved | Same job, wider: graded dirt strip between lawn and road, machine by the building | Same |
| 122102133489532034 | 2026-11-02 | Skipped (child in photo) | Graded lot, gravel, footings | |
| 122102127279532034 | 2026-11-02 | Saved | Covered stamped-concrete patio with brick border, drain, block walls beyond | Stamped patio (caption: stamped concrete with drain) |
| 122102115807532034 | 2026-11-02 | Saved | Cleared, graded gravel area at the edge of woods | Gravel drive / pad in the woods |
| 122102115783532034 | 2026-11-02 | Saved | Graded gravel drive through the woods | Same |
| 122102112177532034 | 2026-11-02 | Saved | Backyard dug out next to porch steps, old slab | Backyard wall and patio job |
| 122102112147532034 | 2026-11-02 | Saved | Finished block retaining wall along the side of a house | Same |
| 122102112093532034 | 2026-11-02 | Saved | Block wall across the back yard, graded ground (toy and SUV in frame) | Same |
| 122102112051532034 | 2026-11-02 | Skipped (in Drive: IMG_7069) | Rock swale | |
| 122102112009532034 | 2026-11-02 | Saved | Back yard dug out, dirt pile, house beside | Backyard wall and patio job |
| 122102111919532034 | 2026-11-02 | Saved | Covered patio before: cracked concrete, brick steps, materials | Backyard wall and patio job (maybe the stamped patio's "before") |
| 122102111895532034 | 2026-11-02 | Skipped (supplier yard) | Wall blocks and drain pipe stacked in a yard | |
| 122102098323532034 | 2026-11-02 | Skipped (in Drive: IMG_8429) | Concrete pour | |
| 122102098293532034 | 2026-11-02 | Saved | New two-story home, mini excavator, gravel pile, graded lot | Hillside driveway (same post as IMG_8345/8352/8429/8483) |
| 122102098203532034 | 2026-11-02 | Saved | Finished concrete drive beside a new home with wood stairs | Hillside driveway |
| 122102098179532034 | 2026-11-02 | Skipped (in Drive: IMG_8483) | Finished drive | |
| 122102098119532034 | 2026-11-02 | Skipped (in Drive: IMG_8345) | Hillside lot | |
| 122102098089532034 | 2026-11-02 | Skipped (in Drive: IMG_8352) | Hillside lot before | |
| 122102098029532034 | 2026-11-02 | Saved | Gravel-base drive up to the new home, before concrete | Hillside driveway |
| 122102098005532034 | 2026-11-02 | Saved | Concrete pour underway, mixer truck, crew | Hillside driveway |
| 122102093763532034 | 2026-11-02 | Skipped (child in photo) | Joey on the new mini excavator | |
| 122097567753532034 | 2026-10-28 | Saved | Block wall with steps, drain pipe coil, graded yard (toy in frame) | Backyard wall and patio job |
| 122097567609532034 | 2026-10-28 | Skipped (repost of 122102112147532034) | | |
| 122097566991532034 | 2026-10-28 | Saved | Kubota excavator digging out a back yard behind a house | Backyard wall and patio job |
| 122097566979532034 | 2026-10-28 | Skipped (supplier yard) | Wall blocks and drain pipe | |
