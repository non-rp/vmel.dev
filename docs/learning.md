# Practice roadmap

The working foundation makes each part observable. Start with one layer, change it yourself, then use its tests to check your understanding.

## Request flow

Public request ? Next Server Component ? published-only Drizzle query ? PostgreSQL, with a Redis cache for the project list ? escaped HTML plus interactive React/Three.js. Draft detail requests return 404. Commercial case pages use noindex, which does not replace anonymization or publication permission.

Admin form ? same-origin route handler ? Better Auth session and owner role ? Zod input ? Drizzle write/transaction ? Redis generation invalidation ? refreshed owner list. Zustand stores motion preferences and the active filter/editor, while PostgreSQL remains the source of project data.

## Exercises

1. Trace one project creation from the form to SQL. Add an optional project year yourself: schema, reviewed migration, Zod rules, form, public rendering and boundary tests.
2. Explain why checking only /admin is insufficient. Add API tests for malformed JSON, duplicate slugs and a forged role. Inspect secure HttpOnly cookies on HTTPS.
3. Implement draft previews using short-lived tokens. Decide which requests can read drafts and test expiry/revocation before exposing the feature.
4. Extend Redis use with a measured purpose: rate limiting or counters. Simulate Redis failure and show which operations still work; keep durable content in PostgreSQL.
5. Add a test for editing the same project from two tabs. Implement an updatedAt/version check to prevent silently overwriting newer work.
6. Read the Docker layers and follow a CI artifact through SSH to release.txt. Practice rollback on a test deployment and restore a database dump into an isolated test database.
7. Use Beszel to observe a load test against a test environment. Record actual latency, error rate and memory; never invent portfolio metrics.

Choose one exercise at a time. Authentication internals, migrations, cache races and restoration deserve explanation and deliberate practice even when libraries provide the base implementation.
