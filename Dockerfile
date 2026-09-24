# Production image for the Next.js frontend. Runs as its own "web" container behind Caddy
# (see deploy/docker-compose.yml, deploy/README.md and the backend repo's deploy/Caddyfile).
#
# NEXT_PUBLIC_* values are inlined into the build (both the client bundle and the rewrites in
# next.config.ts, which `next build` evaluates ahead of time) so they must be build args, not
# just container environment variables — setting them only in `docker run -e` would have no effect.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# http://api:8080 is the backend container's internal Docker DNS name (same jejak_net network) —
# proxying server-to-server here avoids an extra hop back out through Caddy/TLS.
ARG NEXT_PUBLIC_API_BASE_URL=http://api:8080
ARG NEXT_PUBLIC_WS_URL=wss://api.penyengatadventure.tech/ws
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
RUN npm run build

# Standalone output (next.config.ts: output: "standalone") — a self-contained server.js plus only
# the node_modules it actually needs, instead of shipping the whole node_modules tree.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
