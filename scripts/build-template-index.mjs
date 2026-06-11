// Scans public/templates/*.html and writes index.json: [{ id, name, file }].
// Runs at build time (and dev) so the Notification Presets list always reflects
// whatever .html files are present.
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'public', 'templates');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.html$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const files = readdirSync(TEMPLATES_DIR)
  .filter((f) => f.toLowerCase().endsWith('.html'))
  .sort();

const index = files.map((file) => ({
  id: slugify(file),
  name: file.replace(/\.html$/i, ''),
  file,
}));

writeFileSync(
  join(TEMPLATES_DIR, 'index.json'),
  JSON.stringify(index, null, 2) + '\n',
);

console.log(`build-template-index: wrote ${index.length} templates to index.json`);
