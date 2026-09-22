import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const logo = (await readFile('public/brand/lockup-dark.svg', 'utf8')).replace(
  '<svg ',
  '<svg x="70" y="42" width="360" height="104" ',
);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#151515"/>${logo}<rect x="70" y="198" width="52" height="5" fill="#ff6200"/><text x="65" y="310" font-family="Arial" font-weight="900" font-size="75" fill="white">YOU’VE GOT JUNK.</text><text x="65" y="410" font-family="Arial" font-weight="900" font-size="75" fill="#ff6200">WE’VE GOT THIS.</text><text x="70" y="530" font-family="Arial" font-size="23" fill="#dddddd">LOCAL JUNK REMOVAL · LANCASTER COUNTY, PA</text></svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/social-card.png');
