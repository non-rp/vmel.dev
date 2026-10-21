INSERT INTO "projects" ("slug", "title", "summary", "body", "technologies", "kind", "status", "sort_order") VALUES (
  'centrum-forme-editorial-platform',
  'Centrum ForMe · editorial platform',
  'Built the bespoke frontend and editable content architecture for a Polish psychotherapy service, connecting therapist discovery, training content and contact journeys.',
  $case$## The product
Centrum ForMe needed a clear public experience for online psychotherapy and educational content. I built the bespoke theme and integrated its frontend with an editorial system that the team could operate without changing templates for routine content.

## Content architecture
I modelled therapists and training programmes as distinct content types, with audience categories for parents and teachers. The homepage, specialist listings, training pages and shared site settings could then draw from structured fields. Versioned field definitions kept the editing model consistent with the code.

## Frontend and reusable pieces
I implemented the responsive interface using reusable page components, navigation and a compiled SCSS/JavaScript pipeline. Content cards and shared templates connected the site's visual design to therapist discovery and training listings.

## Delivery boundary
The public site also presents a booking and payment journey. My documented repository scope covers the site frontend, content structure, navigation and contact form integration; I do not attribute the external session payment system to this work. This 2022 project is shown as earlier commercial experience after the more recent platform and commerce cases.$case$,
  ARRAY['Frontend', 'Content modelling', 'ACF', 'WordPress', 'Responsive UI']::text[],
  'commercial', 'published', 5
) ON CONFLICT ("slug") DO NOTHING;
