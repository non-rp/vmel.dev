import 'server-only';
import { and, asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '../db/client';
import { projects } from '../db/schema';
import { getRedis } from './cache';
import { publicProjectSchema } from './project-validation';

const publicColumns = {
  id: projects.id, slug: projects.slug, title: projects.title, summary: projects.summary,
  body: projects.body, technologies: projects.technologies, kind: projects.kind,
  demoUrl: projects.demoUrl, repositoryUrl: projects.repositoryUrl,
};

export async function getPublishedProjects() {
  let key = '';
  try {
    const cache = await getRedis();
    const version = await cache.get('vmel:projects:version') || '0';
    key = `vmel:projects:published:${version}`;
    const cached = await cache.get(key);
    if (cached) {
      const parsed = z.array(publicProjectSchema).safeParse(JSON.parse(cached));
      if (parsed.success) return parsed.data;
    }
  } catch { /* Redis is optional for rendering. */ }
  const rows = await getDb().select(publicColumns).from(projects).where(eq(projects.status, 'published')).orderBy(asc(projects.sortOrder), asc(projects.createdAt));
  if (key) {
    try { await (await getRedis()).set(key, JSON.stringify(rows), { EX: 60 }); } catch { /* Best-effort cache. */ }
  }
  return rows;
}

export async function getPublishedProject(slug: string) {
  const [project] = await getDb().select(publicColumns).from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.status, 'published'))).limit(1);
  return project;
}
