import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPublishedProject } from '../../../src/lib/projects';
import ProjectVisual from '../../../src/components/ProjectVisual';
import { casePresentation } from '../../../src/content/case-presentation';
import { parseCaseStory } from '../../../src/lib/case-story';

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
  const presentation = casePresentation[project.slug];
  const chapters = parseCaseStory(project.body);
  return <main className="case-page container" id="main">
    <nav className="portfolio-breadcrumb mono" aria-label="Breadcrumb"><Link href="/">VMEL.DEV</Link><span>/</span><Link href="/portfolio">SELECTED WORK</Link><span>/</span><span>CASE {project.slug.toUpperCase()}</span></nav>
    <div className="case-heading"><div className="case-kicker mono">{project.kind === 'commercial' ? 'COMMERCIAL EXPERIENCE' : 'PERSONAL PROJECT'} / ENGINEERING CASE STUDY</div>
      <h1>{project.title}</h1><p className="case-summary">{project.summary}</p></div>
    <div className="case-hero-visual"><ProjectVisual slug={project.slug} title={project.title} priority /></div>
    {presentation && <div className="case-overview"><div><span className="mono">MY ROLE</span><strong>{presentation.role}</strong></div><div><span className="mono">{presentation.result.label}</span><strong>{presentation.result.value}</strong><p>{presentation.result.detail}</p></div></div>}
    <div className="case-content"><aside className="case-aside"><span className="mono">SCOPE &amp; TOOLS</span><div className="tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><small>{presentation?.visualNote || 'Images show current public sites. They are visual context, not archival proof of the work described.'}</small></aside>
      <div className="case-body">{chapters.map((chapter, index) => <section key={`${chapter.title}-${index}`}><span className="mono">{String(index + 1).padStart(2, '0')}</span><div><h2>{chapter.title}</h2>{chapter.blocks.map((block, blockIndex) => block.kind === 'list' ? <ul key={blockIndex}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul> : <p key={blockIndex}>{block.items[0]}</p>)}</div></section>)}</div></div>
    {presentation && <section className="case-system" aria-labelledby="case-system-title"><div className="case-system-heading"><span className="mono">SYSTEM VIEW / MY APPROACH</span><h2 id="case-system-title">{presentation.system.title}</h2></div><ol>{presentation.system.steps.map((step, index) => <li key={step}><span className="mono">{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>)}</ol></section>}
    {presentation?.gallery.length ? <section className="case-gallery" aria-labelledby="case-gallery-title"><div className="case-gallery-heading"><span className="mono">VISUAL CONTEXT</span><h2 id="case-gallery-title">A closer look</h2></div><div className="case-gallery-grid">{presentation.gallery.map((visual) => <figure key={visual.src}><div className="case-gallery-image"><Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 760px) 100vw, 1100px" /></div><figcaption className="mono">{visual.caption}</figcaption></figure>)}</div></section> : null}
    {presentation?.references?.length ? <nav className="case-references" aria-label="Project references">{presentation.references.map((reference) => <a className="text-link" href={reference.href} key={reference.href} target="_blank" rel="noopener noreferrer">{reference.label}</a>)}</nav> : null}
    {project.kind === 'personal' && <div className="case-links">
      {project.demoUrl && <a className="text-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer">Live project ↗</a>}
      {project.repositoryUrl && <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">Source code ↗</a>}
    </div>}
    <div className="case-back"><Link className="text-link" href="/portfolio">← All selected work</Link></div>
  </main>;
}
