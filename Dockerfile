# Builder stage

FROM node:14 AS builder

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Build
RUN yarn build

ENV NODE_ENV=production
EXPOSE 3000
CMD yarn start
