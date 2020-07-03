FROM node:12-alpine

RUN mkdir -p /src/app/node_modules && chown -R node:node /src/app

WORKDIR /src/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN chmod +x wait-for.sh

EXPOSE 4000

CMD ["node", "./bin/www"]