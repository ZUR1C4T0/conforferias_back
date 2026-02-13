FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml package.json ./


FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build


FROM base AS prod_deps
RUN pnpm install --frozen-lockfile --prod


FROM base AS runner
WORKDIR /app
COPY --from=prod_deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 4000

CMD ["node", "dist/main.js"]
