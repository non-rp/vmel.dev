import Image from 'next/image';

const visuals: Record<string, { image?: string; label: string; tone: string }> = {
  'cogniagent-gutenberg-redesign': { image: '/projects/cogniagent.jpg', label: 'CogniAgent / Current public site', tone: 'cogni' },
  'cogniagent-platform-migration': { image: '/projects/cogniagent-platform.jpg', label: 'CogniAgent / Current public site', tone: 'cogni' },
  'gloriumtech-legacy-modernization': { image: '/projects/gloriumtech.jpg', label: 'Glorium Technologies / Current public site', tone: 'glorium' },
  'min-commerce-multisite': { image: '/projects/min.webp', label: 'MIN / Current public site visual', tone: 'min' },
  'myco-meditations-redesign': { image: '/projects/myco.jpg', label: 'MycoMeditations / Current public site', tone: 'myco' },
};

export default function ProjectVisual({ slug, title, priority = false }: { slug: string; title: string; priority?: boolean }) {
  const visual = visuals[slug];
  return <div className={`project-visual project-visual--${visual?.tone || 'default'}`}>
    {visual?.image ? <Image src={visual.image} alt={`Current public site visual for ${title}`} fill sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 720px" priority={priority} />
      : <div className="project-visual-art" aria-hidden="true"><span>{slug === 'min-commerce-multisite' ? 'MIN' : title.split(' ')[0]}</span><small>{slug === 'min-commerce-multisite' ? 'COMMERCE / ACROSS BORDERS' : 'SELECTED WORK'}</small></div>}
    <span className="project-visual-label mono">{visual?.label || 'Project artwork'}</span>
    <span className="project-visual-arrow" aria-hidden="true">↗</span>
  </div>;
}
