FROM node:22-alpine3.20

ENV TZ Europe/Berlin

# Install http serve to serve the static files
RUN npm i -g serve && \
    mkdir /app && \
    chown -R node:node /app

WORKDIR /app
USER node

# Copy the build folder from the previous stage
COPY dist/ dist/

# Serve the static files
CMD [ \
  "serve", \
  "dist", \
  "--listen", "tcp://0.0.0.0:3000", \
  "--no-clipboard", "--no-compression", "--no-port-switching" \
]
