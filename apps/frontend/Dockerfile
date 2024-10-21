FROM node:22-alpine3.20

ENV TZ=Europe/Berlin
ENV NODE_ENV=production
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=80

RUN apk --no-cache add jq && \
    mkdir /app && \
    chown -R node:node /app

WORKDIR /app
USER node

# Install dependenceis
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

RUN cat ./package.json | jq 'del(.devDependencies)' > ./package.json && \
    yarn install --production --frozen-lockfile

# Copy the build folder from the previous stage
COPY dist/ .

# Copy the server folder
CMD ["npx", "remix-serve", "server/index.js"]
