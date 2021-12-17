FROM node:17.0

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

EXPOSE 3000

RUN yarn

COPY .  .


CMD [ "yarn", "start" ]