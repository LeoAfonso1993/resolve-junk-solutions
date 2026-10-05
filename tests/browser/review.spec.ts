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
  '/terms',
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
    const widthReport = await page.evaluate(() => ({
      ok: document.documentElement.scrollWidth <= innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll('body *')]
        .map((el) => ({
          selector: `${el.tagName.toLowerCase()}.${typeof el.className === 'string' ? el.className.trim().replaceAll(' ', '.') : ''}`,
          left: Math.round(el.getBoundingClientRect().left),
          right: Math.round(el.getBoundingClientRect().right),
          text: (el.textContent || '').trim().slice(0, 40),
        }))
        .filter((el) => el.right > innerWidth + 1 || el.left < -1)
        .slice(0, 10),
    }));
    expect(widthReport.ok, `${route}: ${JSON.stringify(widthReport)}`).toBe(
      true,
    );
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
  await page.locator('#photos').setInputFiles({
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
test('business identity and production copy stay factual', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-reassurance')).toContainText(
    /Air National Guard member|Military Service Member/,
  );
  await expect(page.locator('.resolve-story')).toContainText('Leo Afonso');
  await expect(page.locator('.announcement')).toHaveText(
    'Serving Lancaster County • Launching November 2026',
  );
  await expect(
    page.locator('#hero-zip').locator('..').getByRole('button'),
  ).toHaveText('Get a Free Quote →');
  await expect(page.locator('main')).toContainText(
    'Single-item pickups start at $125',
  );
  await page.goto('/about');
  await expect(page.locator('main')).toContainText(
    'currently serves in the Pennsylvania Air National Guard',
  );
  expect(await page.locator('main').innerText()).not.toMatch(/veteran/i);
});

test('town pages provide local ZIP, call, service prefill and the full location layout', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const favicon = await page.request.get('/favicon.ico');
  expect(favicon.status()).toBe(200);
  expect((await favicon.body()).byteLength).toBeGreaterThan(100);
  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain('https://resolvejunksolutions.com/terms');
  expect(sitemapText).not.toContain('workers.dev');
  expect(await (await page.request.get('/robots.txt')).text()).toContain(
    'https://resolvejunksolutions.com/sitemap.xml',
  );
  await page.goto('/service-area/manheim-pa');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Junk removal in Manheim, PA',
  );
  await expect(page.locator('.town-hero')).toContainText(
    'basement you have been meaning to clear',
  );
  await expect(page.locator('.town-hero')).not.toContainText('Prefer to call?');
  await expect(page.locator('.town-hero .town-phone')).toHaveCount(0);
  await expect(page.locator('.town-proof')).toContainText('717-742-0722');
  await expect(page.locator('.site-footer')).toContainText('717-742-0722');
  await expect(page.locator('.town-proof')).toContainText(
    'Single items from $125',
  );
  await expect(page.locator('.town-service-grid > a')).toHaveCount(6);
  await expect(page.locator('.town-hero .hero-photo img')).toBeVisible();
  await expect(page.locator('.town-hero .zip-start')).toBeVisible();
  await expect(page.locator('.town-faq details')).toHaveCount(5);
  await expect(page.locator('main')).not.toContainText(
    'We do not maintain a separate office',
  );
  await page.locator('#zip-manheim-pa').fill('17545');
  await page
    .locator('#zip-manheim-pa')
    .locator('..')
    .getByRole('button')
    .click();
  await expect(page).toHaveURL(/\/contact\?zip=17545&town=manheim-pa/);
  await expect(page.locator('#quote-town-context')).toContainText(
    'Service area: Manheim, PA',
  );
  await page.goto('/service-area/manheim-pa');
  await page.getByRole('link', { name: /Garage cleanouts/ }).click();
  await expect(page).toHaveURL(/\/contact\?town=manheim-pa&service=cleanout/);
  await expect(
    page.locator('[name="categories"][value="cleanout"]'),
  ).toBeChecked();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/service-area/manheim-pa');
  const heroLayout = await page.evaluate(() => {
    const hero = document.querySelector('.town-hero')!.getBoundingClientRect();
    const image = document
      .querySelector('.town-hero .hero-photo')!
      .getBoundingClientRect();
    return {
      heroHeight: hero.height,
      heroWidth: hero.width,
      imageWidth: image.width,
      mainWidth: document
        .querySelector('.town-hero .hero-main')!
        .getBoundingClientRect().width,
      conversionWidth: document
        .querySelector('.town-conversion')!
        .getBoundingClientRect().width,
      zipWidth: document
        .querySelector('.town-hero .zip-start')!
        .getBoundingClientRect().width,
    };
  });
  expect(heroLayout.heroHeight).toBeGreaterThan(600);
  expect(heroLayout.imageWidth).toBe(heroLayout.heroWidth);
  await expect(page.locator('.town-hero .zip-start')).toBeVisible();
  await page.goto('/');
  const homeZipWidth = await page
    .locator('.new-hero .zip-start')
    .evaluate((form) => form.getBoundingClientRect().width);
  expect(heroLayout.zipWidth, JSON.stringify(heroLayout)).toBe(homeZipWidth);
});
