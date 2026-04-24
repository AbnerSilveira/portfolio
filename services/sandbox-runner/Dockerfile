# Build context: raiz do monorepo (`portfolio/`).
# Ex.: flyctl deploy . --remote-only --dockerfile services/sandbox-runner/Dockerfile --config services/sandbox-runner/fly.toml
# Ver https://fly.io/docs/launch/monorepo/

FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable
ENV HUSKY=0

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages ./packages
COPY services ./services

RUN pnpm install --frozen-lockfile --ignore-scripts

WORKDIR /repo/services/sandbox-runner
RUN pnpm run build

WORKDIR /repo
RUN pnpm --filter @portfolio/sandbox-runner --prod deploy /out

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /out ./

USER app
EXPOSE 4000
CMD ["node", "dist/main.js"]
