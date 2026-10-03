# CI and VPS delivery

This implementation targets the current **React + TypeScript + Vite** static site.
The user is considering Next.js without Payload. Do not migrate the application
or enable production delivery until that choice is settled; a Next.js server
would need a different runtime image and proxy policy.

## Current infrastructure

Read-only inspection on 2026-10-03 confirmed Linux, Docker, Docker Compose and
host Nginx on the existing `myvps` SSH target. The portfolio currently uses
`/var/www/vmel.dev/current`. RPS has separate application and database containers.
No server files or containers were changed while preparing this workflow.

## Checks and release artifact

Pull requests and main-branch pushes run on GitHub-hosted Ubuntu with Node.js 24:

1. Install the lockfile dependencies.
2. Run Oxlint, the strict TypeScript check and isolated deployment tests.
3. Build the production site and run Playwright, including axe checks.
4. Build an Nginx image from that same tested `dist/`.
5. Start it with the production Compose configuration; verify health, exact
   Git SHA, the homepage and a real 404 response.

Only non-PR runs save the image as an archive and checksum. Production receives
the exact verified image over SSH. There is no source checkout or npm install on
the VPS and no registry credential to maintain there. Official Actions and the
Nginx base image are pinned; Dependabot proposes updates for review.

## Configuration still required

Set up a GitHub `production` environment. Apply the branch and reviewer rules
appropriate to this repository; merely naming the environment in YAML does not
create approval protection. Restrict it to `main`.

Add these environment or repository secrets:

| Secret | Purpose |
| --- | --- |
| `VPS_HOST` | Actual host name or IPv4 address, not the local `myvps` SSH alias |
| `VPS_USER` | Account authorized for this site's Docker delivery directory |
| `VPS_PORT` | SSH port; omitted means 22 |
| `VPS_SSH_KEY` | Dedicated deployment private key |
| `VPS_KNOWN_HOSTS` | Trusted OpenSSH host entry, checked against the known server fingerprint |

Do not reuse or commit a personal SSH private key. Generate a deployment key in
the ignored root `.qa/` if local key creation is requested. Authorize its public
key on the VPS only after remote changes are authorized. Do not trust an
unverified `ssh-keyscan` result as the identity check.

The workflow intentionally leaves `DEPLOY_ENABLED` unset. To enable automatic
main-branch delivery, set that repository variable to `true` **after** preparing
the server and switching the domain. A main-branch manual workflow run with
`deploy: true` also requests deployment and fails clearly if setup is missing.
PRs and other refs cannot deploy production.

## One-time server transition

This step changes remote state. The user's project-only write restriction must
be clarified before executing it. Until then, finish local verification and
keep production delivery disabled.

Prepare only `/var/www/vmel.dev/docker/incoming`, grant the deployment account
access to this project directory and Docker, and install `compose.yml` and
`deploy-docker.sh` there. Docker access is privileged; keep the deployment key
dedicated to this purpose. Confirm the VPS architecture matches the image built
on the Ubuntu runner (normally `linux/amd64`).

Deploy the first verified image and confirm
`http://127.0.0.1:4174/release.txt` matches its full Git SHA. The container binds
to loopback, runs Nginx without root, has a read-only filesystem and bounded
resources. Host Nginx continues to own certificates and HTTPS.

Back up `/etc/nginx/sites-available/vmel.dev` under the project's deployment
directory. Replace only that site's configuration with
`vmel.dev/deploy/nginx-docker.conf`, run `nginx -t`, then reload Nginx. Confirm
the public homepage, `/release.txt`, `www` redirect and HTTP-to-HTTPS redirect.
If validation fails, restore the configuration backup, validate it and reload.
The original static releases stay intact for rollback.

Do not modify RPS, other hostnames, global Docker configuration or install host
packages. The older `scripts/deploy.ps1`, `deploy/activate.sh` and
`deploy/nginx.conf` remain the static deployment path; do not run that path after
the Docker switch, because it would restore the static Nginx configuration.

## Updates and rollback

The release script serializes deployment with `flock`, checks the archive
checksum and verifies the image exists. Compose waits for health; the script
also checks the served SHA. Only then does it replace `current-image` and record
`previous-image`. A failed update restores and verifies the previous image. A
failed initial release removes only the newly created Compose project and
leaves the existing host Nginx configuration alone.

Actions sets `VMEL_VERIFY_PUBLIC=true`, so the release script also verifies
the public SHA before committing its state and rolls back if that check fails.
Leave it unset for the first local-container deployment before switching host
Nginx. The Actions runner additionally checks the public endpoint from outside
the VPS; a failure only from that network needs investigation and is reported
as a failed workflow.

For manual rollback, read the previous image record, confirm it is the intended
release, then deploy its SHA using the retained archive and release script.
Previous archives and images are retained; cleanup is a separate bounded task.
Never run global `docker system prune` on this shared VPS.

Compose replaces the site's single container during an update, so a brief
interruption is possible. Old hashed assets are not retained in the new image;
an already-open browser tab may need refreshing after a release. This is the
initial single-instance setup, not a zero-downtime or blue/green system.

## Local verification

Run from `vmel.dev/`:

```sh
npm run lint
npm run typecheck
npm run test:deploy
npm run build
npm run test:e2e
```

The deployment tests create fixtures only under the root `.qa/deploy-tests/`
and fake Docker and HTTP commands. They exercise success, local and public
identity mismatch, checksum rejection, invalid SHA and first-release cleanup
without server access.

On Windows, use `npm.cmd`; Bash comes from Git for Windows. An alternative Bash
binary can be provided through `BASH_EXE`. Keep npm cache, browser installation
and temporary files inside this project under the local write restriction:

```powershell
$env:npm_config_cache = 'D:\work\Pets\vmel.dev\.qa\npm-cache'
$env:PLAYWRIGHT_BROWSERS_PATH = 'D:\work\Pets\vmel.dev\.qa\browsers'
$env:TEMP = 'D:\work\Pets\vmel.dev\.qa\tmp'
$env:TMP = $env:TEMP
```

Create these directories locally as needed. Install Chromium there before the
browser tests with `npx.cmd playwright install chromium`.
