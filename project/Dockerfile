FROM node:19-alpine

#create dir
WORKDIR /app

#install app dependencies
COPY package*.json ./

#run npm install
RUN npm install

#Bundle

COPY . .

EXPOSE 3000

CMD ["npm", "start"]