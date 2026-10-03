import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { getDb } from '../db/client';
import * as schema from '../db/schema';

let instance: ReturnType<typeof createAuth> | undefined;

function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;
  if (!secret || secret.length < 32 || !baseURL) throw new Error('Authentication environment is not configured');
  return betterAuth({
    secret, baseURL, trustedOrigins: [baseURL],
    database: drizzleAdapter(getDb(), { provider: 'pg', schema }),
    emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12 },
    user: { additionalFields: { role: { type: 'string', defaultValue: 'reader', input: false } } },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: { enabled: true, window: 60, max: 30 },
    advanced: { useSecureCookies: new URL(baseURL).protocol === 'https:', ipAddress: { ipAddressHeaders: ['x-real-ip'] } },
  });
}

export function getAuth() { instance ??= createAuth(); return instance; }
