import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop renders graphics, handles interactions, and has no accessibility violations', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Code meetscharacter.');
  await expect(page.locator('.sculpture')).toHaveClass(/sculpture-ready/, { timeout: 20000 });
  await page.getByRole('button', { name: 'WIREFRAME' }).click();
  await expect(page.getByRole('button', { name: 'SOLID VIEW' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Explore what I do' }).click();
  await expect(page).toHaveURL(/#expertise$/);
  await page.locator('summary').first().click();
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.locator('summary').nth(1).click();
  await page.getByRole('button', { name: 'COPY CONTACT LINK' }).click();
  await expect(page.getByRole('status')).toHaveText('Contact link copied to clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('linkedin.com/in/valentyn');
  await page.getByRole('button', { name: 'Enable animations' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  for (const link of await page.locator('a[target="_blank"]').all()) await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('desktop.png'), fullPage: true });
});

test('mobile menu, keyboard dismissal, narrow layouts and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('link', { name: 'About 02', exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole('navigation')).toBeHidden();
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(element => element.getBoundingClientRect().right > innerWidth + 1).map(element => ({ tag: element.tagName, class: element.className, right: element.getBoundingClientRect().right })).slice(0, 12));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Overflow at ${width}px: ${JSON.stringify(overflow)}`).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('mobile.png'), fullPage: true });
});

test('a WebGL failure preserves the page and the illustrated fallback', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.sculpture-fallback')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Let’s talk' })).toHaveAttribute('href', /linkedin.com/);
});

test('portfolio showcases published work and keeps case pages out of search results', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Work that');
  for (const title of ['CogniAgent · platform redesign', 'CogniAgent · platform migration', 'Glorium Technologies · legacy modernization', 'MIN · international commerce', 'Myco Meditations · continuous redesign', 'Centrum ForMe · editorial platform', 'Sumy Pizza · food delivery storefront', 'LiliStudio · craft supplies storefront']) {
    await expect(page.getByRole('link', { name: `View ${title} case study` })).toBeVisible();
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('.showcase-card img').first()).toHaveJSProperty('complete', true);
  await expect(page.getByRole('heading', { name: 'Where the craft began.' })).toBeVisible();
  for (const visual of await page.locator('.showcase-card img').all()) {
    await visual.scrollIntoViewIfNeeded();
    await expect.poll(() => visual.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: test.info().outputPath('portfolio.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'View CogniAgent · platform migration case study' }).click();
  await expect(page).toHaveURL(/\/projects\/cogniagent-platform-migration$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CogniAgent · platform migration');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('.case-body')).toContainText('12 hours');
  await expect(page.locator('.case-body h2')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'The publishing platform I led' })).toBeVisible();
  await expect(page.locator('.case-gallery img')).toHaveCount(1);
  await expect(page.locator('.case-gallery figcaption')).toContainText('CURRENT PUBLIC SITE');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({ path: test.info().outputPath('case-mobile.png'), fullPage: true });
  for (const slug of ['cogniagent-gutenberg-redesign', 'gloriumtech-legacy-modernization', 'min-commerce-multisite', 'myco-meditations-redesign', 'centrum-forme-editorial-platform', 'sumy-pizza-storefront', 'lilistudio-storefront']) {
    await page.goto(`/projects/${slug}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('.case-body h2').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Overflow on ${slug}`).toBe(true);
  }
});
