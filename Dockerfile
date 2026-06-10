FROM node:24-slim AS base
WORKDIR /app
RUN corepack enable pnpm
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates


FROM base AS builder
ENV NODE_ENV=production \
  DATABASE_URL=mysql://root:root@localhost:3306/conforferias
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
RUN pnpm run build


FROM base AS prod_deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --prod


FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod_deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]


FROM base AS migration
COPY --from=builder /app/node_modules ./node_modules
COPY prisma ./prisma
COPY prisma.config.ts package.json ./
ENV NODE_ENV=production
CMD ["pnpm", "prisma", "migrate", "deploy"]
