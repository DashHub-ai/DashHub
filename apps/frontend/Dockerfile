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

RUN jq 'del(.devDependencies)' package.json > temp.json && mv temp.json package.json && \
    npm install --omit=dev --omit=optional

# Copy the build folder from the previous stage
COPY dist/ .

# Copy the server folder
CMD ["npx", "remix-serve", "server/index.js"]
