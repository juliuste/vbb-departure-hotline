# install dependencies
FROM node:erbium-alpine
WORKDIR /app-src

COPY package.json ./
COPY ./app/ ./app/
RUN npm install

USER node

CMD ["npm", "start"]
