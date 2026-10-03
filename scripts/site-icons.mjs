import sharp from 'sharp';

const source = 'public/favicon.svg';
await Promise.all([
  sharp(source).resize(32, 32).png().toFile('public/favicon-32.png'),
  sharp(source).resize(180, 180).png().toFile('public/apple-touch-icon.png'),
]);
