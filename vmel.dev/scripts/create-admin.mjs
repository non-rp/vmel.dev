import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { hashPassword } from 'better-auth/crypto';
import { z } from 'zod';

const settings = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_EMAIL: z.email().transform((value) => value.toLowerCase()),
  ADMIN_PASSWORD: z.string().min(16).max(128),
  ADMIN_NAME: z.string().min(1).default('Valentyn Melnychenko'),
}).parse(process.env);
const pool = new Pool({ connectionString: settings.DATABASE_URL, max: 1 });
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const { rows } = await client.query('SELECT id, role FROM "user" WHERE email = $1', [settings.ADMIN_EMAIL]);
  if (rows.length) {
    if (rows[0].role !== 'admin') throw new Error('Existing account is not an administrator; no change made');
    console.log('Administrator already exists; password left unchanged.');
  } else {
    const id = randomUUID();
    const password = await hashPassword(settings.ADMIN_PASSWORD);
    await client.query('INSERT INTO "user" (id, name, email, email_verified, role) VALUES ($1, $2, $3, true, $4)', [id, settings.ADMIN_NAME, settings.ADMIN_EMAIL, 'admin']);
    await client.query('INSERT INTO "account" (id, account_id, provider_id, user_id, password) VALUES ($1, $2, $3, $2, $4)', [randomUUID(), id, 'credential', password]);
    console.log('Administrator created.');
  }
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally { client.release(); await pool.end(); }
