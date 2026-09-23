import type { ImageMetadata } from 'astro';
// Import original photos from src/assets/ here, then set src + a factual alt.
// Never remove a concept label without replacing the corresponding image.
interface OriginalPhoto {
  src?: ImageMetadata;
  alt: string;
}
export const photography: Record<
  'owner' | 'family' | 'hero' | 'service',
  OriginalPhoto
> = {
  owner: { src: undefined, alt: '' },
  family: { src: undefined, alt: '' },
  hero: { src: undefined, alt: '' },
  service: { src: undefined, alt: '' },
};
