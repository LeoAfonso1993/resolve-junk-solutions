# Professional refinement review — September 22, 2026

## Audit before changes

Reviewed all page templates, nine service records, all eleven city records, shared navigation/footer, quote UI/adapter, SEO/schema, sitemap/robots, image components, CSS, analytics and existing tests. The initial seven browser tests passed. Read-only inspection of the deployed workers.dev homepage found HTTP 200, `index,follow`, a correct production canonical, and no X-Robots-Tag header. No remote deployment was performed during this pass.

**Already strong:** preserve the visual identity, typography, page layout, ZIP-first flow, service preparation/access guidance, transparent AI labels, no fabricated reviews/prices, static HTML, responsive images, self-hosted fonts and separate submission adapter.

**High priority:** preview indexing was permitted; primary CTA did not honor launch mode; expected launch and current owner service were absent; real lead delivery/phone/email remain unconfigured.

**Medium priority:** stale post-launch metadata/copy, city indexing tied to coverage alone, browser-bubble-only validation, small mobile input text, optional-timing claim in privacy copy, and repetitive related-service recommendations.

**Low priority:** centralized photo slots, social image dimensions/alt metadata and caching of hashed assets. No dependency or framework change is needed.

## Changes and purpose

- Centralized Leo Afonso's name and current Pennsylvania Air National Guard service; used accurate copy in the existing homepage owner section, About page, and compact value strip. No veteran designation, military badge, endorsement, quality guarantee or military-themed design.
- Added an expected November 2026 launch window and `Plan Your Pickup` CTAs. `PRE_LAUNCH_MODE=false` at build time switches active-service language and timing choices without changing page design. Policy uncertainty remains until separately confirmed.
- Added host-specific Cloudflare static asset `X-Robots-Tag: noindex` for workers.dev, with production canonical/OG/schema/sitemap URLs retained. No redirects or production-wide noindex rule. Added immutable caching only to hashed `/_astro/` assets.
- Added `contentReady` beside city `confirmed`; both must be true before a city enters the sitemap or permits indexing. Current provisional pages remain noindex. Updated directory status wording and made related-service links relevant to each service.
- Added persistent form/photo error text, invalid-selection removal, error recovery, safer hidden-step validation and navigation protection during sending. Mobile form inputs use 16px text to avoid automatic input zoom; photo removal and review controls have 44px minimum targets.
- Corrected privacy copy to match required timing/property/access fields. The unconfigured submission notice and disabled final send remain explicit.
- Added centralized original-photo slots while retaining existing artwork and layout. Added truthful owner entity information on About and social image metadata. Fixed JSON-LD escaping to preserve literal text safely.

## City-by-city review

| Community     | Current useful topic                                 | Remaining requirement                           |
| ------------- | ---------------------------------------------------- | ----------------------------------------------- |
| Lancaster     | Parking/loading route requested from the customer    | Confirm coverage and verified operating details |
| Willow Street | Item location and ZIP clarification                  | Confirm coverage and verified operating details |
| Lititz        | Furniture-delivery coordination                      | Confirm coverage and verified operating details |
| Manheim       | Room-by-room cleanout scope                          | Confirm coverage and verified operating details |
| Mount Joy     | Move-out timing and property access deadline         | Confirm coverage and verified operating details |
| Elizabethtown | Multiple-room scope and removal authorization        | Confirm coverage and verified operating details |
| Ephrata       | Separating appliance requirements from mixed clutter | Confirm coverage and verified operating details |
| Columbia      | Indoor removal route and stair photos                | Confirm coverage and verified operating details |
| Millersville  | Property contact and key-return deadline             | Confirm coverage and verified operating details |
| Strasburg     | Outdoor pile and vehicle access photos               | Confirm coverage and verified operating details |
| Denver        | Material type, load weight and project cleanup       | Confirm coverage and verified operating details |

These tips are useful preparation guidance, not evidence of unique local expertise. No invented neighborhoods, disposal facilities, jobs or local regulations were added. They should not be treated as finished local-search landing pages.

## Intentionally unchanged

The approved colors (including the newer orange in existing artwork), typography, logo, restored original favicon, homepage composition and effective copy remain. The brief mentions #FF6B35, while the approved redesign uses #FF6200 for principal accents; no palette replacement was made. No new marketing sections, popups, animation, rankings promises, testimonials, rates or trackers were introduced. Organization schema in pre-launch and LocalBusiness/Service schema in live mode remain conservative; no private address or invented hours are added. No FAQ rich-result markup or crawler-only content was introduced.

The ZIP-first flow remains: it captures useful service-location intent and carries it into step two without making unsupported coverage claims. No conversion uplift is claimed without actual traffic data. No aggressive CSS rewrite or dependency change was justified.

## Remaining business/deployment dependencies

Phone/email, exact operating date, hours, pricing, materials policy, service coverage, disposal arrangements, payment methods, real photography/reviews, social/Google Business Profile links and monitored lead delivery still require owner confirmation. The expected month is now known; an exact date is not assumed.

Preview protection is prepared in `public/_headers`, but will take effect only after deployment to Cloudflare static assets. If the deployed setup generates responses with Worker code, the handler must attach equivalent headers. Hosting setup is not checked into this repository, so deployed enforcement must be verified after release. The current remote preview has not been changed.

Resolve Operation integration remains an adapter contract, not a live connection. No API credentials, customer data model or endpoints were invented. See `LEAD-INTEGRATION.md` and `POST-LAUNCH-CHECKLIST.md` for the remaining mapping, delivery and storage work.

## Sources supporting deployment choices

- [Cloudflare static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/): hostname-scoped noindex and hashed-asset cache rules; custom Worker responses need their own headers.
- [Google technical indexing requirements](https://developers.google.com/search/docs/essentials/technical): allow crawling so the crawler can see noindex; robots blocking alone is not an indexing removal mechanism.

## Validation

- Build/typecheck: passed with zero errors, warnings or hints.
- Four lead/priority unit tests: passed.
- 28 generated HTML pages: unique titles/descriptions, single H1, JSON-LD parsing, production canonicals and valid internal file targets passed. All eleven provisional city pages remain excluded from sitemap.
- Isolated live-mode build: passed CTA, timing, metadata and schema transition checks; default pre-launch output and source configuration were not changed.
- Final browser checks: nine passed in the full run, including all 27 customer-facing routes at 360px and the existing 375/768/1440px checks. One copy assertion needed alignment with the current “Military Service Member” strip wording; its targeted rerun result is recorded below. Automated accessibility checks are not a substitute for a full assistive-technology audit. No Lighthouse or field Core Web Vitals score is claimed.

- Targeted owner/launch wording rerun: passed. All ten browser checks now pass across the full run and corrected targeted rerun.
