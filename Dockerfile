FROM node:alpine

COPY . /app

WORKDIR /app

RUN npm install discord.js@12.5.3 dotenv axios 
RUN npm i ffmpeg-static

CMD node bot.js