INSERT INTO "projects" ("slug", "title", "summary", "body", "technologies", "kind", "status", "sort_order") VALUES
(
  'cogniagent-gutenberg-redesign',
  'CogniAgent · platform redesign',
  'Led the first rebuild of the marketing site: a full redesign, a move from legacy page structures to Gutenberg blocks, and a faster, more reliable publishing workflow.',
  $case$The challenge was to redesign a live marketing site while replacing legacy page structures with a system the content team could actually maintain. I led the implementation of reusable Gutenberg blocks and the page architecture behind the new experience.

I worked across responsive UI, motion, performance, testing, and SEO. The block system made new pages more consistent and gave editors a clearer way to assemble and update content. I coordinated technical SEO decisions with SEO specialists as the site changed.

This was the first stage of CogniAgent’s site evolution. It established a maintainable content foundation before the later platform migration.$case$,
  ARRAY['Content architecture', 'Gutenberg', 'Performance', 'SEO', 'QA']::text[],
  'commercial', 'published', 0
),
(
  'cogniagent-platform-migration',
  'CogniAgent · platform migration',
  'Led the next platform migration and the core implementation, from content and data architecture to AI-assisted publishing, deployment, and team delivery.',
  $case$The next stage called for more than a frontend refresh: the company needed a publishing platform that could support frequent marketing changes. I led the technical direction and most of the core implementation, including the Payload content model, database-backed architecture, React experience, and migration from the earlier site. Astro was part of the implementation, but the central decision was how content, data, and publishing should work together.

I also led day-to-day delivery: planning and prioritization with the team, coordination of development and QA, and automation of repetitive marketing workflows. Another developer contributed fixes and additions; I owned the main architecture and implementation and handled substantial frontend, backend, QA, and DevOps work. I built a repository-based AI agent harness and MCP-enabled workflows to help produce and publish landing pages locally, with review and testing still part of the process.

For a landing page, the publishing workflow went from roughly 12 hours to about 2–4 hours. That figure describes this workflow, not a site-wide average. I set up deployment and monitoring infrastructure and kept SEO requirements in the migration and publishing process, working with SEO specialists.$case$,
  ARRAY['Payload CMS', 'React', 'Content architecture', 'AI/MCP workflows', 'CI/CD', 'Monitoring']::text[],
  'commercial', 'published', 1
),
(
  'gloriumtech-legacy-modernization',
  'Glorium Technologies · legacy modernization',
  'Set the architecture and delivery workflow for modernizing a live legacy site in stages, keeping publishing available throughout the transition.',
  $case$The site needed a path away from its legacy architecture without stopping content work or taking the existing site offline. I defined the migration approach and development workflow so new work could be introduced incrementally while the current experience continued to serve visitors and editors.

My responsibilities included technical direction, quality control, CI/CD, and coordination around SEO with specialists. The architecture is the foundation for a broader migration and redesign; those later stages are ongoing work, not completed outcomes. I am also developing AI agent workflows to support that next phase.$case$,
  ARRAY['Architecture', 'Incremental migration', 'CI/CD', 'SEO', 'AI workflows']::text[],
  'commercial', 'published', 2
),
(
  'min-commerce-multisite',
  'MIN · international commerce',
  'Owned the evolution of an international multisite commerce experience, rebuilding key buying flows and expanding product capabilities while the business kept operating.',
  $case$I was the primary developer and day-to-day project lead for the international and main storefronts. The work combined legacy modernization with ongoing product delivery: I rebuilt major parts of the cart and checkout, extended the commerce system, integrated payments, and introduced B2B capabilities.

I configured multisite behavior and geography-based redirects to support different markets. I also improved performance, maintained existing flows, and worked on SEO with specialists. I handled planning and delivery directly, bringing in QA support when needed. The emphasis was on making the product easier to buy from, operate, and extend rather than on the CMS behind it.$case$,
  ARRAY['E-commerce', 'Multisite', 'Checkout', 'Payments', 'B2B', 'WordPress']::text[],
  'commercial', 'published', 3
),
(
  'myco-meditations-redesign',
  'Myco Meditations · continuous redesign',
  'Rebuilt a difficult-to-maintain site around reusable content blocks, then delivered a second redesign while existing pages remained live.',
  $case$I led development and project coordination through a full redesign and a later second redesign. The central problem was replacing a fragile legacy implementation with a block-based structure that editors could use without fighting the admin experience.

I rebuilt page components and content workflows, improved frontend and admin performance, and added selected animations. The second redesign was delivered incrementally alongside the existing site, preserving the live experience during the transition. I also handled SEO work and communication with SEO specialists.$case$,
  ARRAY['Content architecture', 'Gutenberg', 'Performance', 'Motion', 'SEO']::text[],
  'commercial', 'published', 4
)
ON CONFLICT ("slug") DO NOTHING;
