FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install request@2.81.0
RUN npm install axios


# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]