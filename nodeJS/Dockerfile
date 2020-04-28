# base container
FROM node:12

# create app directory
WORKDIR /usr/src/app

# install dependecies
COPY package*.json ./

RUN npm install

# copy the source code
COPY src/controllers ./controllers
COPY src/models ./models
COPY src/public ./public
COPY src/views ./views
COPY src/router.js ./router.js

# expose ports

EXPOSE 8080

# command to lunch
CMD ["node", "router.js"]
