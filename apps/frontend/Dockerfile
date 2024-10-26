FROM node:23-alpine3.19

ENV NODE_ENV=production
ENV TZ=Europe/Berlin
ENV HOST=0.0.0.0
ENV PORT=3002

RUN mkdir /app && \
    chown -R node:node /app

WORKDIR /app
USER node

COPY dist/ dist/

CMD [ "node", "--enable-source-maps", "--stack-trace-limit=1000", "dist/server/entry.mjs" ]
