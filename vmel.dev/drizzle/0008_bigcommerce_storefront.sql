INSERT INTO "projects" ("slug", "title", "summary", "body", "technologies", "kind", "status", "sort_order") VALUES (
  'custom-bigcommerce-storefront',
  'Custom BigCommerce storefront',
  'Developed a tailored commerce storefront on BigCommerce, combining custom theme work with customer-group-specific shopping experiences.',
  $case$## A custom storefront within a hosted platform
As the primary developer, I built most of this e-commerce storefront using BigCommerce Stencil and its Cornerstone reference theme. The work involved learning the platform, setting up a local development environment and adapting the storefront to the requirements of an existing business within the constraints of a hosted commerce system.

## From discovery to purchase
I developed and refined the homepage, category and product experiences, search, account pages and responsive navigation. The work also included a blog, gallery, contact page and dealer-facing content. I addressed details across the shopping journey, including product displays, search pagination, account controls and add-to-cart behavior for different product types.

## Experiences for different customers
I implemented storefront changes for customer groups, including dealer navigation and quantity inputs, and displayed discounted prices for eligible military and veteran customers. These features brought business-specific requirements into the existing platform and theme rather than a separate storefront.

## Working with platform constraints
The theme combined Stencil templates, JavaScript and SCSS with BigCommerce-managed content and scripts. I adapted custom templates and frontend behavior to that environment, including changes to inline scripts for local development. The repository records work from April to August 2023; the implementation evolved through iterative fixes and QA.$case$,
  ARRAY['BigCommerce', 'Stencil', 'Cornerstone', 'JavaScript', 'SCSS', 'E-commerce']::text[],
  'commercial', 'published', 6
) ON CONFLICT ("slug") DO NOTHING;
