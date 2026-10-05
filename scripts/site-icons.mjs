import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const source = 'public/favicon.svg';
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map((size) => sharp(source).resize(size, size).png().toBuffer()),
);
const icoHeader = Buffer.alloc(6 + icoSizes.length * 16);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoSizes.length, 4);
let imageOffset = icoHeader.length;
icoImages.forEach((image, index) => {
  const entry = 6 + index * 16;
  const size = icoSizes[index];
  icoHeader[entry] = size === 256 ? 0 : size;
  icoHeader[entry + 1] = size === 256 ? 0 : size;
  icoHeader[entry + 2] = 0;
  icoHeader[entry + 3] = 0;
  icoHeader.writeUInt16LE(1, entry + 4);
  icoHeader.writeUInt16LE(32, entry + 6);
  icoHeader.writeUInt32LE(image.length, entry + 8);
  icoHeader.writeUInt32LE(imageOffset, entry + 12);
  imageOffset += image.length;
});
await writeFile('public/favicon.ico', Buffer.concat([icoHeader, ...icoImages]));
await Promise.all([
  sharp(source).resize(32, 32).png().toFile('public/favicon-32.png'),
  sharp(source).resize(180, 180).png().toFile('public/apple-touch-icon.png'),
]);
