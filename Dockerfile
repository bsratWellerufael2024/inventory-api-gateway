# api-gateway/Dockerfile

# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /src/app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on (update if different)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
