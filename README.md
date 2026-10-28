# TVIS Site Work and Construction website

Static website for TVIS Site Work and Construction (Chattanooga, TN), built with plain HTML, CSS and a little JavaScript, and published to GitHub Pages by a GitHub Action.

> Work in progress: the homepage is built; the other pages are next. The full guide comes with the finished site.

## Run it on your computer

Needs [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install      # once
npm run dev      # builds into dist/ and opens a preview at http://localhost:8080
```

Re-run `npm run dev` after changing anything.

## Where things live

| Path | What it is |
| --- | --- |
| `site.config.json` | Business details (phone, email, hours, towns, social links, domain, form and tracking IDs). Empty values show on the site as yellow `[PLACEHOLDERS]`. |
| `src/pages/` | One file per page. The block between the `---` lines sets the page title and search description. |
| `src/partials/` | Pieces shared by every page: header, footer, `<head>`, the dozer drawing. |
| `src/assets/` | `site.css`, `site.js`, fonts and logos. |
| `photos/site/` | Photos for fixed spots on the pages. Each gray placeholder says which file name it wants, e.g. `home-hero.jpg`. |
| `projects/` | One folder per job. These become the Projects gallery and the homepage's Recent projects. See `HOW-TO-ADD-A-PROJECT.md`. |
| `scripts/build.mjs` | The build: assembles pages, resizes photos, strips GPS data, writes `dist/`. |
| `.github/workflows/deploy.yml` | Builds and publishes to GitHub Pages on every push to `main`. |

`dist/` and `node_modules/` are generated; don't edit or commit them.
