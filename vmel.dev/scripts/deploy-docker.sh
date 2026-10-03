#!/usr/bin/env bash
set -Eeuo pipefail

revision="${1:?A full Git commit SHA is required}"
[[ "$revision" =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid release SHA' >&2; exit 1; }
base="${VMEL_DEPLOY_ROOT:-/var/www/vmel.dev/docker}"
[[ "$base" = /*/vmel.dev/docker && -d "$base" ]] || { echo 'Invalid or missing project deployment directory' >&2; exit 1; }
cd "$base"
exec 9>deploy.lock
flock -n 9 || { echo 'Another release is running' >&2; exit 1; }

archive="incoming/vmel-$revision.tar.gz"
(cd incoming && sha256sum --check "vmel-$revision.tar.gz.sha256")
image="vmel-portfolio:$revision"
previous=''
if [[ -f current-image ]]; then
    previous=$(cat current-image)
    [[ "$previous" =~ ^vmel-portfolio:[0-9a-f]{40}$ ]] || { echo 'Invalid previous image record' >&2; exit 1; }
fi

gzip -dc "$archive" | docker load
docker image inspect "$image" >/dev/null
compose() { VMEL_IMAGE="$1" docker compose --project-name vmel-portfolio --file compose.yml "${@:2}"; }
verify() {
    local expected="$1" served
    served=$(curl --fail --silent --show-error --max-time 10 http://127.0.0.1:4174/release.txt) || return 1
    [[ "$served" == "$expected" ]] || return 1
    if [[ "${VMEL_VERIFY_PUBLIC:-false}" == true ]]; then
        served=$(curl --fail --silent --show-error --max-time 20 https://vmel.dev/release.txt) || return 1
        [[ "$served" == "$expected" ]] || return 1
    fi
}
rollback() {
    trap - ERR
    if [[ -n "$previous" ]]; then
        echo 'Restoring the previous image' >&2
        if ! compose "$previous" up --detach --wait --wait-timeout 60 || ! verify "${previous#vmel-portfolio:}"; then
            echo 'ROLLBACK FAILED: inspect the vmel-portfolio service' >&2
            exit 2
        fi
    else
        compose "$image" down || true
        echo 'First Docker release failed; host Nginx has not been changed' >&2
    fi
    exit 1
}
trap rollback ERR
compose "$image" up --detach --wait --wait-timeout 60
verify "$revision"
printf '%s\n' "$image" > current-image.next
mv current-image.next current-image
printf '%s\n' "$previous" > previous-image
trap - ERR
printf 'Healthy Docker release: %s\n' "$revision"
