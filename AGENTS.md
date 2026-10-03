# Project instructions

## Scope and evidence

- Modify files only inside `D:/work/Pets/vmel.dev`. Do not install skills globally or edit sibling projects, user settings or shared configuration.
- Do not read or write `memory.md`, `MEMORY.md`, persistent agent memories or past-activity archives. Work from the current request, current repository files, commands and applicable documentation.
- Other project folders may be inspected read-only when the user authorizes them as research inputs. Never copy their credentials, databases, customer data or proprietary source into this public repository.
- Remote GitHub and VPS mutations must stay within the user's explicitly authorized work. If a local-only restriction makes deployment authorization ambiguous, finish and verify the local implementation before clarifying the remote step.
- Do not delegate work to other agents unless the user explicitly requests it.

## Repository map

- Git repository root: this directory. Application root: `vmel.dev/`.
- Application: React, TypeScript, Vite and Three.js; the production output is static.
- `vmel.dev/src/content.ts` holds profile data; `DESIGN.md` holds the visual reference.
- `vmel.dev/tests/` contains browser and deployment tests.
- `.github/workflows/ci.yml` builds, checks and packages the site on GitHub-hosted Linux runners.
- `vmel.dev/deploy/` and `vmel.dev/scripts/deploy-docker.sh` define Docker delivery. See `docs/deployment.md` before deployment work.
- `.qa/` is ignored local scratch space. Keep caches, temporary files, private keys and browser evidence there; never stage them.

## Local skills

Read the relevant skill before its workflow:

- Git changes and pull requests: `.agents/skills/vmel-git/SKILL.md`.
- Application edits and style checks: `.agents/skills/vmel-code-style/SKILL.md`.
- Verification and browser QA: `.agents/skills/vmel-testing/SKILL.md`.
- Docker, Actions, server releases and rollback: `.agents/skills/vmel-deploy/SKILL.md`.

Skills are repository-owned and may be selected normally; they do not grant additional permissions.

## Product and delivery

- Keep portfolio copy in English. Position the site around senior full-stack responsibilities, substantive migrations, architecture and AI/MCP workflows supported by current evidence.
- Commercial case studies are anonymized for now. Confirm personal responsibilities before attributing work. Do not invent metrics, client endorsements or completed deployments.
- Personal projects have a separate identity from commercial work. Preserve accessibility, reduced motion, keyboard navigation and mobile layouts.
- Never publish the local CV, environment files, credentials, raw client material or `.qa/` artifacts.
- Preserve user changes. Run checks appropriate to the change and report actual results and remaining setup requirements.
