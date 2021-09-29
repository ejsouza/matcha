FROM node:latest

WORKDIR /app

COPY *.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]