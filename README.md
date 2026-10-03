# Resolve Junk Solutions

Lean Astro + TypeScript static website for a Lancaster County junk removal business. No React runtime, CMS, external font requests, trackers, or invented reviews. The original repository contained only a README.

## Run locally

Node 22.12+ (developed with Node 24), npm:

```sh
npm ci
npm run dev
```

For request email delivery through Cloudflare Workers and Resend, follow [RESEND-SETUP.md](RESEND-SETUP.md). Use `npm run build:worker` and deploy the Worker config; a static-only upload cannot deliver email.

`npm run dev` builds the connected site and runs Cloudflare locally at http://localhost:8787 using `.dev.vars`. Restart after frontend or secret changes. Use `npm run dev:frontend` for the frontend-only Astro preview. Build with `npm run build`; deploy the `dist/` directory to a static host that serves directory index files and `404.html`. Configure HTTPS, the canonical apex domain, and www → apex redirects in the host. No deployment has been performed.

```sh
npm test               # lead adapter and photo validation
npm run build          # Astro/TypeScript checks + static output
npm run check:site     # metadata, schema, internal links and sitemap
npm run test:browser   # Chrome: responsive, axe accessibility and navigation
```

Browser tests use installed Google Chrome and a local server. The redesign has passed responsive/axe checks at 375, 768, and 1440 pixels, ZIP-to-review navigation, retained answers, and mobile keyboard navigation. Screenshots are in `artifacts/`. Lighthouse and real-world Core Web Vitals have not been measured.

## Structure

- `src/data/business.ts`: identity, PRE_LAUNCH_MODE, contact fields, future feature slots, load categories.
- `src/data/services.ts`: nine service guides with item examples, preparation, access, and restrictions.
- `src/data/locations.ts`: eleven candidate communities with different project guidance. All unconfirmed, `noindex`, omitted from sitemap. These are provisional pages, not a completed local SEO campaign.
- `src/data/faqs.ts`: useful answers plus `needsConfirmation` policy flags.
- `src/layouts/Layout.astro`: navigation, footer, metadata, schema, analytics hooks.
- `src/components`: reusable CTAs, cards, illustration/photo slot, FAQ and lead form.
- `src/lib/leads.ts`: submission boundary; replace or connect to Resolve Operation.
- `src/lib/seo.ts`: canonical URL and linked entity schema.
- `src/pages`: statically rendered routes, sitemap and robots.
- `LAUNCH-CHECKLIST.md`: required owner facts and release checks.
- `LEAD-INTEGRATION.md`: endpoint contract and server responsibilities.

## Routes

`/`, `/services`, `/pricing`, `/about`, `/service-area`, `/contact`, `/privacy`, `/terms`, custom 404, nine `/services/[slug]` pages, eleven provisional `/service-area/[slug]` pages. XML sitemap includes only indexable pages. No residential address or separate city offices are invented.

## Pre-launch and live mode

Production copy is the default. Set `PRE_LAUNCH_MODE=true` only for an intentional pre-launch build; `npm run build:worker` defaults it to false and connects the same-origin lead endpoint. Unconfirmed city pages remain provisional independently of launch mode.

The public phone and email are configured in `src/data/business.ts`. Contact and footer links use the configured number; `SHOW_PHONE_CTA=false` controls prominent mobile call actions and can be enabled centrally later.

A missing lead endpoint renders an unavailable-build notice and disabled submit button. The production Worker build sets `/api/leads`, which validates submissions server-side and sends the internal request email through the existing Resend integration. Without that Worker and its runtime configuration, no submission is accepted.

## Photography and future features

The branding uses the owner-supplied SVG, with orange/black/white variants and horizontal lockups. The truck and garage assets are illustrative placeholders; public image disclosures were removed at the owner’s request during the pre-launch content pass. They are not evidence of actual fleet or customer jobs. See `DESIGN-ASSETS.md` for sources and prompts. Replace the placeholders with original photography by importing a file from `src/assets/` and passing `src` and descriptive `alt` to `Photo.astro`. Astro generates responsive WebP sizes with dimensions. Choose appropriate alt text for the actual photo. The current placeholder dimensions prevent layout shifts; review cropping on replacement. Do not use staff or review imagery that misrepresents the business.

Review/gallery/booking slots exist in business config; render only real verified content once available. No empty testimonial carousel is shipped. `public/social-card.png` is a designed text graphic; regenerate with `node scripts/social-card.mjs` if branding changes.

## SEO and measurement

Each page has a unique title/description, canonical, social metadata, one H1, semantic content, and linked JSON-LD. Pre-launch uses Organization and WebSite; live mode adds LocalBusiness and service entities without fabricating address, hours, pricing or ratings. Schema validity does not guarantee Google rich-result eligibility. FAQs are visible HTML; no FAQ rich-result markup is included. Google retired that feature in 2026: https://developers.google.com/search/updates#june-2026

AI-search preparation uses clear business/service relationships and useful answers, not hidden crawler text or ranking promises. Candidate location content needs verified local service/access details before indexing, even after coverage is confirmed.

`resolve:analytics` CustomEvents expose quote, phone, email, form-start, form-step, successful-submission, photo-count, service-page, and location-page events without submitted personal data. A Cloudflare Web Analytics beacon is prepared but loads only when `PUBLIC_CF_WEB_ANALYTICS_TOKEN` is supplied at build time; it measures visits/performance, while a separate provider is needed to collect business interaction events. Configure Search Console outside the codebase.

## Guided quote redesign

The homepage ZIP form opens a five-step intake. `src/lib/quote-wizard.ts` handles navigation, per-step validation, photo previews/removal, review/edit, and delivery states. `src/data/intake.ts` centralizes option values and priority rules. `src/lib/pipeline.ts` is a server-side integration helper for explainable follow-up priority, not a live CRM connection. See `LEAD-INTEGRATION.md` for the multipart/structured intake contract.
