FROM node:10-alpine
RUN apk update
RUN apk add yarn
RUN mkdir -p /home/node/server/node_modules && chown -R node:node /home/node/server
USER node
WORKDIR /home/node/server
COPY . .
EXPOSE 6969
RUN yarn
CMD ["node", "app.js"]
