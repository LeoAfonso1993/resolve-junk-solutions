# Launch and post-launch checklist

## Before accepting inquiries

- [ ] Confirm business phone/email and monitored privacy contact in `src/data/business.ts`.
- [ ] Confirm the November 2026 launch window; do not invent a specific day.
- [ ] Connect `PUBLIC_LEAD_ENDPOINT`, revalidate on the server, persist requests/photos, and test actual delivery. The current disconnected form is explicitly a planner preview.
- [ ] Confirm accepted/restricted materials, handling, quote terms, payment methods, hours, and disposal/donation/recycling policies.
- [ ] Review flagged FAQ answers and pricing methodology. Do not publish unconfirmed rates or same-day promises.
- [ ] Deploy the reviewed static build. Check preview responses include `X-Robots-Tag: noindex`; production must not inherit that header. `public/_headers` applies to Cloudflare static asset responses. Custom Worker/SSR responses need equivalent headers in their handler.
- [ ] Keep robots crawling allowed so crawlers can see the noindex directive. Check apex/www HTTPS redirects without redirecting local development or preview to production.

## Launch day

- [ ] Set build environment `PRE_LAUNCH_MODE=false`, rebuild, then deploy. This changes CTAs, launch messaging, timing choices, service metadata and schema.
- [ ] Run `npm run build`, `npm test`, `npm run test:launch`, `npm run check:site`, and `npm run test:browser`.
- [ ] Confirm coverage city by city. Set `confirmed` only for actual coverage; set `contentReady` separately after verified local content review. Both are required for sitemap/indexing eligibility.
- [ ] Confirm business hours, phone links and email. Perform one real mobile inquiry and verify receipt in the actual destination.
- [ ] Verify production canonical, Open Graph, schema and sitemap URLs use `https://resolvejunksolutions.com`.
- [ ] Review remaining provisional material/pricing/coverage policies; changing launch mode does not invent missing facts.

## Photography

- [ ] Import original images in `src/data/photography.ts` and set the appropriate `src` and factual `alt`.
- [ ] `owner`: Leo beside the truck; replaces homepage brand panel and About owner placeholder.
- [ ] `family`: real family/truck photo with permission; replaces About family concept.
- [ ] `hero`: actual truck/equipment photography; preserve readable hero cropping at mobile/desktop widths.
- [ ] `service`: real service imagery with permission; replace the illustrative garage image.
- [ ] Add actual job and paired before/after photography only when available. Do not present the existing AI concepts as completed work.
- [ ] Concept labels disappear only when the associated original image is supplied. Review crops, alt text and image dimensions after replacement.

## Post-launch SEO and measurement

- [ ] Connect the legitimate service-area Google Business Profile; never add a private home address to site schema just for rich results.
- [ ] Verify Search Console, submit `/sitemap.xml`, inspect production indexing and preview exclusion.
- [ ] Add verified local operating information to city pages before approving indexability. All eleven current city pages are provisional.
- [ ] Collect and publish legitimate reviews with source/permission; avoid self-serving aggregate ratings.
- [ ] Connect consent-aware analytics to existing events, verify events contain no contact data, then assess ZIP-to-inquiry completion and real lead quality.
- [ ] Measure deployed mobile Lighthouse and real-world Core Web Vitals. Local automated checks are not field performance evidence.
- [ ] Review search queries, coverage and conversion data before adding pages or lengthening copy.

## Resolve Operation

- [ ] Confirm the actual API contract and authentication. No API was assumed or implemented in this review.
- [ ] Map website inquiry → lead → customer match/create → private photo attachments → source `website` → follow-up/estimate/scheduling.
- [ ] Keep any credentials server-side, enforce validation/rate limits/file checks and idempotency, and return a durable receipt.
- [ ] Adapt `src/lib/leads.ts` or a backend mapping layer; do not rebuild the form UI.
- [ ] Verify retry, duplicate submission, rejection, timeout and attachment failure handling against the real API. See `LEAD-INTEGRATION.md`.
