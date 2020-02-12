FROM node:8.16.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./

# Bundle app source
COPY . .

RUN rm -rf node_modules

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "start" ]

