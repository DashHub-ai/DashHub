FROM docker.io/node:20-alpine

RUN apk add --no-cache python3 make g++ gcc \
    postgresql-dev

WORKDIR /app

COPY package-lock.json .

RUN npm install --no-audit --no-fund

CMD ["yarn", "dev"]
