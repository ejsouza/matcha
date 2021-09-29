# syntax=docker/dockerfile:1

FROM node:15-alpine3.10

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 8000

# CMD [ "node", "server.js" ]
CMD [ "npm", "run", "start" ]