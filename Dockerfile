# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
# We use npm ci for faster, more reliable builds in CI/CD and production
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Pass environment variables as build arguments
# This is necessary because Vite bundles these values at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the production application
RUN npm run build

# Stage 2: Serve the application using NGINX
FROM nginx:stable-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check to ensure the container is running and responding
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

