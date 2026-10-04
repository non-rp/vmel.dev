import { asc } from 'drizzle-orm';
import { getDb } from '../../../../src/db/client';
import { projects } from '../../../../src/db/schema';
import { authorizeAdmin, adminFailure } from '../../../../src/lib/admin';
import { projectInput } from '../../../../src/lib/project-validation';
import { invalidateProjectCache } from '../../../../src/lib/cache';

export async function GET(request: Request) {
  const denial = await authorizeAdmin(request);
  if (denial) return denial;
  return Response.json(await getDb().select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.createdAt)), { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const denial = await authorizeAdmin(request);
  if (denial) return denial;
  try {
    const parsed = projectInput.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const [created] = await getDb().insert(projects).values(parsed.data).returning();
    await invalidateProjectCache();
    return Response.json(created, { status: 201 });
  } catch (error) { return adminFailure(error); }
}
