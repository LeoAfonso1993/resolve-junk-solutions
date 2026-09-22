import fs from 'node:fs';
import sharp from 'sharp';
const original = fs.readFileSync('public/brand/logo-original.svg', 'utf8');
const d = original.match(/\sd="([^"]+)"/)[1];
const shapes =
  '<rect x="25" y="125" width="194" height="25"/><polygon points="56,73 82,72 119,74 116,81 106,103 60,103 56,83"/><polygon points="101,59 136,59 147,62 157,71 157,90 146,102 149,104 177,69 173,67 197,57 191,79 187,74 156,114 158,119 142,119 120,89 139,86 143,78 139,72 102,72"/><rect x="26" y="156" width="25" height="5"/><rect x="192" y="156" width="25" height="5"/>';
for (const [name, base] of [
  ['light', '#151515'],
  ['dark', '#ffffff'],
]) {
  const defs = `<defs><path id="mark" d="${d}"/><clipPath id="orange">${shapes}</clipPath></defs>`;
  const art = `<g><use href="#mark" fill="${base}"/><use href="#mark" fill="#ff6200" clip-path="url(#orange)"/></g>`;
  fs.writeFileSync(
    `public/brand/logo-${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="25 26 194 138">${defs}${art}</svg>`,
  );
  fs.writeFileSync(
    `public/brand/lockup-${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 324 94">${defs}<svg x="0" y="0" width="143" height="94" viewBox="55 26 143 94">${art}</svg><svg x="154" y="29" width="170" height="35" viewBox="25 125 194 40">${art}</svg></svg>`,
  );
}
// Keep the original monogram favicon independent of logo generation.
await sharp('public/brand/lockup-dark.svg')
  .resize(800)
  .png()
  .toFile('/private/tmp/brand-lockup.png');
