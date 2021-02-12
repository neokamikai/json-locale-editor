FROM node:12-slim

WORKDIR /usr/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]