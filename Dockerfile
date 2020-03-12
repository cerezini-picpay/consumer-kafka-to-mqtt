FROM node:lts-alpine

WORKDIR /app

COPY . ./

RUN npm ci
# RUN npm ci --only=production

CMD [ "npm", "start" ]