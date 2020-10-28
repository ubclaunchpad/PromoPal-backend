FROM node:15.0.1
WORKDIR /foodies/backend
COPY *.json /foodies/backend/
RUN npm install
# build
COPY . .
RUN npm run build
RUN npm prestart