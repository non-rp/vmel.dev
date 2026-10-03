import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { asc } from 'drizzle-orm';
import { getAdminSession } from '../../src/lib/admin';
import { getDb } from '../../src/db/client';
import { projects } from '../../src/db/schema';
import AdminWorkspace from '../../src/components/AdminWorkspace';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Project workspace', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const rows = await getDb().select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.createdAt));
  return <AdminWorkspace initialProjects={rows.map(({ createdAt: _created, updatedAt: _updated, ...project }) => project)} ownerName={session.user.name} />;
}
