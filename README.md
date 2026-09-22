# Resolve Junk Solutions

Lean Astro + TypeScript static website for a Lancaster County junk removal business. No React runtime, CMS, external font requests, trackers, or invented reviews. The original repository contained only a README.

## Run locally

Node 22.12+ (developed with Node 24), npm:

```sh
npm ci
npm run dev
```

Astro prints the local address. Build with `npm run build`; deploy the `dist/` directory to a static host that serves directory index files and `404.html`. Configure HTTPS, the canonical apex domain, and www → apex redirects in the host. No deployment has been performed.

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

`/`, `/services`, `/pricing`, `/about`, `/service-area`, `/contact`, `/privacy`, custom 404, nine `/services/[slug]` pages, eleven provisional `/service-area/[slug]` pages. XML sitemap includes only indexable pages. No residential address or separate city offices are invented.

## Pre-launch and live mode

`PRE_LAUNCH_MODE = true` is the default. It selects future-service CTAs and scheduling expectations. Set it to `false` and rebuild for active-service CTAs and schema. Review all policy flags and the launch checklist before switching. Unconfirmed city pages remain provisional independently of live mode.

Missing phone/email are omitted. Once a phone is supplied, click-to-call links appear in the footer, contact area, mobile bar and secondary CTA. Configure it with country code, e.g. the real `+1…` number. No sample number is published.

A missing lead endpoint renders a visible preview notice and disabled submit button. Nothing is delivered or saved. Launching a functioning lead-generation site requires connecting and testing a real destination; there is no fake-success or local-storage fallback.

## Photography and future features

The branding uses the owner-supplied SVG, with orange/black/white variants and horizontal lockups. The photographic truck and garage assets are clearly labeled AI concepts, not real fleet or customer-job photographs. See `DESIGN-ASSETS.md` for sources and prompts. Replace the placeholders with original photography by importing a file from `src/assets/` and passing `src` and descriptive `alt` to `Photo.astro`. Astro generates responsive WebP sizes with dimensions. Choose appropriate alt text for the actual photo. The current placeholder dimensions prevent layout shifts; review cropping on replacement. Do not use staff or review imagery that misrepresents the business.

Review/gallery/booking slots exist in business config; render only real verified content once available. No empty testimonial carousel is shipped. `public/social-card.png` is a designed text graphic; regenerate with `node scripts/social-card.mjs` if branding changes.

## SEO and measurement

Each page has a unique title/description, canonical, social metadata, one H1, semantic content, and linked JSON-LD. Pre-launch uses Organization and WebSite; live mode adds LocalBusiness and service entities without fabricating address, hours, pricing or ratings. Schema validity does not guarantee Google rich-result eligibility. FAQs are visible HTML; no FAQ rich-result markup is included. Google retired that feature in 2026: https://developers.google.com/search/updates#june-2026

AI-search preparation uses clear business/service relationships and useful answers, not hidden crawler text or ranking promises. Candidate location content needs verified local service/access details before indexing, even after coverage is confirmed.

`resolve:analytics` CustomEvents expose `quote_cta_click`, `phone_click`, `quote_form_start`, `quote_step_view`, `quote_form_submit` (confirmed receipt only), `photo_upload` (count only), `service_page_view`, and `location_page_view`. Attach a consent-aware analytics listener later. No submitted personal data is added to events. Configure Search Console outside the codebase.

## Guided quote redesign

The homepage ZIP form opens a five-step intake. `src/lib/quote-wizard.ts` handles navigation, per-step validation, photo previews/removal, review/edit, and delivery states. `src/data/intake.ts` centralizes option values and priority rules. `src/lib/pipeline.ts` is a server-side integration helper for explainable follow-up priority, not a live CRM connection. See `LEAD-INTEGRATION.md` for the multipart/structured intake contract.
