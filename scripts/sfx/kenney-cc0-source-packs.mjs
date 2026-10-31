// Kenney.nl CC0 audio packs used for UI / foley / footsteps.
// Archives are untrusted: each is extracted into its own fresh directory under .cache/sfx-sources/,
// everything except audio files and License.txt is deleted, nothing inside is ever executed,
// and the bundled license text must state CC0 before any file is used.
import fs from 'node:fs';
import path from 'node:path';
import {run} from './ffmpeg-audio-process-helpers.mjs';

export const KENNEY_PACKS = {
  'interface-sounds': {title: 'Interface Sounds (1.0)', url: 'https://kenney.nl/assets/interface-sounds'},
  'impact-sounds': {title: 'Impact Sounds (1.0)', url: 'https://kenney.nl/assets/impact-sounds'},
  'rpg-audio': {title: 'RPG Audio', url: 'https://kenney.nl/assets/rpg-audio'},
  'ui-audio': {title: 'UI Audio', url: 'https://kenney.nl/assets/ui-audio'},
};

export const KENNEY_LICENSE = 'CC0-1.0 (http://creativecommons.org/publicdomain/zero/1.0/)';
export const KENNEY_AUTHOR = 'Kenney (www.kenney.nl)';

const KEEP = /\.(ogg|wav|mp3)$|^license\.txt$/i;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

export const packDir = (sourcesRoot, slug) => path.join(sourcesRoot, `kenney-${slug}`);
export const kenneyFile = (sourcesRoot, slug, file) => path.join(packDir(sourcesRoot, slug), 'Audio', file);

/** Kenney's download button asks /download-link/<hex("assets/<slug>")> for a fresh signed URL. */
async function downloadZip(slug, zipPath) {
  const id = Buffer.from(`assets/${slug}`).toString('hex');
  const page = await fetch(KENNEY_PACKS[slug].url, {headers: {'User-Agent': UA}});
  const cookie = (page.headers.getSetCookie?.() ?? []).map(c => c.split(';')[0]).join('; ');
  const linkResponse = await fetch(`https://kenney.nl/download-link/${id}`, {headers: {'User-Agent': UA, Referer: KENNEY_PACKS[slug].url, ...(cookie ? {Cookie: cookie} : {})}});
  const {url} = await linkResponse.json();
  if (!url || !url.startsWith('https://kenney.nl/')) throw new Error(`Kenney returned no download link for ${slug}`);
  const zip = await fetch(url, {headers: {'User-Agent': UA}});
  if (!zip.ok) throw new Error(`Kenney download ${slug} failed: HTTP ${zip.status}`);
  fs.mkdirSync(path.dirname(zipPath), {recursive: true});
  fs.writeFileSync(zipPath, Buffer.from(await zip.arrayBuffer()));
}

async function extractZip(zipPath, dir) {
  try {
    await run('unzip', ['-q', '-o', zipPath, '-d', dir]);
  } catch {
    // Windows' bundled bsdtar understands zip; GNU tar from Git Bash does not, so call it by path.
    const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
    await run(tar, ['-xf', zipPath, '-C', dir]);
  }
}

function pruneToAudio(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) pruneToAudio(full);
    else if (!entry.isFile() || !KEEP.test(entry.name)) fs.rmSync(full, {force: true});
  }
}

/** Ensures every pack is present (downloading + extracting when missing) and CC0-licensed. */
export async function ensureKenneyPacks(sourcesRoot, {offline = false} = {}) {
  for (const slug of Object.keys(KENNEY_PACKS)) {
    const dir = packDir(sourcesRoot, slug);
    if (!fs.existsSync(path.join(dir, 'Audio'))) {
      if (offline) throw new Error(`missing ${dir} and --offline was given`);
      const zipPath = path.join(sourcesRoot, 'zips', `kenney-${slug}.zip`);
      if (!fs.existsSync(zipPath)) {
        console.log(`downloading Kenney ${slug}…`);
        await downloadZip(slug, zipPath);
      }
      fs.rmSync(dir, {recursive: true, force: true});
      fs.mkdirSync(dir, {recursive: true});
      await extractZip(zipPath, dir);
      pruneToAudio(dir);
    }
    const licensePath = path.join(dir, 'License.txt');
    const license = fs.existsSync(licensePath) ? fs.readFileSync(licensePath, 'utf8') : '';
    if (!/Creative Commons Zero, CC0/i.test(license)) throw new Error(`${slug}: License.txt missing or not CC0 — refusing to use`);
  }
}
