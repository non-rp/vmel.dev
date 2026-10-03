---
name: vmel-deploy
description: Prepare and operate the vmel.dev GitHub Actions, Docker image, VPS release and rollback workflow within its authorized deployment scope.
---

# Delivery workflow

Read `docs/deployment.md`, `.github/workflows/ci.yml`, `vmel.dev/deploy/compose.yml` and the release script before changing delivery behavior.

The application builds on GitHub-hosted Ubuntu runners. The tested `.next/standalone` and static assets are packaged into a non-root Node.js 24 image tagged with the exact Git SHA. Transfer that image over SSH; the VPS does not need Node.js, npm, a source checkout, a container-registry token or a GitHub runner.

The Compose project is `vmel-portfolio`. Its application binds only to `127.0.0.1:4174`; host Nginx retains TLS termination. Remote project state is confined to `/var/www/vmel.dev/docker` and the site's own Nginx configuration. Do not modify RPS containers, their networks or databases, other domains, global Docker configuration or host packages.

Use a dedicated deployment SSH key and pinned known-host entry. Never disable SSH host verification or print secret values. Keep production credentials in GitHub Actions secrets and local key material only in ignored `.qa/`.

PRs run checks without production secrets. Deployment uses the production environment and the exact tested SHA; environment protections must be configured in GitHub settings. Keep deployment serialized without cancelling a running release. `DEPLOY_ENABLED` controls automatic main-branch deployment; missing configuration must fail a requested deployment clearly.

Check the image archive checksum before loading it, wait for container health and verify `/release.txt`. On failure restore the previously active image. Retain previous images and release records; do not run global Docker prune or destructive cleanup.

Changing the public site from static Nginx delivery to Docker requires a one-time configuration switch with a backup, `nginx -t` and a public smoke check. Perform it only within explicit server-change authorization. A local-only instruction does not authorize remote writes by itself.

Compose owns separate PostgreSQL and Redis services with private networking and a persistent PostgreSQL volume. Runtime secrets live in project-owned server.env, mode 600; do not bake them into the image or transfer them in CI artifacts. Back up PostgreSQL before migrations; only ship migrations compatible with the previous application. App rollback does not undo database migrations. Never delete database volumes on deployment failure.

Beszel lives in the separate vmel-monitoring Compose project, with a loopback-only hub and a local agent socket. Access it through SSH forwarding. Its Docker socket access is privileged even when mounted read-only. Do not expose the monitoring port publicly.

The dedicated Actions SSH key uses the installed ssh-command.sh forced command and restrict option; only vmel-upload SHA and vmel-deploy SHA are accepted. Do not weaken SSH verification. Docker delivery remains privileged; production credentials must be restricted to main.
