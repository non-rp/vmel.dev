#!/usr/bin/env bash
# Installed once for the dedicated Actions key; release uploads cannot replace it.
set -Eeuo pipefail
base=/var/www/vmel.dev/docker
command="${SSH_ORIGINAL_COMMAND:-}"
[[ "$command" =~ ^vmel-(upload|deploy)\ ([0-9a-f]{40})$ ]] || { echo 'Unsupported deployment command' >&2; exit 1; }
operation="${BASH_REMATCH[1]}"
revision="${BASH_REMATCH[2]}"
cd "$base"
if [[ "$operation" == deploy ]]; then
    exec env VMEL_VERIFY_PUBLIC=true bash "$base/deploy-docker.sh" "$revision"
fi
umask 077
directory=$(mktemp -d "$base/incoming/upload.XXXXXX")
trap 'rm -rf -- "$directory"' EXIT
cat > "$directory/delivery.tar.gz"
while IFS= read -r entry; do
    case "$entry" in
        "vmel-$revision.tar.gz"|"vmel-$revision.tar.gz.sha256"|compose.yml|deploy-docker.sh) ;;
        *) echo 'Unexpected delivery file' >&2; exit 1 ;;
    esac
done < <(tar -tzf "$directory/delivery.tar.gz")
tar -tvzf "$directory/delivery.tar.gz" | awk 'substr($0,1,1)!="-" {exit 1}'
tar -xzf "$directory/delivery.tar.gz" --no-same-owner --no-same-permissions -C "$directory"
for entry in "vmel-$revision.tar.gz" "vmel-$revision.tar.gz.sha256" compose.yml deploy-docker.sh; do
    [[ -f "$directory/$entry" && ! -L "$directory/$entry" ]]
done
mv "$directory/vmel-$revision.tar.gz" "$directory/vmel-$revision.tar.gz.sha256" incoming/
mv "$directory/compose.yml" "$directory/deploy-docker.sh" ./
echo 'Release upload prepared'
