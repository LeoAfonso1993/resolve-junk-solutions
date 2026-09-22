# Owner facts and launch checklist

## Blocking a working lead-generation launch

- [ ] Supply business phone and email (`src/data/business.ts`). Neither is fabricated.
- [ ] Connect a real lead destination using `PUBLIC_LEAD_ENDPOINT`; see LEAD-INTEGRATION.md.
- [ ] Verify a real request arrives, including uploaded photos, and test failure/retry paths.
- [ ] Publish a monitored privacy contact and confirm vendor, retention, access and deletion practices; update `/privacy` to match actual practices before collecting data.
- [x] Run the redesigned local site, browser tests and visual review on mobile/desktop. Automated axe checks passed at 375, 768 and 1440 pixels.
- [ ] Recheck the connected production flow and click-to-call with a real number. Local navigation/validation and adapter error handling are tested.
- [ ] Measure Lighthouse on production output and mobile performance; no score is claimed yet.
- [ ] Choose hosting, configure HTTPS/domain redirects, cache static hashed assets, use the custom 404, and verify deployed canonical/sitemap URLs.

## Business confirmation

- [ ] Exact launch date and business hours.
- [ ] Confirm each city and ZIP coverage. `locations.ts` currently marks all eleven candidate communities unconfirmed.
- [ ] Add verified local operating/access details to each location before indexing; a different project tip is not enough to justify an SEO landing page.
- [ ] Final pricing model, rates, truck capacity and quote terms. Load fractions are planning categories only.
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

## Switching to active service

- [ ] Finish policy review and confirm lead delivery.
- [ ] Set `PRE_LAUNCH_MODE` to false and rebuild.
- [ ] Set city `confirmed` only after coverage and useful local content are reviewed.
- [ ] Review all pages for remaining provisional wording. Policy and unconfirmed-city language is deliberately not erased by the switch.
- [ ] Update service descriptions if business scope changes; review privacy, metadata and schema.
- [ ] Submit sitemap to Search Console and verify indexing. Establish a service-area Google Business Profile without exposing a residential address.
