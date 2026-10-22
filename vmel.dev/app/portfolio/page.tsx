import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectCard from '../../src/components/ProjectCard';
import { getPublishedProjects } from '../../src/lib/projects';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Selected work', description: 'Selected platform, commerce and content engineering work by Valentyn Melnychenko.', robots: { index: false, follow: false } };

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  const earlierSlugs = new Set(['todos-tambien-business-platform', 'centrum-forme-editorial-platform', 'sumy-pizza-storefront', 'lilistudio-storefront']);
  const selected = projects.filter((project) => project.kind === 'commercial' && !earlierSlugs.has(project.slug));
  const earlier = projects.filter((project) => earlierSlugs.has(project.slug));
  const personal = projects.filter((project) => project.kind === 'personal');
  return <main className="portfolio-page container" id="main">
    <nav className="portfolio-breadcrumb mono" aria-label="Breadcrumb"><Link href="/">VMEL.DEV</Link><span>/</span><span>SELECTED WORK</span></nav>
    <header className="portfolio-intro"><div className="mono portfolio-eyebrow">ENGINEERING / PRODUCT / DELIVERY</div><h1>Work that<br /><em>moves things forward.</em></h1><p>Selected work across platform migrations, content systems, commerce and AI-assisted delivery. Each case follows the decisions I owned and the work I shipped.</p><div className="portfolio-index mono"><span>SELECTED PROJECTS</span><span>{String(projects.length).padStart(2, '0')} CASES</span></div></header>
    {selected.length ? <div className="portfolio-grid">{selected.map((project, index) => <ProjectCard key={project.id} project={project} index={index} priority={index === 0} />)}</div> : <p className="project-empty">Case studies are being prepared.</p>}
    {earlier.length > 0 && <section className="portfolio-secondary" aria-labelledby="earlier-work-heading"><div className="portfolio-secondary-heading"><span className="mono">EARLIER EXPERIENCE</span><h2 id="earlier-work-heading">Where the craft began.</h2><p>Earlier frontend and commerce work, presented with the evidence available from those projects.</p></div><div className="portfolio-grid portfolio-grid--secondary">{earlier.map((project, index) => <ProjectCard key={project.id} project={project} index={selected.length + index} />)}</div></section>}
    {personal.length > 0 && <section className="portfolio-secondary" aria-labelledby="personal-work-heading"><div className="portfolio-secondary-heading"><span className="mono">PERSONAL PROJECTS</span><h2 id="personal-work-heading">Built on my own terms.</h2></div><div className="portfolio-grid portfolio-grid--secondary">{personal.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></section>}
    <footer className="portfolio-end"><span className="mono">HAVE A COMPLEX PROBLEM?</span><h2>Let’s build what’s next.</h2><Link className="text-link" href="/#contact">Get in touch ↗</Link></footer>
  </main>;
}
