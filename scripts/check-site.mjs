import { readdir, readFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const files = (await walk('dist')).filter((f) => f.endsWith('.html'));
const titles = new Set();
const descriptions = new Set();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file}: one H1`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title && !titles.has(title), `${file}: unique title`);
  titles.add(title);
  const description = html.match(
    /<meta name="description" content="([^"]+)"/,
  )?.[1];
  assert(
    description && !descriptions.has(description),
    `${file}: unique description`,
  );
  descriptions.add(description);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/resolvejunksolutions.com/,
  );
  const schema = html.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s,
  )?.[1];
  assert(schema, `${file}: schema`);
  JSON.parse(schema);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    let target = decodeURIComponent(match[1]);
    if (target === '/') target = '/index.html';
    const destination = path.join('dist', target);
    let found = false;
    for (const candidate of [
      destination,
      path.join(destination, 'index.html'),
    ]) {
      try {
        if ((await stat(candidate)).isFile()) found = true;
      } catch {}
    }
    assert(found, `${file}: broken link ${target}`);
  }
  if (
    file.includes('service-area/') &&
    !file.endsWith('service-area/index.html')
  )
    assert.match(html, /index,follow/);
  assert(!/tel:"|mailto:"|lorem ipsum|#1 junk/i.test(html));
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, 28);
assert(
  sitemap.includes('https://resolvejunksolutions.com/service-area/manheim-pa'),
);
assert(sitemap.includes('https://resolvejunksolutions.com/terms'));
assert(!sitemap.includes('workers.dev'));
assert.equal((await readFile('dist/favicon.ico')).readUInt16LE(2), 1);
assert((await readFile('dist/favicon.ico')).byteLength > 100);
const manheim = await readFile(
  'dist/service-area/manheim-pa/index.html',
  'utf8',
);
assert.match(manheim, /<h1[^>]*>Junk removal in Manheim, PA<\/h1>/);
assert.match(manheim, /name="zip"/);
assert.match(manheim, /Single items from \$125/);
assert.match(manheim, /717-742-0722/);
assert.match(manheim, /Garage cleanouts/);
assert.match(manheim, /Basement cleanouts/);
assert.match(manheim, /class="town-service-grid"/);
assert.equal((manheim.match(/class="town-service-grid"/g) || []).length, 1);
assert.equal((manheim.match(/<details\b/g) || []).length, 6); // mobile nav + five town FAQs
assert(!manheim.includes('We do not maintain a separate office'));
for (const slug of [
  'lancaster-pa',
  'willow-street-pa',
  'lititz-pa',
  'manheim-pa',
  'mount-joy-pa',
  'elizabethtown-pa',
  'ephrata-pa',
  'columbia-pa',
  'millersville-pa',
  'strasburg-pa',
  'denver-pa',
]) {
  const html = await readFile(`dist/service-area/${slug}/index.html`, 'utf8');
  assert.match(html, /class="[^"]*\btown-hero\b[^"]*"/);
  assert.match(html, /class="town-service-grid"/);
  assert.match(html, /class="[^"]*\btown-local-intro\b[^"]*"/);
  assert.match(html, /class="[^"]*\btown-nearby\b[^"]*"/);
  assert.match(html, /class="[^"]*\btown-closing\b[^"]*"/);
  assert.equal((html.match(/class="town-service-grid"/g) || []).length, 1);
  assert.equal((html.match(/<details\b/g) || []).length, 6); // mobile nav + five town FAQs
}
console.log(
  `PASS: ${files.length} HTML pages: unique metadata, one H1, valid JSON-LD, local links/assets, service-area template and production-only sitemap.`,
);
