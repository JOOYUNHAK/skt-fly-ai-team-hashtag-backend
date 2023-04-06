FROM node:18.12.1-buster
RUN mkdir -p /home/ubuntu/video-dot-project/user-service
WORKDIR /home/ubuntu/video-dot-project/user-service
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
