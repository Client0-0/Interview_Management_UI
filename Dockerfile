# Use official lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies (clean install for CI)
RUN npm ci

# Copy source code
COPY . .

# Default command
CMD ["npm", "run", "lint"]