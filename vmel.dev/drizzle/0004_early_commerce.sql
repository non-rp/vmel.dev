INSERT INTO "projects" ("slug", "title", "summary", "body", "technologies", "kind", "status", "sort_order") VALUES
(
  'sumy-pizza-storefront',
  'Sumy Pizza · food delivery storefront',
  'An early commerce project for a local food delivery business, spanning a product catalogue and ordering-focused storefront.',
  $case$## Earlier commerce work
This food delivery storefront is one of my early OpenCart projects. The archived screens show a catalogue built around pizza, sushi and other food categories, with product cards, prices and clear order actions.

## What the interface had to do
The shopping path needed to let visitors move from food categories to products and the cart. The design also had to keep delivery and contact information easy to find. It is useful context for my later, deeper ownership of checkout and multi-market commerce systems.

## Evidence and scope
The available evidence is a set of historical screenshots rather than a source repository. I present the visible storefront and my involvement as early commerce experience, without attributing specific payment integrations, conversion outcomes or present-day site behavior. The images are archival.$case$,
  ARRAY['OpenCart', 'E-commerce', 'Storefront UI']::text[],
  'commercial', 'published', 6
),
(
  'lilistudio-storefront',
  'LiliStudio · craft supplies storefront',
  'An early OpenCart commerce project for a broad craft and decoration catalogue, with category-led product discovery.',
  $case$## Earlier commerce work
LiliStudio is another early OpenCart project. The store presents a wide range of craft materials and decoration products, so category navigation and product discovery are central to the experience.

## The storefront
The public pages show a large category hierarchy, search, basket entry points and product listings. Working on this store gave me practical experience with catalogue-heavy commerce interfaces before the later MiN work.

## Evidence and scope
The available materials are screenshots, not a source repository that would establish every implementation detail. This case therefore focuses on the visible product and my early e-commerce experience, without claiming ownership of unverified integrations or business metrics. The image shows the current public storefront.$case$,
  ARRAY['OpenCart', 'E-commerce', 'Product discovery']::text[],
  'commercial', 'published', 7
)
ON CONFLICT ("slug") DO NOTHING;
