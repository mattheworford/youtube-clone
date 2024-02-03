# Stage 1: Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --quiet

COPY . .

RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add --no-cache ffmpeg

COPY --from=builder /app/package*.json ./

RUN npm install --quiet --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "serve" ]