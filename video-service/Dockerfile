FROM node:18.12.1-buster
RUN mkdir -p /home/ubuntu/video-dot-project/video-service
WORKDIR /home/ubuntu/video-dot-project/video-service
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8081
CMD ["npm", "start"]
