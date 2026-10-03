import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '../../../../../src/db/client';
import { projects } from '../../../../../src/db/schema';
import { authorizeAdmin, adminFailure } from '../../../../../src/lib/admin';
import { projectInput } from '../../../../../src/lib/project-validation';
import { invalidateProjectCache } from '../../../../../src/lib/cache';

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const denial = await authorizeAdmin(request);
  if (denial) return denial;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return Response.json({ error: 'Invalid project ID' }, { status: 400 });
  try {
    const parsed = projectInput.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const [updated] = await getDb().update(projects).set({ ...parsed.data, updatedAt: new Date() }).where(eq(projects.id, id)).returning();
    if (!updated) return Response.json({ error: 'Project not found' }, { status: 404 });
    await invalidateProjectCache();
    return Response.json(updated);
  } catch (error) { return adminFailure(error); }
}

export async function DELETE(request: Request, context: Context) {
  const denial = await authorizeAdmin(request);
  if (denial) return denial;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return Response.json({ error: 'Invalid project ID' }, { status: 400 });
  try {
    const [deleted] = await getDb().delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
    if (!deleted) return Response.json({ error: 'Project not found' }, { status: 404 });
    await invalidateProjectCache();
    return new Response(null, { status: 204 });
  } catch (error) { return adminFailure(error); }
}
