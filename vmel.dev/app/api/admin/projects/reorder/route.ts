import { eq, sql } from 'drizzle-orm';
import { getDb } from '../../../../../src/db/client';
import { projects } from '../../../../../src/db/schema';
import { authorizeAdmin, adminFailure } from '../../../../../src/lib/admin';
import { reorderInput } from '../../../../../src/lib/project-validation';
import { invalidateProjectCache } from '../../../../../src/lib/cache';

export async function POST(request: Request) {
  const denial = await authorizeAdmin(request);
  if (denial) return denial;
  try {
    const parsed = reorderInput.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: 'Provide a unique list of project IDs' }, { status: 400 });
    const success = await getDb().transaction(async (transaction) => {
      await transaction.execute(sql`LOCK TABLE projects IN SHARE ROW EXCLUSIVE MODE`);
      const existing = await transaction.select({ id: projects.id }).from(projects);
      if (existing.length !== parsed.data.ids.length || existing.some(({ id }) => !parsed.data.ids.includes(id))) return false;
      for (const [sortOrder, id] of parsed.data.ids.entries()) {
        await transaction.update(projects).set({ sortOrder, updatedAt: new Date() }).where(eq(projects.id, id));
      }
      return true;
    });
    if (!success) return Response.json({ error: 'Project list changed. Refresh before reordering.' }, { status: 409 });
    await invalidateProjectCache();
    return Response.json({ ok: true });
  } catch (error) { return adminFailure(error); }
}
