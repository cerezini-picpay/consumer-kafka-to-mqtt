FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci
# RUN npm ci --only=production

COPY *.js .env ./

CMD [ "npm", "start" ]