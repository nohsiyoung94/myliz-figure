FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
RUN npm ci --workspace=@brand/backend --include-workspace-root

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/backend/ ./apps/backend/
WORKDIR /app/apps/backend
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

COPY --from=builder --chown=nodeuser:nodejs /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

USER nodeuser
EXPOSE 4000
ENV PORT=4000

CMD ["node", "dist/index.js"]
