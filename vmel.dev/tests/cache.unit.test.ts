import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); });

it('a cache outage does not turn a completed database write into a failure', async () => {
  vi.stubEnv('REDIS_URL', '');
  const { invalidateProjectCache } = await import('../src/lib/cache');
  await expect(invalidateProjectCache()).resolves.toBeUndefined();
});
