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
    assert.match(html, /noindex,follow/);
  assert(!/tel:"|mailto:"|lorem ipsum|#1 junk/i.test(html));
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert(
  !/service-area\/[a-z]/.test(sitemap),
  'Unconfirmed cities excluded from sitemap',
);
assert.equal((sitemap.match(/<loc>/g) || []).length, 16);
console.log(
  `PASS: ${files.length} HTML pages: unique metadata, one H1, valid JSON-LD, local links and assets; sitemap excludes provisional cities.`,
);
