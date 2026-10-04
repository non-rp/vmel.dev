import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedProject } from '../../../src/lib/projects';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getPublishedProject((await params).slug);
  if (!project) return { title: 'Project not found', robots: { index: false } };
  return { title: project.title, description: project.summary, alternates: { canonical: `/projects/${project.slug}` }, robots: { index: project.kind === 'personal', follow: true } };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getPublishedProject((await params).slug);
  if (!project) notFound();
  return <main className="case-page container">
    <Link href="/#work" className="text-link">← Back to selected work</Link>
    <div className="case-kicker mono">{project.kind === 'commercial' ? 'COMMERCIAL EXPERIENCE' : 'PERSONAL PROJECT'}</div>
    <h1>{project.title}</h1><p className="case-summary">{project.summary}</p>
    <div className="tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
    <div className="case-body">{project.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    {project.kind === 'personal' && <div className="case-links">
      {project.demoUrl && <a className="text-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer">Live project ↗</a>}
      {project.repositoryUrl && <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">Source code ↗</a>}
    </div>}
  </main>;
}
