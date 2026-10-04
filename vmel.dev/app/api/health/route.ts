import { getPool } from '../../../src/db/client';
import { getRedis } from '../../../src/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [database, cache] = await Promise.allSettled([Promise.resolve().then(() => getPool().query('SELECT 1')), getRedis().then((client) => client.ping())]);
  const ready = database.status === 'fulfilled' && cache.status === 'fulfilled';
  return Response.json({ status: ready ? 'ready' : 'degraded', database: database.status === 'fulfilled', cache: cache.status === 'fulfilled' }, { status: ready ? 200 : 503, headers: { 'Cache-Control': 'no-store' } });
}
