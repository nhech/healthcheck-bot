FROM node:16-alpine
RUN npm install -g pm2

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn --production

RUN yarn add typescript

COPY . .

RUN yarn build-ts

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
