import 'server-only';
import { headers } from 'next/headers';
import { getAuth } from './auth';

export async function getAdminSession() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session?.user.role === 'admin' ? session : null;
}

export async function authorizeAdmin(request: Request) {
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'Sign in to continue' }, { status: 401 });
  if (session.user.role !== 'admin') return Response.json({ error: 'Administrator access required' }, { status: 403 });
  if (request.method !== 'GET' && request.headers.get('origin') !== new URL(process.env.BETTER_AUTH_URL!).origin) {
    return Response.json({ error: 'Invalid request origin' }, { status: 403 });
  }
  return null;
}

export function adminFailure(error: unknown) {
  if (error instanceof Error && 'cause' in error && (error.cause as { code?: string })?.code === '23505') {
    return Response.json({ error: 'This slug is already in use' }, { status: 409 });
  }
  if (error instanceof SyntaxError) return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  console.error('Admin operation failed');
  return Response.json({ error: 'Unable to save changes. Try again.' }, { status: 500 });
}
