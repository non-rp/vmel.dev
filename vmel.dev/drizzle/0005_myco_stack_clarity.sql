-- The available Myco theme uses custom WPBakery/ACF components, not Gutenberg blocks.
UPDATE "projects"
SET "technologies" = ARRAY['Content architecture', 'Custom content blocks', 'Performance', 'Motion', 'SEO']::text[]
WHERE "slug" = 'myco-meditations-redesign' AND "updated_at" = "created_at";
