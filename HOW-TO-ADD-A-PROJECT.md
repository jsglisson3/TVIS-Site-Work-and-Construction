# How to add a project to the website

Every job gets one folder in `projects/`. The website builds the Projects page, the homepage's "Recent projects" and each project's own page from these folders. No code to touch.

## 1. Make a folder

Inside `projects/`, make a folder named **year-month-town-job**, all lowercase, with dashes:

```
projects/2026-11-ooltewah-shed-pad
```

The year and month decide the order on the page (newest first), so use the month the job happened.

## 2. Drop in the photos

Name the photos by when they were taken, numbered from 1:

```
before-1.jpg   before-2.jpg
progress-1.jpg progress-2.jpg
after-1.jpg    after-2.jpg
```

- Phone photos straight from the camera are fine, any size. The build shrinks them and removes the location data phones put in photos.
- `before-1` and `after-1` become the drag-to-compare slider. The rest show on the project's own page.
- Skip photos that show house numbers, license plates, faces or anything a customer might not want online.

## 3. Write project.txt

Make a text file called `project.txt` in the folder, with these lines:

```
title: Driveway regrade and culvert
category: Driveways
town: Ooltewah
status: Completed
featured: no
description: Washed-out ruts regraded, new culvert under the entrance, fresh crusher run on top.
```

- **category** must be exactly one of: `Driveways`, `Shed & Garage Pads`, `Drainage`, `New Construction Sitework`, `Concrete`, `Property Cleanup`, `Home Construction`.
- **status**: `Completed` or `In Progress`. Leave it blank and the site works it out: In Progress until there's an after photo.
- **featured**: `yes` pins the project to the top of the Projects page and the homepage. Use it for the best two or three.
- **description**: one or two sentences. No prices, no customer names.

## 4. Publish

Save, then in VS Code commit and push (Source Control > Commit > Sync Changes). The site rebuilds itself and the project is live in a minute or two. To see it first on your own computer, run `npm run dev` and open http://localhost:8080/projects.

## Later

- To fix a title or add photos: edit the folder and push again.
- To take a project down: delete its folder and push.
- The three folders whose titles start with "Sample:" are examples. Delete them once real projects are in.
