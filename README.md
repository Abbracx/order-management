## Description

This project is an Order Management system built with NestJS, MongoDB, Redis, and Firebase.

## Project setup

### Prerequisites

- Node.js (v20.x.x)
- Yarn
- Docker and Docker Compose
- Make

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
JWT_SECRET=your_jwt_secret
PORT=3000

# Redis
REDIS_URL=redis://localhost:6379

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

### Install Dependencies

```bash
$ yarn install
```

## Compile and run the project

### Locally

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run build
$ yarn run start:prod
```

### Using Docker with Makefile

1. **Build and Start the Containers**

```bash
$ make build
```

2. **Start the Containers**

```bash
$ make up
```

3. **Stop the Containers**

```bash
$ make down
```

4. **View Logs**

```bash
$ make logs
```

5. **View API Logs**

```bash
$ make logs-api
```

6. **View Mongo Logs**

```bash
$ make logs-mongo
```

7. **View Redis Logs**

```bash
$ make logs-redis
```

8. **Execute Commands in the Running Container**

```bash
$ make exec
```

9. **Check Docker Compose Configuration**

```bash
$ make config
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Docker Compose File

Here is the `docker-compose.yml` file used to spin up the project:

```yaml
version: '3.8'

services:
  redis:
    image: redis:6.2
    container_name: redis
    ports:
      - "6379:6379"
    networks:
      - order-management-web

  web:
    build:
      context: .
      dockerfile: ./Dockerfile
    container_name: web
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - .:/app
    depends_on:
      - redis
      - mongo
    networks:
      - order-management-web

  mongo:
    image: mongo:latest
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - order-management-web

networks:
  order-management-web:
    driver: bridge

volumes:
  mongo-data: {}
```

## Dockerfile

Here is the `Dockerfile` used to build the project:

```dockerfile
# Stage 1: Build Stage
FROM node:20 as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Run Stage
FROM node:20 as run-stage

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package.json ./package.json

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "dist/main"]
```

## Makefile

Here is the `Makefile` used to manage Docker commands:

```makefile
# filepath: /Users/apple/Documents/nest-project/order-management/Makefile
build:
    docker compose -f docker-compose.yml up --build -d --remove-orphans

up:
    docker compose -f docker-compose.yml up -d --remove-orphans	

down:
    docker compose -f docker-compose.yml down

exec:
    docker compose -f docker-compose.yml exec -it web /bin/bash

# To check if the env variables has been loaded correctly!
config:
    docker compose -f docker-compose.yml config 

logs:
    docker compose -f docker-compose.yml logs

logs-api:
    docker compose -f docker-compose.yml logs web

logs-mongo:
    docker compose -f docker-compose.yml logs mongo

logs-redis:
    docker compose -f docker-compose.yml logs redis
```