// Import photos from the TVIS Facebook page into photos/facebook/ as website assets.
// Usage: node scripts/fb-import.mjs <list.tsv>
// Each TSV line: <fbid> <TAB> <post date YYYY-MM-DD> <TAB> <full-size image URL from the photo page, or a local file already downloaded>
// Saves photos/facebook/<date>_fb<fbid>.jpg, re-encoded by sharp so all metadata (EXIF, GPS) is dropped.
// Files that already exist are skipped. Steps and the processed-post log: photos/facebook/README.md.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const list = process.argv[2];
if (!list) { console.error('Usage: node scripts/fb-import.mjs <list.tsv>'); process.exit(1); }
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'photos', 'facebook');
fs.mkdirSync(outDir, { recursive: true });

for (const line of fs.readFileSync(list, 'utf8').split(/\r?\n/)) {
  const [id, date, url] = line.split('\t');
  if (!id || !url) continue;
  const out = path.join(outDir, `${date}_fb${id}.jpg`);
  if (fs.existsSync(out)) { console.log('skip (have it)', path.basename(out)); continue; }
  let buf;
  if (/^https?:/.test(url)) {
    const res = await fetch(url);
    if (!res.ok) { console.error('failed', id, res.status); continue; }
    buf = Buffer.from(await res.arrayBuffer());
  } else buf = fs.readFileSync(url); // a file already downloaded
  await sharp(buf).rotate().jpeg({ quality: 88, mozjpeg: true }).toFile(out); // no withMetadata(): strips EXIF/GPS
  console.log('saved', path.basename(out));
}
