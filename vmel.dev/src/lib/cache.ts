import { createClient } from 'redis';

let client: ReturnType<typeof createClient> | undefined;
let connection: Promise<unknown> | undefined;

export async function getRedis() {
  if (!process.env.REDIS_URL) throw new Error('REDIS_URL is not configured');
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL, disableOfflineQueue: true, socket: { connectTimeout: 1500, reconnectStrategy: false } });
    client.on('error', () => { /* Cache callers fall back to PostgreSQL. */ });
  }
  if (!client.isOpen) {
    connection ??= client.connect().finally(() => { connection = undefined; });
    await connection;
  }
  return client;
}

export async function invalidateProjectCache() {
  try { await (await getRedis()).incr('vmel:projects:version'); }
  catch { /* Cache entries expire in 60 seconds; PostgreSQL is authoritative. */ }
}
