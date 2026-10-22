-- Keep the new case ahead of the older 2022 and OpenCart work, without changing
-- any portfolio ordering that has since been edited in Admin.
UPDATE "projects" SET "sort_order" = "sort_order" + 1
WHERE "slug" IN ('centrum-forme-editorial-platform', 'sumy-pizza-storefront', 'lilistudio-storefront')
  AND "sort_order" BETWEEN 5 AND 7 AND "updated_at" = "created_at";

INSERT INTO "projects" ("slug", "title", "summary", "body", "technologies", "kind", "status", "sort_order") VALUES (
  'todos-tambien-business-platform',
  'Todos También · business publishing platform',
  'Designed and implemented a self-service publishing system for business pages, connecting owner accounts, editorial approval, premium subscriptions and a location-based directory.',
  $case$## The product idea
Todos También serves Latino entrepreneurs and communities in Canada. I proposed a way for businesses to create their own multilingual landing pages and appear in a searchable, map-based directory. I presented the solution on client calls, secured approval for the approach and later demonstrated the finished flows during onboarding.

## From registration to publication
I implemented the publishing journey around a business owner account. A guided form collects the page content, including business details, location, logo, representative image and a multi-image gallery with a visible primary image choice. Submitting it creates a landing page for administrator review; publication happens after that review rather than directly from the public form.

The owner can return to a personal dashboard and manage the page later. Making that work required the existing page data to populate the editing form again, including media and other structured fields. This two-way content flow was one of the harder parts of the implementation.

## Discovery and location
I connected approved business pages to the directory and interactive map. Location data gives visitors a geographic way to find businesses, while category browsing and English/Spanish content support discovery across the communities the platform serves. The map and business page are different views of the same published profile.

## Free and premium paths
The system supports free business pages and a paid premium subscription with a richer presentation. I connected registration, payment status and the business page experience so the appropriate features could be offered to owners. Public premium pages describe extended content, contact options, testimonials, gallery and map presentation; I do not attribute a conversion or revenue figure without evidence.

## My role
I owned the core publishing feature and its technical integration, not just the page UI. I worked through owner accounts, editable content, media uploads, administrator approval, directory visibility and premium behavior, and explained the solution directly to clients during calls and onboarding. The wider site was delivered by a team; this case focuses on the system I proposed and implemented.$case$,
  ARRAY['Publishing architecture', 'Owner dashboard', 'Moderation', 'Subscriptions', 'Geolocation', 'Multilingual UX']::text[],
  'commercial', 'published', 5
) ON CONFLICT ("slug") DO NOTHING;
