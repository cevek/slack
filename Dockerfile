FROM node:carbon
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "npm", "run build" ]
CMD [ "npm", "start" ]