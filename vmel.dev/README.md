# vmel.dev

Senior full-stack portfolio and owner workspace. Commercial cases are anonymized; personal projects can link to source and demos. No CV, client source, invented metrics or private assets are published.

## Stack

Next.js App Router + React + TypeScript; SCSS and Three.js; Drizzle/PostgreSQL; Redis public-query cache; Better Auth owner sessions; Zod validation; Zustand UI state. Vitest and Playwright/axe cover validation, authentication and accessibility. Docker, GitHub Actions and host Nginx deliver the site; Beszel monitors the VPS.

## Development

Use Node.js 24 (22.19 also passed local checks). Windows: use npm.cmd when PowerShell blocks npm.ps1. From this directory:

```sh
npm ci
cp .env.example .env.local
# Replace the example auth secret and owner password before use.
docker compose -f deploy/development.yml up -d --wait
npm run db:migrate
npm run db:admin
npm run dev
```

The dev database stores data under the repository's ignored .qa/development folder. Container image storage belongs to Docker; run Docker only in an environment where that is authorized. Production uses its own private database and generated secrets. Owner login is /admin/login; public registration is disabled. Remove ADMIN_PASSWORD from your environment after bootstrap.

## Checks

```sh
npm run lint
npm run typecheck
npm run test
npm run test:deploy
npm run build
npm run test:e2e
```

Playwright uses port 4173. Set BETTER_AUTH_URL=http://127.0.0.1:4173 for that server. Admin mutation tests additionally require RUN_ADMIN_E2E=true and a loopback database named vmel_test; CI prepares it automatically. Normal e2e runs only public checks.

## Files

- app/: public pages, admin pages and API route handlers.
- src/db/schema.ts and drizzle/: typed schema and versioned SQL migrations.
- src/lib/: server-only database queries, auth, cache and request validation.
- src/components/: login and owner workspace.
- src/stores/: local preferences and admin UI filter/editor state.
- src/styles.scss and src/styles/: SCSS design rules.
- src/content.ts: verified profile copy; DESIGN.md: visual reference.
- ../docs/deployment.md: server delivery, secrets, backup and rollback.
- ../docs/learning.md: data flow and practical exercises.

Never run the retired static Vite deployment path. The current Docker runtime requires PostgreSQL migrations before serving the app.
