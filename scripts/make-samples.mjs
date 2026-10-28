// Renders the drawn cross-sections into the three sample project folders as JPGs, so the Projects
// gallery shows something designed until real jobs replace them. Run: node scripts/make-samples.mjs
// Delete the three "sample" folders in projects/ once real jobs exist; this script is not part of the build.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { diagram } from './diagrams.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jobs = {
  '2026-09-sample-driveway': { draw: 'driveway', files: { 'before-1': 'before', 'progress-1': 'progress', 'after-1': 'after' } },
  '2026-10-sample-shed-pad': { draw: 'pad', files: { 'before-1': 'before', 'progress-1': 'progress' } },
  '2026-08-sample-french-drain': { draw: 'drainage', files: { 'before-1': 'before', 'after-1': 'after' } },
};
for (const [folder, job] of Object.entries(jobs)) {
  const dir = path.join(ROOT, 'projects', folder);
  await fs.mkdir(dir, { recursive: true });
  for (const [name, state] of Object.entries(job.files)) {
    const svg = Buffer.from(diagram(job.draw, state));
    // crop the top of the sky off so the ground fills the gallery cards
    await sharp(svg, { density: 144 }).resize({ width: 1600 }).extract({ left: 0, top: 220, width: 1600, height: 980 }).jpeg({ quality: 86 }).toFile(path.join(dir, `${name}.jpg`));
    console.log(`  ${folder}/${name}.jpg`);
  }
}
