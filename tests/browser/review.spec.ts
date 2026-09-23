import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { services } from '../../src/data/services';
import { locations } from '../../src/data/locations';
const routes = [
  '/',
  '/services',
  '/pricing',
  '/about',
  '/contact',
  '/service-area',
  '/privacy',
  ...services.map((s) => `/services/${s.slug}`),
  ...locations.map((l) => `/service-area/${l.slug}`),
];
test('every route: mobile layout, accessibility, canonical, schema and runtime', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 360, height: 800 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://resolvejunksolutions.com${route}`,
    );
    expect(
      JSON.parse(
        await page.locator('script[type="application/ld+json"]').innerText(),
      )['@graph'],
    ).toBeTruthy();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations,
      route,
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test('validation errors persist, correct cleanly, and invalid photo selection can be removed', async ({
  page,
}) => {
  await page.goto('/contact?zip=17601');
  await page.getByRole('checkbox', { name: 'Furniture', exact: true }).check();
  await page.getByLabel('About how much').selectOption('single');
  await page.getByLabel('A quick description').fill(' ');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#step-error')).toContainText('describe');
  await page.getByLabel('A quick description').fill('A couch');
  await expect(page.locator('#step-error')).toBeEmpty();
  await page
    .locator('#photos')
    .setInputFiles({
      name: 'bad.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg/>'),
    });
  await expect(page.locator('#photo-error')).toContainText('JPG');
  await page.getByRole('button', { name: 'Remove selected photos' }).click();
  await expect(page.locator('#photo-error')).toBeEmpty();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#step-counter')).toHaveText('STEP 3 OF 5');
});
test('owner identity and launch intent stay factual', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-reassurance')).toContainText(
    /Air National Guard member|Military Service Member/,
  );
  await expect(page.locator('.resolve-story')).toContainText('Leo Afonso');
  await expect(page.locator('.announcement')).toContainText('November 2026');
  await expect(
    page.locator('#hero-zip').locator('..').getByRole('button'),
  ).toHaveText('Plan Your Pickup →');
  await page.goto('/about');
  await expect(page.locator('main')).toContainText(
    'currently serves in the Pennsylvania Air National Guard',
  );
  expect(await page.locator('main').innerText()).not.toMatch(/veteran/i);
});
