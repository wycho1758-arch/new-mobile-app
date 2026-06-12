FROM node:22-slim AS prune
RUN npm i -g turbo@^2 pnpm@9
WORKDIR /app
COPY . .
RUN turbo prune --scope=@template/api --docker

FROM node:22-slim AS build
RUN npm i -g pnpm@9
WORKDIR /app
COPY --from=prune /app/out/json/ ./
RUN pnpm install --frozen-lockfile
COPY --from=prune /app/out/full/ ./
RUN pnpm --filter @template/contracts build
RUN pnpm --filter @template/api build
RUN pnpm --filter @template/api deploy --prod /app/deploy

FROM node:22-slim AS runtime
WORKDIR /app
COPY --from=build /app/deploy ./
COPY --from=build /app/apps/api/drizzle ./drizzle
USER node
CMD ["node", "dist/index.js"]
