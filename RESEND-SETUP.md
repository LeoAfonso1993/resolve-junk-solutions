# Resend request emails

The Cloudflare Worker in `worker/index.ts` serves the Astro site and handles `POST /api/leads`. It sends one internal notification through Resend. It does not email customers automatically, book pickups, or create CRM records.

## Account setup

1. In [Resend Domains](https://resend.com/domains), add a domain you control (for example `mail.resolvejunksolutions.com`). Add the exact DNS records Resend supplies in Cloudflare and wait for verification. Keep existing mailbox MX records intact; use the sending subdomain records Resend specifies.
2. In [Resend API keys](https://resend.com/api-keys), create a **Sending access** key restricted to the verified domain. Never use a `PUBLIC_` variable for it.
3. Set `LEAD_FROM_EMAIL` in `wrangler.jsonc` to a sender on that verified domain, such as `Resolve Junk Solutions <requests@mail.resolvejunksolutions.com>`. Set `LEAD_TO_EMAIL` to the actual inbox that should receive requests. These are currently blank deliberately. Update `ALLOWED_ORIGINS` if the site's URL changes.
4. Add `RESEND_API_KEY` as an encrypted runtime secret in the existing Worker's Cloudflare dashboard. Do not paste it into chat or commit it. The CLI alternative is `npx wrangler secret put RESEND_API_KEY`; note that this command immediately deploys a Worker version. Only run it when ready to update the configured Worker.
5. The `IMAGES` binding prepares uploaded photos. Confirm Cloudflare Images is available for the account; transformations have [usage-based pricing](https://developers.cloudflare.com/images/pricing/). Photos are decoded, limited to 40 megapixels, resized to fit 1600 × 1600, and re-encoded as JPEG attachments with generated filenames. The raw files are not published or stored by this Worker. Test real image delivery before enabling the form publicly.
6. Publish the business privacy contact in `src/data/business.ts` and establish an inbox/vendor retention policy before public use.

## Build and release

Keep the existing Worker name `resolve-junk-solutions`. Check the Cloudflare account/Worker and reconcile dashboard settings before deployment; Wrangler config can overwrite dashboard variables.

- Cloudflare build command: `npm run build:worker` (sets the public endpoint to `/api/leads`).
- Cloudflare deploy command: `npx wrangler deploy` (uses `wrangler.jsonc`, including the server; uploading only `dist` will not provide email delivery).
- For plain `npm run build`, set `PUBLIC_LEAD_ENDPOINT=/api/leads` in the build environment to enable submission. Without an endpoint the existing preview stays disabled.
- `PRE_LAUNCH_MODE=true` can remain enabled: future-service requests can still be emailed.
- The API fails closed with 503 if its key or either email address is missing. Never enable the frontend without completing receiver configuration.

Check locally before releasing:

```sh
npm run types:worker
npm run test:email
npm test
npm run build:worker
npm run check:worker
npm run check:site
```

For full local development, copy `.dev.vars.example` to the ignored `.dev.vars`, fill in the values privately, then run `npm run dev` (builds the connected frontend and starts the Worker). Open `http://localhost:8787`. Real credentials send real emails. `npm run dev:frontend` is the frontend-only preview and does not run `/api/leads`. Restart `npm run dev` after changing frontend files or local secrets.

## Acceptance and retries

The form reports success only after Resend returns an email ID. This means the provider accepted the email for delivery, not that the recipient's mail server delivered it to the inbox. Check Resend's delivery/bounce events and spam folder during a real test. There is no secondary database or retry queue: on failure, the browser retains the inquiry for retry.

The browser request UUID becomes Resend's `Idempotency-Key`. Identical retries are deduplicated for **24 hours** by Resend. Changed payloads with the same ID are rejected with 409 to avoid silently dropping changes. This is not permanent deduplication. Do not refresh after an uncertain timeout unless prepared to check for an already accepted inquiry.

The server validates fields, bounds request bytes, checks image signatures and decodeability, rebuilds project data, and computes the existing priority rules. Client `intake` JSON is not trusted or used for authorization. Origin restrictions, a honeypot, and a five-attempts-per-minute IP limiter reduce abuse; they are not bot-proof. Rate limiting is approximate and local to Cloudflare locations. Monitor sending volume and add a verified bot challenge if needed. Browser `startedAt` is not used as a security control.

Logs contain only failure event names and provider status codes, not submission bodies, credentials, or photos. Email/inbox retention is controlled by the configured providers and owner; no automatic deletion is implemented. Resend API key or provider errors never become success responses.

## Documentation

- [Resend send API](https://resend.com/docs/api-reference/emails/send-email)
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Cloudflare runtime secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare Images binding](https://developers.cloudflare.com/images/optimization/binding/)
