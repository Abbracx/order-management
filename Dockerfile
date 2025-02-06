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

# Copy the entrypoint script to the build stage
# COPY ./entrypoint.sh /app/entrypoint

# Make the entrypoint script executable in the build stage
# Switch to the node user
# USER node

# RUN chmod +x /app/entrypoint


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

# Copy the entrypoint and start scripts
COPY ./entrypoint /app/entrypoint
COPY ./start /app/start

# USER node

# Make the scripts executable and set correct permissions
# RUN chmod +x /app/entrypoint /app/start
RUN chmod +x /app/entrypoint /app/start && \
    chown -R node:node /app


# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=local
ENV PORT=3000

# Set the entrypoint
ENTRYPOINT ["./entrypoint"]

# Start the application
# CMD ["./app/start"]