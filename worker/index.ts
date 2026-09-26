import { Buffer } from 'node:buffer';
import { intakeOptions } from '../src/data/intake.ts';
import { suggestPriority } from '../src/lib/pipeline.ts';
import { validatePhotos } from '../src/lib/leads.ts';

type LeadEnv = Env & { RESEND_API_KEY?: string };
const MAX_BODY = 21 * 1024 * 1024;
class RequestError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
const json = (status: number, data: object) =>
  Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...(status === 429 ? { 'Retry-After': '60' } : {}),
    },
  });

export async function boundedBody(request: Request): Promise<Blob> {
  if (Number(request.headers.get('content-length')) > MAX_BODY)
    throw new RequestError('Request too large.', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError('Missing request.');
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) {
        await reader.cancel();
        throw new RequestError('Request too large.', 413);
      }
      chunks.push(new Uint8Array(value));
    }
  } finally {
    reader.releaseLock();
  }
  return new Blob(chunks);
}

export function validateLead(form: FormData) {
  const field = (key: string, max = 200, required = false) => {
    const entries = form.getAll(key);
    if (entries.length > 1 || entries.some((v) => typeof v !== 'string'))
      throw new RequestError(`Invalid ${key}.`);
    const value = String(entries[0] || '').trim();
    if (
      (required && !value) ||
      value.length > max ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
    )
      throw new RequestError(`Invalid ${key}.`);
    return value;
  };
  const option = (key: string, group: keyof typeof intakeOptions) => {
    const value = field(key, 30, true);
    if (!intakeOptions[group].some(([v]) => v === value))
      throw new RequestError(`Invalid ${key}.`);
    return value;
  };
  if (field('website', 500))
    throw new RequestError('Unable to accept this request.');
  const name = field('name', 120, true),
    zip = field('zip', 5, true);
  const email = field('email', 254),
    phone = field('phone', 40);
  if (!/^\d{5}$/.test(zip)) throw new RequestError('Enter a five-digit ZIP.');
  if (!email && !phone)
    throw new RequestError('Provide an email or phone number.');
  if (email && !/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(email))
    throw new RequestError('Invalid email.');
  if (
    phone &&
    (!/^[+\d\s().-]+$/.test(phone) ||
      phone.replace(/\D/g, '').length < 10 ||
      phone.replace(/\D/g, '').length > 15)
  )
    throw new RequestError('Invalid phone.');
  const requestId = field('requestId', 36, true);
  if (
    !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
      requestId,
    )
  )
    throw new RequestError('Invalid request ID.');
  const categories = form.getAll('categories');
  if (
    !categories.length ||
    categories.length > 7 ||
    categories.some(
      (v) =>
        typeof v !== 'string' ||
        !intakeOptions.services.some(([key]) => key === v),
    )
  )
    throw new RequestError('Choose valid item categories.');
  const mode = field('mode', 20, true);
  if (!['pre-launch', 'live'].includes(mode))
    throw new RequestError('Invalid request mode.');
  const contactPreference = field('contactPreference', 20, true);
  if (
    !['email', 'phone', 'text', 'either'].includes(contactPreference) ||
    (contactPreference === 'email' && !email) ||
    (['phone', 'text'].includes(contactPreference) && !phone)
  )
    throw new RequestError('Invalid contact preference.');
  const photos: File[] = [];
  for (const value of form.getAll('photos')) {
    if (typeof value === 'string') {
      if (value) throw new RequestError('Invalid photo.');
      continue;
    }
    if (!value.size && !value.name) continue;
    if (!value.size) throw new RequestError('Empty photo.');
    photos.push(value);
  }
  const photoError = validatePhotos(photos);
  if (photoError) throw new RequestError(photoError);
  // Rebuild trusted intake from validated fields. Never trust client JSON scores/stage.
  const project = {
    categories: [...new Set(categories as string[])],
    volume: option('volume', 'volumes'),
    timeframe: option('timeframe', 'timeframes'),
    access: option('access', 'access'),
    propertyType: option('propertyType', 'properties'),
    description: field('items', 5000, true),
    photoCount: photos.length,
  };
  return {
    requestId,
    name,
    zip,
    email,
    phone,
    mode,
    contactPreference,
    address: field('address', 250, true),
    notes: field('notes', 5000),
    project,
    photos,
  };
}

export async function preparePhotos(photos: File[], images: Env['IMAGES']) {
  const attachments = [];
  for (const [i, photo] of photos.entries()) {
    const signature = new Uint8Array(await photo.slice(0, 12).arrayBuffer());
    const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
      (b, i) => signature[i] === b,
    );
    const jpg =
      signature[0] === 255 && signature[1] === 216 && signature[2] === 255;
    const webp =
      Buffer.from(signature).toString('ascii').startsWith('RIFF') &&
      Buffer.from(signature).toString('ascii', 8, 12) === 'WEBP';
    if (!(
      (photo.type === 'image/png' && png) ||
      (photo.type === 'image/jpeg' && jpg) ||
      (photo.type === 'image/webp' && webp)
    ))
      throw new RequestError('A photo is not a valid JPG, PNG, or WebP.');
    try {
      const info = await images.info(photo.stream());
      if (!('width' in info) || info.width * info.height > 40_000_000)
        throw new RequestError('Photos must be 40 megapixels or smaller.');
      const result = await images
        .input(photo.stream())
        .transform({ width: 1600, height: 1600, fit: 'scale-down' })
        .output({ format: 'image/jpeg', quality: 80, anim: false });
      const bytes = await result.response().arrayBuffer();
      if (bytes.byteLength > 5 * 1024 * 1024)
        throw new RequestError('Photo could not be resized.');
      attachments.push({
        filename: `project-photo-${i + 1}.jpg`,
        content: Buffer.from(bytes).toString('base64'),
      });
    } catch (error) {
      if (error instanceof RequestError) throw error;
      throw new RequestError(
        'A photo could not be processed. Try another photo or submit without photos.',
        422,
      );
    }
  }
  return attachments;
}

