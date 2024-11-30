# BASE Image 
FROM node:18-alpine

# Environment variable
# ENV DATABASE_URL="postgres://gfdd:jdbg#71@35.134.182.241:5432/zal-app-test"

WORKDIR /usr/app 

COPY package*.json  ./

RUN npm install 

RUN npm install -g pm2

COPY . .

EXPOSE 5000

CMD  ["pm2", "start", "server.js", "--name", "TBS_Server", "--no-daemon"]