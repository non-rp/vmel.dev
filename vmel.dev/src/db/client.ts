import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const state = globalThis as typeof globalThis & { vmelPool?: Pool };

export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  state.vmelPool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 3000, idleTimeoutMillis: 10000 });
  return state.vmelPool;
}

export function getDb() { return drizzle(getPool(), { schema }); }
