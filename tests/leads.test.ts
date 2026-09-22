import { test } from 'node:test';
import assert from 'node:assert/strict';
import { submitLead, validatePhotos } from '../src/lib/leads.ts';
test('rejects oversized, excessive, and unsupported photos', () => {
  assert.match(
    validatePhotos(
      Array.from(
        { length: 5 },
        () => new File(['x'], 'a.jpg', { type: 'image/jpeg' }),
      ),
    ),
    /up to 4/,
  );
  assert.match(
    validatePhotos([new File(['x'], 'bad.svg', { type: 'image/svg+xml' })]),
    /JPG/,
  );
  assert.match(
    validatePhotos([
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'big.jpg', {
        type: 'image/jpeg',
      }),
    ]),
    /5 MB/,
  );
  assert.equal(
    validatePhotos([new File(['x'], 'a.jpg', { type: 'image/jpeg' })]),
    '',
  );
});
test('missing endpoint never reports success', async () => {
  await assert.rejects(submitLead(new FormData(), ''), /not been sent/);
});
test('requires an explicit receipt, surfaces server failures, and accepts a valid receipt', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('{}', { status: 200 });
    await assert.rejects(
      submitLead(new FormData(), 'https://example.test'),
      /confirm receipt/,
    );
    globalThis.fetch = async () => new Response('', { status: 429 });
    await assert.rejects(
      submitLead(new FormData(), 'https://example.test'),
      /Too many/,
    );
    globalThis.fetch = async () =>
      new Response('{"accepted":true,"id":"lead-123"}', { status: 201 });
    await assert.doesNotReject(
      submitLead(new FormData(), 'https://example.test'),
    );
  } finally {
    globalThis.fetch = original;
  }
});

import { suggestPriority } from '../src/lib/pipeline.ts';
test('priority suggestions explain operational urgency without rating people', () => {
  const high = suggestPriority({
    categories: ['furniture'],
    volume: 'multiple',
    timeframe: 'soon',
    access: 'ground',
    propertyType: 'home',
    description: 'Several rooms of furniture need to be cleared.',
    photoCount: 2,
  });
  assert.equal(high.band, 'high');
  assert.equal(high.score, 90);
  assert.equal(high.requiresHumanReview, true);
  const planning = suggestPriority({
    categories: ['other'],
    volume: 'unsure',
    timeframe: 'planning',
    access: 'unsure',
    propertyType: 'home',
    description: 'Not sure',
    photoCount: 0,
  });
  assert.equal(planning.band, 'standard');
  assert.equal(planning.score, 0);
});
