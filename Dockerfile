# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install ffmpeg and npm packages in the container
RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/* && npm ci

# Copy app source inside the docker image
COPY . .

# Make port 3000 available outside this container
EXPOSE 3000

# Define the command to run your app using CMD (only one CMD allowed)
CMD [ "npm", "start" ]