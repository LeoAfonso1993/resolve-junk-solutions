import { business } from '../data/business';
export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${business.url}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
}
