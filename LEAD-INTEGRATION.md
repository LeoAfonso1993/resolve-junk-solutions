# Lead delivery contract

A Cloudflare Worker receiver is implemented at `/api/leads`, using Resend for internal request emails. Account configuration and a real receipt test are still required; see [RESEND-SETUP.md](RESEND-SETUP.md). Build with `npm run build:worker` to select that same-origin endpoint. The generic frontend still supports `PUBLIC_LEAD_ENDPOINT` for other receivers. This is a public URL, never an API secret. HTTPS is required in production.

The endpoint receives multipart FormData:

- Required: `name`, `zip`, `address`, `items`, and at least one of `phone`/`email`.
- Optional: `timeframe`, `notes`, repeated `photos` file fields.
- Metadata: `mode` (`pre-launch`/`live`), `startedAt` (browser timestamp), `requestId` (UUID retained through retries), `website` (honeypot).

Only a 2xx JSON response containing `{ "accepted": true, "id": "persisted-lead-id" }` counts as success. Respond after durable persistence/queueing, not before. Return 429 for rate limiting and suitable non-2xx responses for failures. Use `requestId` for idempotency because a timeout may occur after acceptance. Success clears the form; failures retain it. The 20-second client timeout is not evidence that the server did not receive a request.

## Integration requirements and future storage

Client validation is only UX. Revalidate required fields, string lengths, email/phone, ZIP, allowed timeframe and mode on the server. Reject honeypot content, rate-limit, enforce origin/CORS policy and body-size limits, and use server-side timing/abuse controls. Browser timestamps and hidden fields are untrusted. Add a bot challenge only when needed; verification must run server-side. Never expose service credentials in browser code.

Allow at most four JPEG/PNG/WebP files, 5 MB each (20 MB total). Verify actual signatures and decodeability, not MIME headers alone; handle image bombs safely. Remove metadata, sanitize filenames, scan when appropriate, store privately, limit retention, and use authorized/signed access. Do not accept SVG/HTML or put uploads in a public executable location. Handle empty photo fields as no file.

Provision real storage/database/email delivery, monitor failures, and confirm vendor/privacy practices before enabling the endpoint. Use minimum-necessary access. Do not log full form bodies or photo content. The implemented receiver validates fields and photos, applies an IP rate limit, and sends Resend email. It has no separate database, uploaded-file storage, marketing subscription, or production analytics. Resend/inbox delivery and account configuration must be verified before enabling submission.

## Resolve Operation

Keep the UI stable and adapt `src/lib/leads.ts` if Resolve Operation expects another contract. Prefer a backend mapping layer when its API requires credentials. Test a real receipt, rejected data, rate limit, timeout, duplicate retry, unsupported files, and downstream failures before launch.

## Guided intake v1

The five screens are location, items, timing/access, contact, and review. A valid ZIP from either homepage form prefills location and opens the item step. ZIP presence does not assert serviceability. Back/edit preserves values in page memory. No contact details are put in URLs or localStorage. Refreshing the page resets answers; photos stay local until a real submission.

Additional multipart fields: repeated `categories`, `volume`, `access`, `propertyType`, and `contactPreference`. The `intake` JSON field includes `schemaVersion`, source, initial stage `new_inquiry`, structured project details, contact preference, and `coverageStatus: needs_confirmation`. Enum definitions live in `src/data/intake.ts`. The current receiver rebuilds project data from validated individual fields and uploaded files, ignoring client `intake` JSON. It does not trust client stage/coverage claims for authorization.

`src/lib/pipeline.ts` provides an optional server-side `suggestPriority` function. It is deliberately not bundled into the customer UI or accepted as a client score. The configurable rules consider urgency, scope, description, photos and access. They return a score, band, reasons, rules version and human-review flag. They do not infer wealth from ZIP, score people, or automatically reject leads. Run after validation and let staff override. This is a suggested follow-up model, not configured sales software. The email receiver includes this server-computed suggestion in notification emails. There is no CRM pipeline destination.

`quote_step_view` adds step-level analytics without form values or ZIPs. A disabled final send button and preview notices remain when no endpoint is configured; the full guided experience can still be reviewed.
