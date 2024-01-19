FROM node:18.14-bullseye

WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
