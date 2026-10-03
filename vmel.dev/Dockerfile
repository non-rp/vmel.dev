FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:ed04ec1ff34502c339ee5c3ae3f855442398edc1d05591e2b98981dcbbd20b1e

ARG RELEASE_SHA
LABEL org.opencontainers.image.source="https://github.com/non-rp/vmel.dev"
LABEL org.opencontainers.image.revision="$RELEASE_SHA"

COPY deploy/container.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
USER root
RUN test -n "$RELEASE_SHA" && printf '%s\n' "$RELEASE_SHA" > /usr/share/nginx/html/release.txt
USER nginx

EXPOSE 8080
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=6 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
ENTRYPOINT ["nginx", "-g", "daemon off;"]
