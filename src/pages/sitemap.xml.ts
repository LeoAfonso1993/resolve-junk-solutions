import { business } from '../data/business';
import { services } from '../data/services';
import { locations, isIndexableLocation } from '../data/locations';
export function GET() {
  const paths = [
    '/',
    '/services',
    '/pricing',
    '/about',
    '/service-area',
    '/contact',
    '/privacy',
    ...services.map((s) => `/services/${s.slug}`),
    ...locations
      .filter(isIndexableLocation)
      .map((l) => `/service-area/${l.slug}`),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${new URL(p, business.url).href}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
