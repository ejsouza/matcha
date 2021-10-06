# syntax=docker/dockerfile:1

FROM node:16-alpine3.11

#ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

COPY . .

# RUN npm install -g typescript

# RUN tsc

RUN npm run build

EXPOSE 8000

# CMD [ "node", "server.js" ]
CMD [ "npm", "run", "start" ]