export function emailText(lead: ReturnType<typeof validateLead>) {
  const priority = suggestPriority(lead.project);
  const label = (group: keyof typeof intakeOptions, value: string) =>
    intakeOptions[group].find(([key]) => key === value)?.[1] || value;
  // Timing wording is based on the submitted mode, not the server build's environment.
  const timing =
    {
      soon: 'As soon as available',
      week: 'Within a week',
      month: 'Within a month',
      flexible: 'Flexible',
      planning: 'Just planning',
    }[lead.project.timeframe] || lead.project.timeframe;
  return [
    'NEW RESOLVE JUNK SOLUTIONS REQUEST',
    `Request ID: ${lead.requestId}`,
    `Mode: ${lead.mode}`,
    `Suggested priority: ${priority.band.toUpperCase()} (${priority.score}/100) — staff review required`,
    `Reasons: ${priority.reasons.join('; ') || 'Standard follow-up'}`,
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email || 'Not provided'}`,
    `Phone: ${lead.phone || 'Not provided'}`,
    `Preferred contact: ${lead.contactPreference}`,
    `ZIP: ${lead.zip}`,
    `Address: ${lead.address || 'Not provided'}`,
    '',
    `Items: ${lead.project.categories.map((c) => label('services', c)).join(', ')}`,
    `Amount: ${label('volumes', lead.project.volume)}`,
    `Timing: ${timing}${lead.mode === 'pre-launch' ? ' (relative to service launch)' : ''}`,
    `Access: ${label('access', lead.project.access)}`,
    `Property: ${label('properties', lead.project.propertyType)}`,
    '',
    'Description:',
    lead.project.description,
    '',
    'Notes:',
    lead.notes || 'None',
    '',
    `Photos: ${lead.photos.length}`,
    'Stage: new_inquiry',
    'Coverage: needs_confirmation',
    'This is an inquiry, not a confirmed booking. Priority is a follow-up suggestion, not a customer rating.',
  ].join('\n');
}

export async function receiveLead(
  request: Request,
  env: LeadEnv,
  send: typeof fetch = fetch,
) {
  if (request.method !== 'POST')
    return json(405, { error: 'Method not allowed.' });
  const origin = request.headers.get('origin');
  if (
    !origin ||
    !env.ALLOWED_ORIGINS.split(',')
      .map((s) => s.trim())
      .includes(origin)
  )
    return json(403, { error: 'Origin not allowed.' });
  if (!env.RESEND_API_KEY || !env.LEAD_FROM_EMAIL || !env.LEAD_TO_EMAIL)
    return json(503, { error: 'Online requests are not configured.' });
  try {
    const { success } = await env.LEAD_RATE_LIMITER.limit({
      key: `lead:${request.headers.get('cf-connecting-ip') || 'local'}`,
    });
    if (!success)
      return json(429, { error: 'Please wait before trying again.' });
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data;'))
      throw new RequestError('Expected form data.', 415);
    const body = await boundedBody(request);
    let form: FormData;
    try {
      form = await new Response(body, {
        headers: { 'content-type': contentType },
      }).formData();
    } catch {
      throw new RequestError('Invalid form data.');
    }
    const lead = validateLead(form);
    const attachments = await preparePhotos(lead.photos, env.IMAGES);
    const priority = suggestPriority(lead.project);
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `lead/${lead.requestId}`,
      },
      body: JSON.stringify({
        from: env.LEAD_FROM_EMAIL,
        to: [env.LEAD_TO_EMAIL],
        ...(lead.email ? { reply_to: lead.email } : {}),
        subject: `[${priority.band.toUpperCase()}] Junk removal request — ${lead.zip}`,
        text: emailText(lead),
        attachments,
      }),
    });
    if (!response.ok) {
      console.error(
        JSON.stringify({
          event: 'lead_email_rejected',
          status: response.status,
        }),
      );
      return json(response.status === 409 ? 409 : 502, {
        error: 'Email acceptance could not be confirmed.',
      });
    }
    const receipt = (await response.json()) as { id?: string };
    if (typeof receipt.id !== 'string' || !receipt.id.trim())
      throw new Error('Missing receipt');
    return json(201, { accepted: true, id: receipt.id });
  } catch (error) {
    if (error instanceof RequestError)
      return json(error.status, { error: error.message });
    console.error(JSON.stringify({ event: 'lead_delivery_failed' }));
    return json(503, {
      error: 'Delivery could not be confirmed. Please retry.',
    });
  }
}
export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === '/api/leads')
      return receiveLead(request, env);
    if (new URL(request.url).pathname.startsWith('/api/'))
      return json(404, { error: 'Not found.' });
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<LeadEnv>;
