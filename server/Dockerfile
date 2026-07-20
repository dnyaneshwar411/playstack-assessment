FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY ./src ./src
COPY package.json .env tsconfig.json pnpm-workspace.yaml ./

RUN ls

RUN pnpm approve-builds esbuild
RUN pnpm install
RUN pnpm run build
RUN rm -rf ./src ./node_modules ./tsconfig.json ./pnpm-lock.yaml

CMD ["node", "dist/index.cjs"]

EXPOSE 1993