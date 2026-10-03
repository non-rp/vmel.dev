import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const bash = process.env.BASH_EXE || (process.platform === 'win32' ? 'C:/Program Files/Git/usr/bin/bash.exe' : 'bash');
const repo = resolve('..');
const scratch = join(repo, '.qa', 'deploy-tests');
const revision = 'a'.repeat(40);
const previous = 'b'.repeat(40);

async function fixture({ healthFails = false, publicFails = false, previousImage = true, corrupt = false } = {}) {
  await mkdir(scratch, { recursive: true });
  const directory = await mkdtemp(join(scratch, 'run-'));
  const base = join(directory, 'vmel.dev', 'docker');
  const bin = join(directory, 'bin');
  await mkdir(join(base, 'incoming'), { recursive: true });
  await mkdir(bin);
  const archive = Buffer.from('test-image-archive');
  // The fake gzip command forwards these bytes; no actual image is created.
  await writeFile(join(base, 'incoming', `vmel-${revision}.tar.gz`), archive);
  const hash = createHash('sha256').update(corrupt ? 'other-data' : archive).digest('hex');
  await writeFile(join(base, 'incoming', `vmel-${revision}.tar.gz.sha256`), `${hash}  vmel-${revision}.tar.gz\n`);
  await writeFile(join(base, 'compose.yml'), 'name: vmel-portfolio\n');
  if (previousImage) await writeFile(join(base, 'current-image'), `vmel-portfolio:${previous}\n`);
  const scripts = {
    docker: `#!/usr/bin/env bash\necho "docker $* IMAGE=$VMEL_IMAGE" >> "$VMEL_DEPLOY_ROOT/events"\nif [[ "$1" == load ]]; then cat >/dev/null; fi\nif [[ "$1" == compose && "$*" == *'up --detach'* ]]; then printf '%s' "$VMEL_IMAGE" > "$VMEL_DEPLOY_ROOT/running-image"; fi\n`,
    gzip: '#!/usr/bin/env bash\ncat "${@: -1}"\n',
    curl: `#!/usr/bin/env bash\nimage=$(cat "$VMEL_DEPLOY_ROOT/running-image")\nif [[ "$image" == "vmel-portfolio:${revision}" ]] && { [[ "$VMEL_FAIL_HEALTH" == true ]] || { [[ "$VMEL_FAIL_PUBLIC" == true ]] && [[ "$*" == *https://vmel.dev/release.txt* ]]; }; }; then echo incorrect-release; else echo "$image" | cut -d: -f2; fi\n`,
    flock: '#!/usr/bin/env bash\nexit 0\n',
  };
  for (const [name, content] of Object.entries(scripts)) await writeFile(join(bin, name), content, { mode: 0o755 });
  const relative = directory.slice(repo.length + 1).replaceAll('\\', '/');
  const run = (sha = revision) => spawnSync(bash, ['-c', 'export VMEL_DEPLOY_ROOT="$PWD/$TEST_DIRECTORY/vmel.dev/docker"; export PATH="$PWD/$TEST_DIRECTORY/bin:$PATH"; bash vmel.dev/scripts/deploy-docker.sh "$TEST_REVISION"'], {
    cwd: repo,
    env: { ...process.env, TEST_DIRECTORY: relative, TEST_REVISION: sha, VMEL_FAIL_HEALTH: String(healthFails), VMEL_FAIL_PUBLIC: String(publicFails), VMEL_VERIFY_PUBLIC: String(publicFails) },
    encoding: 'utf8',
  });
  return { base, run };
}

test('a healthy release is committed only after checking its served SHA', async () => {
  const { base, run } = await fixture();
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal((await readFile(join(base, 'current-image'), 'utf8')).trim(), `vmel-portfolio:${revision}`);
  assert.equal((await readFile(join(base, 'previous-image'), 'utf8')).trim(), `vmel-portfolio:${previous}`);
});

test('a release identity mismatch restores the previous image and preserves the active record', async () => {
  const { base, run } = await fixture({ healthFails: true });
  const result = run();
  assert.equal(result.status, 1, result.stderr);
  assert.equal((await readFile(join(base, 'running-image'), 'utf8')).trim(), `vmel-portfolio:${previous}`);
  assert.equal((await readFile(join(base, 'current-image'), 'utf8')).trim(), `vmel-portfolio:${previous}`);
});

test('a corrupt archive is rejected before any Docker mutation', async () => {
  const { base, run } = await fixture({ corrupt: true });
  assert.notEqual(run().status, 0);
  await assert.rejects(readFile(join(base, 'events')), { code: 'ENOENT' });
});

test('a public release mismatch rolls back even when the local container is healthy', async () => {
  const { base, run } = await fixture({ publicFails: true });
  assert.equal(run().status, 1);
  assert.equal((await readFile(join(base, 'running-image'), 'utf8')).trim(), `vmel-portfolio:${previous}`);
  assert.equal((await readFile(join(base, 'current-image'), 'utf8')).trim(), `vmel-portfolio:${previous}`);
});

test('an invalid SHA is rejected before any Docker mutation', async () => {
  const { base, run } = await fixture();
  assert.notEqual(run('../other-project').status, 0);
  await assert.rejects(readFile(join(base, 'events')), { code: 'ENOENT' });
});

test('a failed first release removes only the new Compose project', async () => {
  const { base, run } = await fixture({ healthFails: true, previousImage: false });
  assert.equal(run().status, 1);
  assert.match(await readFile(join(base, 'events'), 'utf8'), /--project-name vmel-portfolio --file compose.yml down/);
  await assert.rejects(readFile(join(base, 'current-image')), { code: 'ENOENT' });
});
