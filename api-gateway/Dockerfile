FROM node:18.12.1-buster
RUN mkdir -p /home/ubuntu/video-dot-project/api-gateway
WORKDIR /home/ubuntu/video-dot-project/api-gateway
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8000
CMD ["npm", "start"]
