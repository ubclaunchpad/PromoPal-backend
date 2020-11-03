FROM node:15.0.1
WORKDIR /foodies/backend
COPY *.json /foodies/backend/
RUN yarn install
# build
COPY . .
RUN yarn run build
<<<<<<< HEAD
RUN yarn run  prestart
=======
RUN yarn run prestart
>>>>>>> adbb3cd5f5141d14af39409315cbd460f90f330a
