FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/admin/package.json ./apps/admin/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
RUN npm ci

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
COPY --from=builder --chown=nodeuser:nodejs /app/apps/backend/data ./data
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p uploads && chown nodeuser:nodejs uploads

USER nodeuser

CMD ["node", "dist/index.js"]
