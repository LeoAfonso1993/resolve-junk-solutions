import type { ImageMetadata } from 'astro';
// Import original photos from src/assets/ here, then set src + a factual alt.
// Keep alt text descriptive of the scene when adding original photographs.
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
