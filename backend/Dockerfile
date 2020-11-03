FROM node:15.0.1
WORKDIR /foodies/backend
COPY *.json /foodies/backend/
RUN yarn install
# build
COPY . .
RUN yarn run build
RUN yarn run prestart
