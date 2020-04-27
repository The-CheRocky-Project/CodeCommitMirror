# base container
FROM node:12

# create app directory
WORKDIR /usr/src/app

# install dependecies
COPY package*.json ./

RUN npm install

# copy the source code
COPY ./controllers ./controllers
COPY ./models ./models
COPY ./public ./public
COPY ./views ./views
COPY ./router.js ./router.js

# expose ports

EXPOSE 8080

# command to lunch
CMD ["node", "router.js"]
