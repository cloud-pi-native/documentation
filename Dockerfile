# Base stage
FROM docker.io/node:22-slim AS dev

WORKDIR /app
RUN npm install --location=global pnpm
COPY --chown=node:root package.json pnpm-lock.yaml ./
RUN pnpm install
COPY --chown=node:root docs ./docs
ENTRYPOINT [ "pnpm", "run", "dev" ]


# Build stage
FROM dev AS build

RUN pnpm run build


# Prod stage
FROM docker.io/bitnamilegacy/nginx:1.27 AS prod

USER 0
COPY --chown=1001:0 --chmod=770 --from=build /app/docs/.vitepress/dist /opt/bitnami/nginx/html/
COPY --chown=1001:0 --chmod=660 ./nginx.conf /opt/bitnami/nginx/conf/server_blocks/default.conf
USER 1001
EXPOSE 8080
