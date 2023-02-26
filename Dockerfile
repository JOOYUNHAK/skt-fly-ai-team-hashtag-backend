FROM node:18.12.1-buster
RUN mkdir -p /home/ubuntu/video-dot-project/comment-service
WORKDIR /home/ubuntu/video-dot-project/comment-service
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8084
CMD ["npm", "start"]
