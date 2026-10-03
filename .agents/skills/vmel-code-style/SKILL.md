---
name: vmel-code-style
description: Implement and review React, TypeScript, CSS and build tooling changes in vmel.dev using its existing conventions.
---

# Application conventions

Read the nearby implementation and configuration before editing. Preserve the existing visual system in `DESIGN.md` and `src/styles.scss`; avoid unrelated formatting sweeps through the compact existing CSS and JSX.

Use TypeScript with the repository's strict compiler settings. Keep profile content separate from rendering. Extract components when they provide a clear ownership or reuse boundary; do not introduce a framework or dependency for a small native feature.

Follow React Hooks rules and clean up subscriptions, observers, timers and Three.js resources. Preserve SSR-safe browser guards where storage or WebGL can fail. Use semantic HTML, meaningful accessible names, keyboard interaction and the existing reduced-motion preference.

Keep first-party fonts and visual assets local. Use the established CSS variables for typography, colors and spacing. New or substantially rewritten CSS can be readable multiline CSS without reformatting unrelated rules.

Run `npm run lint` and `npm run typecheck` from `vmel.dev/` for application edits. On Windows use `npm.cmd` when needed. Set npm's cache inside the ignored repository `.qa/` when running locally under the project-only write restriction.

Use Server Components and route handlers for database/authentication work. Keep secrets and database modules server-only. Validate writes with Zod, check the session role and same-origin writes, and query published projects explicitly. Never expose draft content through public APIs. Render case text as escaped text; commercial cases remain anonymized.

Use SCSS nesting for component ownership without deep selector chains. Zustand holds UI state, not a duplicate database. Generate and commit Drizzle SQL migrations; do not use schema push against production. Auth registration is disabled; bootstrap the owner through the private CLI.
