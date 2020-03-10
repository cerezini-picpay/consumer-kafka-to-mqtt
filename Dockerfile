FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci
# RUN npm ci --only=production

COPY . .

CMD [ "node", "index.js" ]