FROM node:24-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6 AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

FROM node:24-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6
WORKDIR /app
ARG RELEASE_SHA
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 RELEASE_SHA=$RELEASE_SHA
LABEL org.opencontainers.image.source="https://github.com/non-rp/vmel.dev" org.opencontainers.image.revision="$RELEASE_SHA"
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node .next/standalone/ ./
COPY --chown=node:node .next/static/ ./.next/static/
COPY --chown=node:node public/ ./public/
COPY --chown=node:node drizzle/ ./drizzle/
COPY --chown=node:node scripts/migrate.mjs scripts/create-admin.mjs ./scripts/
USER node
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=4s --start-period=10s --retries=12 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
