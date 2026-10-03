export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(`${process.env.RELEASE_SHA || 'development'}\n`, { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' } });
}
