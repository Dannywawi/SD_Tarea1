FROM node:18-alpine3.14

WORKDIR /

COPY . .

RUN npm install

ENV port=3000

EXPOSE 3000

CMD [ "node", "index.js" ]
