FROM docker.io/node:20-alpine

RUN apk add --no-cache python3 make g++ gcc \
    postgresql-dev

WORKDIR /app

COPY yarn.lock .

RUN yarn install

CMD ["yarn", "dev"]
