import Link from 'next/link';
import type { PublicProject } from '../lib/project-validation';
import ProjectVisual from './ProjectVisual';

export default function ProjectCard({ project, index, priority = false }: { project: PublicProject; index: number; priority?: boolean }) {
  return <article className="showcase-card">
    <Link className="showcase-card-link" href={`/projects/${project.slug}`} aria-label={`View ${project.title} case study`}>
      <ProjectVisual slug={project.slug} title={project.title} priority={priority} />
      <div className="showcase-card-meta mono"><span>{String(index + 1).padStart(2, '0')} / {project.kind === 'commercial' ? 'COMMERCIAL' : 'PERSONAL'}</span><span>VIEW CASE ↗</span></div>
      <div className="showcase-card-copy"><h3>{project.title}</h3><p>{project.summary}</p></div>
      <div className="tags">{project.technologies.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}</div>
    </Link>
  </article>;
}
