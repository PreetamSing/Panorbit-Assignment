FROM node:16.13.1-alpine

WORKDIR /app

RUN npm i -g pm2@5.1.2

COPY package.json .

RUN npm i -D

COPY . .

RUN npm run build:clean

ENV NODE_ENV=PROD

EXPOSE 5000

CMD ["pm2-runtime", "./build/server.js"]
