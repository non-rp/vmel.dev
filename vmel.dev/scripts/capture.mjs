import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('.qa', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(process.env.QA_BASE_URL || 'http://127.0.0.1:4173');
await page.evaluate(() => document.fonts.ready);
await page.waitForSelector('.sculpture-ready', { timeout: 20000 });
await page.screenshot({ path: '.qa/desktop-hero.png' });
for (let top = 0, height = await page.evaluate(() => document.body.scrollHeight); top < height; top += 500) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
  await page.waitForTimeout(200);
}
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(500);
await page.screenshot({ path: '.qa/desktop-full.png', fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(process.env.QA_BASE_URL || 'http://127.0.0.1:4173');
await page.evaluate(() => document.fonts.ready);
await page.waitForSelector('.sculpture-ready');
await page.screenshot({ path: '.qa/mobile-hero.png' });
for (let top = 0, height = await page.evaluate(() => document.body.scrollHeight); top < height; top += 500) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
  await page.waitForTimeout(200);
}
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(500);
await page.screenshot({ path: '.qa/mobile-full.png', fullPage: true });
if (!process.env.QA_BASE_URL) {
const cover = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await cover.goto('http://127.0.0.1:4173');
await cover.evaluate(() => document.fonts.ready);
await cover.waitForSelector('.sculpture-ready');
await cover.addStyleTag({ content: '.header,.hero-bottom,.skills-band{display:none}.hero{padding-top:38px;max-width:none}.hero-content{min-height:540px}.hero-art{height:470px}.hero h1{font-size:100px}.hero-edition{font-size:8px}' });
await cover.screenshot({ path: 'public/og-cover.png' });
}
console.log('Screenshots saved in .qa/');
await browser.close();
