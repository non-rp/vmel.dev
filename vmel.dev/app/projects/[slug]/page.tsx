import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedProject } from '../../../src/lib/projects';
import ProjectVisual from '../../../src/components/ProjectVisual';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getPublishedProject((await params).slug);
  if (!project) return { title: 'Project not found', robots: { index: false } };
  return { title: project.title, description: project.summary, robots: { index: false, follow: false } };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getPublishedProject((await params).slug);
  if (!project) notFound();
  return <main className="case-page container" id="main">
    <nav className="portfolio-breadcrumb mono" aria-label="Breadcrumb"><Link href="/">VMEL.DEV</Link><span>/</span><Link href="/portfolio">SELECTED WORK</Link><span>/</span><span>CASE {project.slug.toUpperCase()}</span></nav>
    <div className="case-heading"><div className="case-kicker mono">{project.kind === 'commercial' ? 'COMMERCIAL EXPERIENCE' : 'PERSONAL PROJECT'} / ENGINEERING CASE STUDY</div>
      <h1>{project.title}</h1><p className="case-summary">{project.summary}</p></div>
    <div className="case-hero-visual"><ProjectVisual slug={project.slug} title={project.title} priority /></div>
    <div className="case-content"><aside className="case-aside"><span className="mono">MY SCOPE</span><div className="tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><small>Visual shows the current public site where available; it is not an archival screenshot of the project stage.</small></aside>
      <div className="case-body">{project.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <section key={index}><span className="mono">{String(index + 1).padStart(2, '0')}</span><p>{paragraph}</p></section>)}</div></div>
    {project.kind === 'personal' && <div className="case-links">
      {project.demoUrl && <a className="text-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer">Live project ↗</a>}
      {project.repositoryUrl && <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">Source code ↗</a>}
    </div>}
    <div className="case-back"><Link className="text-link" href="/portfolio">← All selected work</Link></div>
  </main>;
}
