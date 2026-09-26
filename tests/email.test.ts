import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  receiveLead,
  validateLead,
  emailText,
  boundedBody,
  preparePhotos,
} from '../worker/index.ts';
function form() {
  const f = new FormData();
  for (const [k, v] of Object.entries({
    name: 'Test Customer',
    address: '123 Test Street',
    zip: '17601',
    email: 'customer@example.com',
    items: 'A couch and two chairs on the ground floor.',
    categories: 'furniture',
    volume: 'room',
    timeframe: 'week',
    access: 'ground',
    propertyType: 'home',
    contactPreference: 'email',
    mode: 'pre-launch',
    requestId: 'a16c29a7-eef5-4d69-86bd-c70f15cd6610',
  }))
    f.set(k, v);
  return f;
}
const origin = 'https://resolvejunksolutions.com';
const request = (f = form(), headers = {}) =>
  new Request(origin + '/api/leads', {
    method: 'POST',
    headers: { Origin: origin, ...headers },
    body: f,
  });
// Tests exercise the receiver with mocked provider/bindings; no real email is sent.
const env = {
  ALLOWED_ORIGINS: origin,
  RESEND_API_KEY: 'test-only',
  LEAD_FROM_EMAIL: 'requests@example.com',
  LEAD_TO_EMAIL: 'owner@example.com',
  LEAD_RATE_LIMITER: { limit: async () => ({ success: true }) },
} as unknown as Parameters<typeof receiveLead>[1];
test('valid request sends all details, priority, reply-to and stable retry key', async () => {
  const calls: RequestInit[] = [];
  const send: typeof fetch = async (_url, init) => {
    calls.push(init!);
    return Response.json({ id: 'email-123' });
  };
  for (let i = 0; i < 2; i++) {
    const r = await receiveLead(request(), env, send);
    assert.equal(r.status, 201);
    assert.deepEqual(await r.json(), { accepted: true, id: 'email-123' });
  }
  assert.equal(calls[0].body, calls[1].body);
  assert.equal(
    new Headers(calls[0].headers).get('Idempotency-Key'),
    new Headers(calls[1].headers).get('Idempotency-Key'),
  );
  const email = JSON.parse(String(calls[0].body));
  assert.equal(email.reply_to, 'customer@example.com');
  assert.deepEqual(email.to, ['owner@example.com']);
  assert.match(email.text, /HIGH \(70\/100\)/);
  assert.match(email.text, /relative to service launch/);
  assert.match(email.text, /needs_confirmation/);
});
test('provider failures, invalid receipts and timeouts never produce false success', async () => {
  for (const send of [
    async () => new Response('', { status: 429 }),
    async () => Response.json({}),
    async () => {
      throw new DOMException('Timeout', 'TimeoutError');
    },
  ]) {
    const response = await receiveLead(request(), env, send);
    assert.ok(response.status >= 500);
    assert.notEqual(
      ((await response.json()) as { accepted?: boolean }).accepted,
      true,
    );
  }
});
test('rejects missing config, foreign origins and rate-limited traffic before provider', async () => {
  const never = async () => {
    assert.fail('Provider must not be called');
  };
  assert.equal(
    (await receiveLead(request(), { ...env, RESEND_API_KEY: '' }, never))
      .status,
    503,
  );
  assert.equal(
    (
      await receiveLead(
        request(form(), { Origin: 'https://untrusted.example' }),
        env,
        never,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await receiveLead(
        request(),
        {
          ...env,
          LEAD_RATE_LIMITER: { limit: async () => ({ success: false }) },
        },
        never,
      )
    ).status,
    429,
  );
});
test('server rejects invalid contact, enums, honeypot and duplicate scalar fields', () => {
  for (const [key, value] of [
    ['email', 'bad\r\nBcc: bad@example.com'],
    ['zip', 'abcde'],
    ['website', 'spam'],
    ['timeframe', 'immediate'],
    ['requestId', 'fake'],
    ['items', ''],
    ['contactPreference', 'phone'],
  ]) {
    const f = form();
    f.set(key, value);
    assert.throws(() => validateLead(f));
  }
  const f = form();
  f.append('name', 'second');
  assert.throws(() => validateLead(f));
});
test('client score and stage cannot override server email', () => {
  const f = form();
  f.set('intake', '{"score":100,"stage":"confirmed"}');
  const text = emailText(validateLead(f));
  assert.match(text, /70\/100/);
  assert.match(text, /new_inquiry/);
});
test('body size is enforced without trusting content-length', async () => {
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(new Uint8Array(22 * 1024 * 1024));
      c.close();
    },
  });
  const r = new Request(origin, {
    method: 'POST',
    body: stream,
    duplex: 'half',
  } as RequestInit);
  await assert.rejects(() => boundedBody(r), /too large/);
});
test('unsupported and spoofed photos are rejected', async () => {
  const f = form();
  f.append(
    'photos',
    new File(['<svg/>'], 'bad.svg', { type: 'image/svg+xml' }),
  );
  assert.throws(() => validateLead(f));
  await assert.rejects(
    () =>
      preparePhotos(
        [new File(['<script/>'], 'fake.png', { type: 'image/png' })],
        {} as Env['IMAGES'],
      ),
    /not a valid/,
  );
});
test('photo processing fails closed and uses safe generated attachment names', async () => {
  const photo = new File(
    [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])],
    'private-address.png',
    { type: 'image/png' },
  );
  const images = {
    info: async () => ({ width: 100, height: 100 }),
    input: () => ({
      transform: () => ({
        output: async () => ({
          response: () => new Response('processed-image'),
        }),
      }),
    }),
  } as unknown as Env['IMAGES'];
  const [attachment] = await preparePhotos([photo], images);
  assert.equal(attachment.filename, 'project-photo-1.jpg');
  assert.equal(
    Buffer.from(attachment.content, 'base64').toString(),
    'processed-image',
  );
  await assert.rejects(
    () =>
      preparePhotos([photo], {
        ...images,
        info: async () => {
          throw new Error('decode failed');
        },
      }),
    /could not be processed/,
  );
  await assert.rejects(
    () =>
      preparePhotos([photo], {
        ...images,
        info: async () => ({
          format: 'image/png',
          fileSize: 8,
          width: 10000,
          height: 10000,
        }),
      }),
    /40 megapixels/,
  );
});

