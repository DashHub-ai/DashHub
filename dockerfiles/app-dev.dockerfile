FROM docker.io/node:22-alpine

RUN apk add --no-cache python3 make g++ gcc \
    postgresql-dev

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/* ./apps/
COPY packages/* ./packages/
COPY externals/* ./externals/

RUN npm install --no-audit --no-fund

CMD ["npm", "run", "dev"]
