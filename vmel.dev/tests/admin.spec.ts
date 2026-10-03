import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import pg from 'pg';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'node:crypto';

const enabled = process.env.RUN_ADMIN_E2E === 'true';
test.skip(!enabled, 'Administrative mutations require the isolated test database');
test.beforeAll(() => {
  const database = new URL(process.env.DATABASE_URL!);
  if (!['127.0.0.1', 'localhost'].includes(database.hostname) || database.pathname !== '/vmel_test') {
    throw new Error('Admin tests may only modify a local vmel_test database');
  }
});

test('authentication, owner editing, draft privacy, cache invalidation and ordering', async ({ page, request, baseURL }) => {
  const origin = baseURL!;
  expect((await request.get('/api/admin/projects')).status()).toBe(401);
  expect((await request.post('/api/auth/sign-up/email', { data: { name: 'Visitor', email: 'visitor@example.invalid', password: randomUUID() }, headers: { Origin: origin } })).ok()).toBe(false);
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL!);
  await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  const api = page.request;
  const data = { slug: `test-case-${Date.now()}`, title: 'Test migration case', summary: 'A verified test case summary.', body: 'Private draft content should stay private.', technologies: ['Next.js', 'PostgreSQL'], kind: 'commercial', status: 'draft', sortOrder: 0, demoUrl: '', repositoryUrl: '' };
  try {
    expect((await api.post('/api/admin/projects', { data, headers: { Origin: 'https://untrusted.invalid' } })).status()).toBe(403);
    expect((await api.post('/api/admin/projects', { data: { ...data, role: 'admin' }, headers: { Origin: origin } })).status()).toBe(400);
    await page.getByLabel('Title', { exact: true }).fill(data.title);
    await page.getByLabel('Slug', { exact: true }).fill(data.slug);
    await page.getByLabel('Summary', { exact: true }).fill(data.summary);
    await page.getByLabel('Case study', { exact: true }).fill(data.body);
    await page.getByLabel('Technologies', { exact: true }).fill('Next.js, PostgreSQL');
    await page.getByRole('button', { name: 'Create project', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Changes saved.');
    const projects = await (await api.get('/api/admin/projects')).json();
    const project = projects.find((item: { slug: string }) => item.slug === data.slug);
    expect(project.status).toBe('draft');
    expect((await request.get(`/projects/${data.slug}`)).status()).toBe(404);
    expect(await (await request.get('/')).text()).not.toContain(data.title);
    expect((await api.post('/api/admin/projects', { data, headers: { Origin: origin } })).status()).toBe(409);
    await page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: data.title, exact: true }) }).getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByRole('combobox', { name: 'Visibility', exact: true }).selectOption('published');
    await page.getByRole('button', { name: 'Save project', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Changes saved.');
    expect(await (await request.get('/')).text()).toContain(data.title);
    const publicCase = await request.get(`/projects/${data.slug}`);
    expect(publicCase.status()).toBe(200);
    expect(await publicCase.text()).toContain('noindex');
    const second = await api.post('/api/admin/projects', { data: { ...data, slug: `${data.slug}-personal`, title: 'Test personal project', kind: 'personal', status: 'published', sortOrder: 1, repositoryUrl: 'https://github.com/non-rp/vmel.dev' }, headers: { Origin: origin } });
    expect(second.status()).toBe(201);
    const another = await second.json();
    expect((await api.post('/api/admin/projects/reorder', { data: { ids: [another.id] }, headers: { Origin: origin } })).status()).toBe(409);
    expect((await api.post('/api/admin/projects/reorder', { data: { ids: [another.id, project.id] }, headers: { Origin: origin } })).status()).toBe(200);
    const sorted = await (await api.get('/api/admin/projects')).json();
    expect(sorted.map((item: { id: string }) => item.id)).toEqual([another.id, project.id]);
    expect((await api.patch(`/api/admin/projects/${project.id}`, { data: { ...data, status: 'draft' }, headers: { Origin: origin } })).status()).toBe(200);
    expect(await (await request.get('/')).text()).not.toContain(data.title);
    expect((await request.get(`/projects/${data.slug}`)).status()).toBe(404);
    await page.reload();
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
  } finally {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    try { await pool.query('DELETE FROM projects WHERE slug = $1 OR slug = $2', [data.slug, `${data.slug}-personal`]); }
    finally { await pool.end(); }
    // Direct cleanup also runs after a browser timeout; the test database is isolated.

  }
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await api.get('/api/admin/projects')).status()).toBe(401);
});

test('a reader and an expired session cannot administer projects', async ({ playwright, baseURL }) => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const id = randomUUID();
  const email = `reader-${id}@example.invalid`;
  const password = randomUUID();
  const context = await playwright.request.newContext({ baseURL });
  try {
    await pool.query('INSERT INTO "user" (id, name, email, role) VALUES ($1, $2, $3, $4)', [id, 'Reader', email, 'reader']);
    await pool.query('INSERT INTO account (id, account_id, provider_id, user_id, password) VALUES ($1, $2, $3, $2, $4)', [randomUUID(), id, 'credential', await hashPassword(password)]);
    expect((await context.post('/api/auth/sign-in/email', { data: { email, password }, headers: { Origin: baseURL! } })).status()).toBe(200);
    expect((await context.get('/api/admin/projects')).status()).toBe(403);
    await pool.query('UPDATE session SET expires_at = now() - interval \'1 minute\' WHERE user_id = $1', [id]);
    expect((await context.get('/api/admin/projects')).status()).toBe(401);
  } finally {
    await context.dispose();
    await pool.query('DELETE FROM "user" WHERE id = $1', [id]);
    await pool.end();
  }
});
