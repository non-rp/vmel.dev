#!/usr/bin/env bash
set -Eeuo pipefail

release="${1:?A release identifier is required}"
[[ "$release" =~ ^[0-9]{8}-[0-9]{6}$ ]] || { echo 'Invalid release identifier'; exit 1; }
base=/var/www/vmel.dev
config=/etc/nginx/sites-available/vmel.dev
upload="/tmp/vmel-$release"
target="$base/releases/$release"
[[ ! -e "$target" ]] || { echo 'Release already exists'; exit 1; }
mkdir -p "$target" "$base/backups"
tar -xzf "$upload.tar.gz" -C "$target"
test -s "$target/index.html"
test -s "$target/og-cover.png"
previous=$(readlink "$base/current" || true)
if [[ -n "$previous" && -d "$previous/assets" ]]; then
    cp -a --update=none "$previous/assets/." "$target/assets/"
fi
cp -a "$config" "$base/backups/nginx-$release.conf"
if [[ -n "$previous" ]]; then printf '%s\n' "$previous" > "$base/backups/previous-$release.txt"; fi

rollback() {
    cp "$base/backups/nginx-$release.conf" "$config"
    if [[ -n "$previous" ]]; then
        ln -s "$previous" "$base/rollback-$release"
        mv -Tf "$base/rollback-$release" "$base/current"
    fi
    nginx -t && systemctl reload nginx
    echo "Deployment failed. Previous configuration restored."
}
trap rollback ERR
ln -s "$target" "$base/next-$release"
mv -Tf "$base/next-$release" "$base/current"
cp "$upload.nginx.conf" "$config"
nginx -t
systemctl reload nginx
healthy=false
for attempt in {1..10}; do
    if curl --fail --silent --show-error https://vmel.dev/ | grep -q 'Valentyn Melnychenko'; then
        healthy=true
        break
    fi
    sleep 1
done
[[ "$healthy" == true ]]
trap - ERR
printf 'Live: https://vmel.dev/\nRelease: %s\nPrevious: %s\n' "$target" "${previous:-original nginx welcome page}"
