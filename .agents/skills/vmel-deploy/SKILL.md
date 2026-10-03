---
name: vmel-deploy
description: Prepare and operate the vmel.dev GitHub Actions, Docker image, VPS release and rollback workflow within its authorized deployment scope.
---

# Delivery workflow

Read `docs/deployment.md`, `.github/workflows/ci.yml`, `vmel.dev/deploy/compose.yml` and the release script before changing delivery behavior.

The application builds on GitHub-hosted Ubuntu runners. The tested `dist/` is packaged into a non-root Nginx image tagged with the exact Git SHA. Transfer that image over SSH; the VPS does not need Node.js, npm, a source checkout, a container-registry token or a GitHub runner.

The Compose project is `vmel-portfolio`. Its application binds only to `127.0.0.1:4174`; host Nginx retains TLS termination. Remote project state is confined to `/var/www/vmel.dev/docker` and the site's own Nginx configuration. Do not modify RPS containers, their networks or databases, other domains, global Docker configuration or host packages.

Use a dedicated deployment SSH key and pinned known-host entry. Never disable SSH host verification or print secret values. Keep production credentials in GitHub Actions secrets and local key material only in ignored `.qa/`.

PRs run checks without production secrets. Deployment uses the production environment and the exact tested SHA; environment protections must be configured in GitHub settings. Keep deployment serialized without cancelling a running release. `DEPLOY_ENABLED` controls automatic main-branch deployment; missing configuration must fail a requested deployment clearly.

Check the image archive checksum before loading it, wait for container health and verify `/release.txt`. On failure restore the previously active image. Retain previous images and release records; do not run global Docker prune or destructive cleanup.

Changing the public site from static Nginx delivery to Docker requires a one-time configuration switch with a backup, `nginx -t` and a public smoke check. Perform it only within explicit server-change authorization. A local-only instruction does not authorize remote writes by itself.
