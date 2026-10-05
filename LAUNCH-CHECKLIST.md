# Owner facts and launch checklist

## Before public launch

- [x] Configure the public business phone and email in `src/data/business.ts`.
- [x] Configure the production Worker build to use `/api/leads`, the existing Resend sender, and `hello@resolvejunksolutions.com` as its lead destination.
- [ ] Confirm the Cloudflare production `RESEND_API_KEY` secret is present and the sender domain remains verified.
- [ ] Confirm the business inbox is monitored. Send a real request with photos and test delivery, retry, and failure paths before public launch.
- [ ] Confirm email-provider retention practices and update `/privacy` if actual handling differs from the published description.
- [x] Run the redesigned local site, browser tests and visual review on mobile/desktop. Automated axe checks passed at 375, 768 and 1440 pixels.
- [ ] Recheck the production flow and click-to-call on a real device. `SHOW_PHONE_CTA` is false; the number remains available in contact/footer details.
- [ ] Measure Lighthouse on production output and mobile performance; no score is claimed yet.
- [ ] Choose hosting, configure HTTPS/domain redirects, cache static hashed assets, use the custom 404, and verify deployed canonical/sitemap URLs.

## Business confirmation

- [ ] Business hours and scheduling availability.
- [x] Publish the eleven owner-requested Lancaster County town pages with unique copy; confirm ZIP-level coverage as inquiries arrive and before adding other communities.
- [ ] Add verified local operating/access details to each location before indexing; a different project tip is not enough to justify an SEO landing page.
- [x] Publish the $125 single-item starting price and explain quote factors; larger-load dollar amounts remain unpublished.
- [ ] Confirm operating scope, truck capacity, and quote terms as operations begin.
- [ ] Accepted/restricted materials, appliance/refrigerant handling, hazardous materials, weight limits and scope exclusions.
- [ ] Indoor removal/disconnection/disassembly policy and access requirements.
- [ ] Same-day policy; do not advertise it until supported operationally.
- [ ] Payment methods, cancellation and scheduling policies.
- [ ] Confirm any insurance/licensing statement before adding it. None currently appears.
- [ ] Disposal/donation/recycling arrangements and wording. No diversion rate or blanket donation promise is published.
- [ ] Review all `needsConfirmation` FAQ entries; replace uncertainty with verified policies when available.
- [ ] Verify owner story wording; no veteran designation is used.

## Real brand assets

- [ ] Final logo, social profiles and Google Business Profile URL.
- [ ] Original owner + truck photograph.
- [ ] Original family + truck photograph, with permission to publish.
- [ ] Real job/before-and-after photos, with permission and accurate pairing.
- [ ] Real reviews with source and permission; never add placeholder praise or ratings.

## Coverage and indexing

- [x] Owner-requested town pages are confirmed and included in the production sitemap; review useful local details before adding other communities.
- [ ] Review service descriptions, policies, privacy, metadata, and schema as operations are confirmed.
- [ ] Submit sitemap to Search Console and verify indexing. Establish a service-area Google Business Profile without exposing a residential address.
