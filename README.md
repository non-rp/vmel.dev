# vmel.dev

Personal portfolio of Valentyn Melnychenko, built with React, TypeScript, Vite and Three.js.

The application lives in [`vmel.dev/`](vmel.dev/). See the [application README](vmel.dev/README.md) for implementation details, browser checks and deployment instructions, and [DESIGN.md](DESIGN.md) for the design reference.

## Local development

Use Node.js 22.12 or newer. Run these commands from the repository root:

```sh
cd vmel.dev
npm ci
npm run dev
```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Build and checks

Run these commands from the application directory:

```sh
npm run build
npm run lint
npm run typecheck
npm run test:deploy
npx playwright install chromium
npm run test:e2e
```

Project rules are in [AGENTS.md](AGENTS.md), and repository-local skills live in
[.agents/skills](.agents/skills). See [CI and deployment](docs/deployment.md) for
the Docker release workflow and the production setup still required.
