FROM node:15.0.1
WORKDIR /foodies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
# build
COPY . .
RUN yarn run build
CMD yarn run start
