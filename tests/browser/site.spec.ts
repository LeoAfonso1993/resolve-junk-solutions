import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const width of [375, 768, 1440]) {
  test(`responsive pages and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const route of [
      '/',
      '/contact',
      '/services/furniture-removal',
      '/service-area/lancaster-pa',
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}
test('ZIP hero opens guided flow; answers survive back/edit; no false delivery', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto('/');
  await page.locator('#hero-zip').fill('17601');
  await page.locator('[data-zip-start]').first().getByRole('button').click();
  await expect(page.locator('#step-counter')).toHaveText('STEP 2 OF 5');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#category-error')).toHaveText(
    'Choose at least one type of item.',
  );
  await page.getByRole('checkbox', { name: 'Furniture', exact: true }).check();
  await page.getByLabel('About how much').selectOption('room');
  await page
    .getByLabel('A quick description')
    .fill('A sofa and two chairs from the living room.');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByRole('radio', { name: 'Within a month', exact: true })
    .check();
  await page.getByLabel('Where are the items').selectOption('stairs');
  await page.getByLabel('Property type').selectOption('home');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Your name').fill('Test Customer');
  await page.getByLabel('Email', { exact: true }).fill('test@example.com');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#review-summary')).toContainText('17601');
  await expect(page.locator('#review-summary')).toContainText(
    'test@example.com',
  );
  await page.getByRole('button', { name: 'Edit Items', exact: true }).click();
  await expect(
    page.getByRole('checkbox', { name: 'Furniture', exact: true }),
  ).toBeChecked();
  await expect(page.getByLabel('A quick description')).toHaveValue(
    'A sofa and two chairs from the living room.',
  );
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Continue' }).click();
  await expect(
    page.getByRole('button', { name: 'Online Sending Opens Soon' }),
  ).toBeDisabled();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test('mobile menu responds to keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto('/');
  const menu = page.locator('.mobile-menu summary');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
});
test('screenshots', async ({ page }) => {
  for (const [name, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `artifacts/home-${name}.png`,
      fullPage: true,
    });
    await page.goto('/contact?zip=17601');
    await page.screenshot({
      path: `artifacts/quote-${name}.png`,
      fullPage: true,
    });
  }
});
