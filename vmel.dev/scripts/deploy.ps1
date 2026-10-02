param([string]$SshHost = 'myvps', [switch]$SkipTests)
$ErrorActionPreference = 'Stop'
if ($SshHost -notmatch '^[a-zA-Z0-9@._-]+$') { throw 'Invalid SSH host.' }
$workspace = Split-Path -Parent $PSScriptRoot
Push-Location $workspace
try {
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
    if (-not $SkipTests) {
        npm.cmd run test:e2e
        if ($LASTEXITCODE -ne 0) { throw 'Browser checks failed.' }
    }
    if (-not (Test-Path 'dist/og-cover.png')) { throw 'Social cover missing. Run node scripts/capture.mjs against the local preview first.' }
    $release = (Get-Date).ToUniversalTime().ToString('yyyyMMdd-HHmmss')
    New-Item -ItemType Directory -Force .qa | Out-Null
    $archive = ".qa/vmel-$release.tar.gz"
    tar.exe -czf $archive -C dist .
    if ($LASTEXITCODE -ne 0) { throw 'Could not package the release.' }
    scp -o BatchMode=yes $archive "${SshHost}:/tmp/vmel-$release.tar.gz"
    if ($LASTEXITCODE -ne 0) { throw 'Release upload failed.' }
    scp -o BatchMode=yes deploy/nginx.conf "${SshHost}:/tmp/vmel-$release.nginx.conf"
    if ($LASTEXITCODE -ne 0) { throw 'Nginx configuration upload failed.' }
    scp -o BatchMode=yes deploy/activate.sh "${SshHost}:/tmp/vmel-$release.sh"
    if ($LASTEXITCODE -ne 0) { throw 'Activation script upload failed.' }
    ssh -o BatchMode=yes $SshHost "bash /tmp/vmel-$release.sh $release"
    if ($LASTEXITCODE -ne 0) { throw 'Deployment failed. Inspect the server output.' }
} finally { Pop-Location }
