FROM node:19.6-bullseye-slim

ENV NODE_ENV  production

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --only=production

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]