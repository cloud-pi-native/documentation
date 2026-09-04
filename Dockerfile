# Base stage
FROM docker.io/node:22-slim AS dev

WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
COPY --chown=node:root package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack install
RUN pnpm install --frozen-lockfile
COPY --chown=node:root docs ./docs
ENTRYPOINT [ "pnpm", "run", "dev" ]


# Build stage
FROM dev AS build

RUN pnpm run build


# Prod stage
FROM docker.io/bitnamilegacy/nginx:1.27 AS prod

USER 0
# OpenShift ignore le USER de l'image et assigne un UID arbitraire, toujours
# membre du groupe 0 : ce sont les droits de groupe qui comptent, d'ou le
# --chown=1001:0. Sans --chmod, COPY laisse 644 aux fichiers et 755 aux
# repertoires : le groupe 0 lit, les repertoires restent traversables, et les
# fichiers statiques ne portent plus le bit d'execution que --chmod=770 leur
# donnait.
COPY --chown=1001:0 --from=build /app/docs/.vitepress/dist /opt/bitnami/nginx/html/
COPY --chown=1001:0 --chmod=640 ./nginx.conf /opt/bitnami/nginx/conf/server_blocks/default.conf
USER 1001
EXPOSE 8080