test('street address is required and bounded on the server', () => {
  for (const address of ['', '   ', 'a'.repeat(251)]) {
    const f = form();
    f.set('address', address);
    assert.throws(() => validateLead(f), /address/);
  }
  const f = form();
  f.delete('address');
  assert.throws(() => validateLead(f), /address/);
});

test('configured dev origins work; unconfigured origins stay blocked', async () => {
  const send: typeof fetch = async () => Response.json({ id: 'local-test' });
  for (const origin of [
    'http://localhost:8788',
    'http://127.0.0.1:8788',
    'http://[::1]:8788',
  ]) {
    const request = new Request(origin + '/api/leads', {
      method: 'POST',
      headers: { Origin: origin },
      body: form(),
    });
    assert.equal(
      (await receiveLead(request, { ...env, ALLOWED_ORIGINS: origin }, send))
        .status,
      201,
    );
    assert.equal((await receiveLead(request, env, send)).status, 403);
  }
  for (const [target, origin] of [
    ['http://localhost:8788', 'https://untrusted.example'],
    ['https://untrusted.example', 'https://untrusted.example'],
    ['http://localhost:8788', 'http://localhost:9999'],
  ]) {
    const request = new Request(target + '/api/leads', {
      method: 'POST',
      headers: { Origin: origin },
      body: form(),
    });
    assert.equal((await receiveLead(request, env, send)).status, 403);
  }
});
