# Delivery and server operations

## Scope

The user authorized the vmel.dev VPS setup and monitoring. Only the portfolio deployment directory, its Nginx site and dedicated monitoring project may be changed. Existing RPS services and static portfolio releases are preserved. Do not change other domains, global Docker settings, host packages or run global prune.

## Verified release

GitHub-hosted Ubuntu/Node.js 24 runs lockfile installation, Oxlint, strict TypeScript, Vitest, migration/admin bootstrap in isolated PostgreSQL, deployment tests, Next production build and Playwright/axe. Redis is a real test service. A Node runtime image packages the tested standalone build and production dependencies, then passes Compose health, release identity, homepage and 404 checks. An image archive plus SHA256 checksum is retained for seven days. PRs get verification artifacts without production secrets; only main can deploy.

The VPS needs Docker/Compose and host Nginx, with no host npm install or source checkout. The app listens on 127.0.0.1:4174 behind existing HTTPS. PostgreSQL and Redis have no published ports. Each service has resource/log limits. Runtime secrets are not compiled into the image.

## Production files and secrets

Portfolio state lives in /var/www/vmel.dev/docker:

- server.env (mode 600): POSTGRES_PASSWORD (generated URL-safe hex), BETTER_AUTH_SECRET (at least 32 random characters), BETTER_AUTH_URL=https://vmel.dev.
- compose.yml, deploy-docker.sh, ssh-command.sh.
- incoming/: retained image archives/checksums.
- current-image and previous-image: full-SHA image records.
- backups/: private pre-migration PostgreSQL dumps and original Nginx config.

The owner is created by running the image's scripts/create-admin.mjs with private ADMIN_EMAIL, ADMIN_PASSWORD and optional ADMIN_NAME. No public signup or default production password exists. Do not put ADMIN_PASSWORD into the persistent web container's environment. Keep recovery credentials in a password manager.

GitHub production secrets: VPS_HOST, VPS_USER, VPS_PORT, VPS_SSH_KEY and VPS_KNOWN_HOSTS. Use a dedicated ED25519 key. Authorize it with restrict and a forced command pointing to ssh-command.sh; it accepts only vmel-upload <40-hex-SHA> and vmel-deploy <SHA>. The key cannot use ordinary SSH/SFTP commands. The release code and Docker access remain privileged; only trusted main-branch code receives production secrets. Configure environment deployment branches to main; reviewer protection is optional user policy, not implied by YAML. DEPLOY_ENABLED=true enables automatic main pushes after server setup.

## First deployment

Prepare the portfolio directory and generated server.env. Transfer the checked release and Compose/script files, then run deploy-docker.sh SHA without VMEL_VERIFY_PUBLIC before changing Nginx. It starts the private database/cache, takes a database dump, runs versioned migrations and waits for app health. Check the loopback release.txt.

Back up only /etc/nginx/sites-available/vmel.dev into the portfolio backups. Install deploy/nginx-docker.conf for that site, run nginx -t and reload. Check HTTPS homepage, /api/health, exact /release.txt, 404, admin login, HTTP and www redirects. Restore the backed-up site config if cutover fails. Original /var/www/vmel.dev/current and releases remain available.

## Updates and rollback

Deployments are serialized in Actions and on the VPS with flock. The checksum is verified before loading the image. A private pg_dump -Fc backup precedes every migration. Migrations must be additive/compatible with the previous app; review generated SQL before release. The app's image record is promoted only after local and public SHA checks. A failed update restores the old web image; a first-release failure stops web and keeps database/cache data.

Application rollback does not undo database schema changes. Never automate destructive schema rollback. To restore data, stop web, inspect the intended private dump, back up current state and restore only this project's database with pg_restore, then restart a compatible app. A dump is not an off-site backup: retention, encrypted off-site copies and scheduled restore exercises are follow-up operations.

For an app rollback, choose the recorded previous SHA and retained archive, then run the release script again. Before a first migration cutover, restoring the saved host Nginx configuration returns to the old static site. No global prune or volume deletion is part of rollback.

This is a single app container: releases can briefly interrupt traffic, and open tabs may need refreshing after a hashed-asset change.

## Monitoring

Beszel uses deploy/monitoring.yml as vmel-monitoring under /var/www/vmel.dev/monitoring. Hub port 8090 binds only to loopback. Hub/agent data and their Unix socket are project-owned. The agent observes host load and Docker containers; Docker socket access is privileged even with a read-only mount.

Access the dashboard privately:

```sh
ssh -N -L 8090:127.0.0.1:8090 myvps
```

Open http://localhost:8090. Create the owner if not bootstrapped yet, add this VPS with Host/IP=/beszel_socket/beszel.sock, and set the generated BESZEL_KEY/BESZEL_TOKEN in monitoring.env (mode 600). Restart the agent with docker compose --env-file monitoring.env -f monitoring.yml up -d. No public DNS or firewall opening is needed. See https://beszel.dev/guide/getting-started.

## Local verification

Use npm.cmd on Windows. Keep npm cache, browser binaries, temporary files and private credentials under the ignored root .qa. Deployment tests fake Docker and curl and never contact the VPS. Administrative browser tests reject any database except local vmel_test; never enable them against production. Public Playwright tests can inspect HTTPS read-only through QA_BASE_URL.
