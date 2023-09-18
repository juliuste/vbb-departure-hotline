FROM node:18-alpine
RUN npm i -g pnpm

WORKDIR /app-src

COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY ./app/ ./app/

USER node

CMD ["pnpm", "run", "start"]
