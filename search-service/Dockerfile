FROM node:18.12.1-buster
RUN mkdir -p /home/ubuntu/video-dot-project/search-service
WORKDIR /home/ubuntu/video-dot-project/search-service
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8083
CMD ["npm", "start"]
