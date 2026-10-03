---
name: vmel-testing
description: Select and run build, Playwright accessibility and deployment verification for vmel.dev changes.
---

# Verification

Run commands from the nested application directory. Use the smallest set that addresses the change, then broaden only when a failure or unresolved concern justifies it.

- TypeScript and rendering: `npm run lint`, `npm run typecheck`, `npm run build`.
- User-visible behavior or layout: build, then `npm run test:e2e`; inspect current screenshots for layout changes.
- Deployment logic: `npm run test:deploy`; the tests use isolated fake Docker and curl commands and must not contact or modify the VPS.
- Container configuration: validate Compose and build/smoke-test the image on the GitHub runner, or locally only when that execution fits the user's filesystem restriction.

Playwright covers WebGL fallback, interactions, clipboard behavior, reduced motion, persistence, mobile navigation, narrow-screen overflow and axe accessibility checks. Add behavior coverage when a new interaction or failure path needs it; do not add tests that merely duplicate implementation text.

Use fresh local build output. In CI do not reuse an existing preview server. Keep browser binaries, npm cache, temporary files, screenshots, traces and reports under ignored `.qa/` or test-output folders. Use `PLAYWRIGHT_BROWSERS_PATH` and npm cache settings inside this repository for local installation.

Report what actually ran. A passing typecheck does not establish visual correctness, a container build does not establish VPS delivery, and a successful deployment requires checking the served release identity.
