import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('guided request validates contact, previews photos, retries errors and delivers structured intake', async ({
  page,
}) => {
  await page.goto('/contact?zip=17601');
  // Test-only receiver. No real lead, email, storage, or pipeline is contacted.
  await page
    .locator('#quote-form')
    .evaluate((el) => el.setAttribute('data-endpoint', '/test-lead'));
  let calls = 0;
  const bodies: string[] = [];
  await page.route('**/test-lead', async (route) => {
    calls++;
    bodies.push(route.request().postData() || '');
    await route.fulfill({
      status: calls === 1 ? 503 : 201,
      contentType: 'application/json',
      body: calls === 1 ? '{}' : '{"accepted":true,"id":"test-receipt"}',
    });
  });
  await page.getByRole('checkbox', { name: 'Furniture', exact: true }).check();
  await page.getByLabel('About how much').selectOption('room');
  await page
    .getByLabel('A quick description')
    .fill('A couch and two chairs on the ground floor.');
  await page
    .locator('#photos')
    .setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7n8AAAAASUVORK5CYII=',
        'base64',
      ),
    });
  await expect(page.locator('#photo-preview img')).toHaveCount(1);
  await page.getByRole('button', { name: 'Remove photo 1' }).click();
  await expect(page.locator('#photo-preview img')).toHaveCount(0);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: 'Within a week', exact: true }).check();
  await page.getByLabel('Where are the items').selectOption('ground');
  await page.getByLabel('Property type').selectOption('home');
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Your name').fill('Test Customer');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#step-counter')).toHaveText('STEP 4 OF 5');
  await page.getByLabel('Email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Preferred way').selectOption('phone');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#step-counter')).toHaveText('STEP 4 OF 5');
  await page.getByLabel('Preferred way').selectOption('email');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Send My Request' }).click();
  await expect(page.locator('#form-status')).toContainText(
    'could not be confirmed',
  );
  await expect(page.locator('#review-summary')).toContainText(
    'test@example.com',
  );
  await page.getByRole('button', { name: 'Send My Request' }).click();
  await expect(page.locator('#quote-success')).toBeVisible();
  expect(calls).toBe(2);
  expect(bodies[1]).toContain('"schemaVersion":"1.0"');
  expect(bodies[1]).toContain('"stage":"new_inquiry"');
  expect(bodies[1]).toContain('"coverageStatus":"needs_confirmation"');
  expect(bodies[1]).toContain('"categories":["furniture"]');
  const ids = bodies.map(
    (b) => b.match(/name="requestId"\r\n\r\n([^\r]+)/)?.[1],
  );
  expect(ids[0]).toBeTruthy();
  expect(ids[0]).toBe(ids[1]);
});
