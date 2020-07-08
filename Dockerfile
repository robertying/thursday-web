# Builder stage

FROM node:14 AS builder

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .

# Build
RUN yarn build


# Runner stage

FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

# Install serve
RUN yarn global add next

# Copy build files
COPY --from=builder /home/node/app/.next ./.next
COPY --from=builder /home/node/app/public ./public

EXPOSE 30001

CMD next start -p 30001
