FROM node:12-slim

WORKDIR /usr/app

COPY package*.json ./

COPY . .

RUN npm install && npm run build && rm -r src

FROM node:12-slim

WORKDIR /usr/app

COPY --from=0 /usr/app/package.json ./
COPY --from=0 /usr/app/node_modules ./node_modules
COPY --from=0 /usr/app/dist ./dist

RUN ln -sf /usr/app/dist/src /usr/app/src

EXPOSE 3000

CMD ["npm", "start"]