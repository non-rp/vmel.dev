-- Expand only untouched seed copy. Editorial changes made in Admin take precedence.
UPDATE "projects" SET "body" = $case$## The brief
The first CogniAgent rebuild had to change both the public experience and the way pages were made. The existing site relied on legacy page structures that were hard to reuse. I led the redesign and replaced that approach with an editor-facing block system.

## The block architecture
I built the reusable Gutenberg components and page patterns around the site's actual marketing needs. Instead of treating each landing page as a one-off template, the system gave editors a consistent set of sections to compose and update. The repository includes dedicated content, layout and feature blocks as well as page patterns.

- Define the content structure and reusable sections for marketing pages.
- Implement responsive frontend behavior and selected motion.
- Make the editing experience predictable for future pages.

## Delivery and quality
I worked across the theme, frontend, performance and testing rather than handing off the technical foundation after design. I also handled SEO implementation and discussed technical requirements with SEO specialists while the redesign was being delivered.

## What it enabled
The result was a maintainable publishing foundation for the first redesign and a clearer path to consistent new pages. This is a separate phase from the later Payload migration. The images here show the current public site, not an archive of the earlier Gutenberg release.$case$
WHERE "slug" = 'cogniagent-gutenberg-redesign' AND "updated_at" = "created_at";

UPDATE "projects" SET "body" = $case$## The platform decision
The next CogniAgent phase needed a content and publishing architecture, not another set of isolated landing pages. I led the move to a database-backed Payload model and a React-based delivery system. Astro is part of the frontend stack, but the central work was the relationship between structured content, page composition, publishing and operations.

## Content and data model
I designed the core architecture for routable content, reusable sections and editorial workflows. The implementation separates content types and gives page blocks an explicit contract so the CMS, rendering layer and AI tools can work with the same structure. Migration work had to preserve URL and SEO behavior while replacing legacy presentation assumptions.

## AI-assisted publishing
I built a local repository-based agent harness and MCP workflows for creating and updating marketing pages. The workflow brings content assembly, preview, review and publication into a repeatable process. For one landing page, the reported production and publishing time fell from roughly 12 hours to 2–4 hours. That is a workflow example, not a claim about every page.

## Ownership beyond code
I led technical direction and much of the core frontend and backend implementation while coordinating priorities, delivery and QA. I handled substantial DevOps work, deployment and monitoring, and worked with SEO specialists on migration and publishing requirements. Another developer contributed fixes and extensions; I owned the principal architecture and delivery path. Review and testing remained part of the AI-assisted process.$case$
WHERE "slug" = 'cogniagent-platform-migration' AND "updated_at" = "created_at";

UPDATE "projects" SET "body" = $case$## The constraint
Glorium Technologies has a live legacy site with ongoing content work. I set the architecture and workflow for modernizing it without requiring editors to stop publishing or taking existing routes offline.

## Migration design
The new platform is being built alongside the current one. The plan inventories page families, content entities, forms, media, routing and SEO before a route changes ownership. Structured content and dedicated blocks are introduced in preview, with explicit mapping and validation for legacy sections. The existing site continues to serve public traffic until a complete cutover is ready.

## Engineering process
I established the development direction and quality controls around incremental migration: source analysis, bounded content batches, reviewable changes, CI/CD and release checks. I coordinate implementation quality and technical SEO decisions with specialists. This work includes defining how a future redesign and AI-assisted workflows fit the target system.

## Current state
The architecture and migration workflow are in progress. The broader redesign, full content migration and public cutover are future stages, so I do not present them as completed results. The useful outcome today is a controlled path from the legacy system to a new one while content operations continue.$case$
WHERE "slug" = 'gloriumtech-legacy-modernization' AND "updated_at" = "created_at";

UPDATE "projects" SET "body" = $case$## Product ownership
I was the primary developer and day-to-day project lead for MiN New York's main and international commerce sites. The job combined keeping a live store working with replacing fragile legacy behavior and adding capabilities that supported purchasing and wholesale operations.

## The buying journey
I rebuilt substantial parts of the cart and checkout, extended store behavior and integrated payment flows. I worked through the detail that makes commerce usable: how shoppers move between products, cart, checkout and the order outcome, and how changes fit the existing operations.

## Multiple markets and B2B
I configured the multisite setup and geography-based routing between regional storefronts. I also introduced B2B order capabilities and expanded the underlying commerce logic. Those decisions connected market entry, storefront behavior and purchasing rather than treating each screen as a separate task.

## Ongoing delivery
I improved performance, maintained existing flows, handled planning and coordinated QA when needed. I implemented SEO changes and worked with SEO specialists. The implementation used WordPress and WooCommerce, but the central contribution was product ownership across commerce architecture, buying flows and international operations. I do not claim a revenue figure that has not been verified.$case$
WHERE "slug" = 'min-commerce-multisite' AND "updated_at" = "created_at";

UPDATE "projects" SET "body" = $case$## A live site, two redesigns
MycoMeditations needed to replace a difficult-to-maintain site while continuing to publish. I led development and project coordination for a full rebuild, followed by a second visual redesign delivered alongside the existing site.

## An editor-friendly foundation
I reworked the page architecture into reusable content blocks and rebuilt the frontend sections around them. The point was to make future pages consistent for visitors and easier for editors to manage, including the admin experience rather than only the public-facing design.

## Performance, motion and rollout
I optimized the site and its editing workflow, implemented selected animations, and delivered the later redesign incrementally so existing pages could remain available during transition. I handled the technical delivery and day-to-day project management.

## Search and continuity
I implemented SEO changes and coordinated requirements with SEO specialists throughout the work. The current public site is visual context for the case; it does not document every earlier design state.$case$
WHERE "slug" = 'myco-meditations-redesign' AND "updated_at" = "created_at";
