# Compiler and other heavy things
FROM node:22-alpine3.20 AS builder

RUN apk --no-cache add make python3 gcc postgresql-dev g++ jq

ENV NODE_ENV=production

# Install dependenceis
COPY package.json .

RUN jq 'del(.devDependencies)' package.json > temp.json && mv temp.json package.json && \
    npm install --omit=dev --omit=optional

# Light image with compiled binary stuff
FROM node:22-alpine3.20 AS runner

RUN echo "@testing https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk --no-cache add poppler-utils catdoc@testing antiword

ENV TZ=Europe/Berlin
ENV NODE_ENV=production
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=3000
ENV DATABASE_CHECK_MIGRATIONS_ON_STARTUP=true

RUN mkdir /app && \
    chown -R node:node /app

WORKDIR /app
USER node

COPY --from=builder --chown=node:node /package.json ./
COPY --from=builder --chown=node:node /node_modules ./node_modules
COPY dist/ dist/

CMD [ "node", "--enable-source-maps", "--stack-trace-limit=1000", "dist/index.mjs" ]
