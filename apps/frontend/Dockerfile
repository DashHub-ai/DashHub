FROM node:23-alpine3.19

ENV NODE_ENV=production
ENV TZ=Europe/Berlin
ENV HOST=0.0.0.0
ENV PORT=3002

RUN mkdir /app && \
    chown -R node:node /app

WORKDIR /app
USER node

# Install dependenceis
COPY package.json .

RUN jq 'del(.devDependencies)' package.json > temp.json && mv temp.json package.json && \
    npm install --omit=dev --omit=optional

COPY dist/ dist/

CMD [ "node", "--enable-source-maps", "--stack-trace-limit=1000", "dist/server/entry.mjs" ]
