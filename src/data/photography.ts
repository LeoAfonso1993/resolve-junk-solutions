import type { ImageMetadata } from 'astro';
import truckAndTrailer from '../assets/resolve-truck-and-trailer.png';
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
  hero: {
    src: truckAndTrailer,
    alt: 'Resolve Junk Solutions branded red pickup truck and black dump trailer parked outside a home.',
  },
  service: { src: undefined, alt: '' },
};
