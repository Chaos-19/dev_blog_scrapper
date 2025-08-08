# Use Puppeteer image from GitHub Container Registry
FROM ghcr.io/puppeteer/puppeteer:22.7.1

# Environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Environment variables for n8n
ENV N8N_PORT=5678 \
    N8N_HOST=0.0.0.0 \
    N8N_PROTOCOL=http \
    N8N_USER_FOLDER=/home/node/.n8n \
    NODE_FUNCTION_ALLOW_EXTERNAL=* \
    N8N_BASIC_AUTH_ACTIVE=true \
    N8N_BASIC_AUTH_USER=admin \
    N8N_BASIC_AUTH_PASSWORD=supersecurepassword

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install n8n and other dependencies
RUN npm install -g n8n && npm ci

# Copy the entire project to the working directory
COPY . .

# Build the project
RUN npm run build

# Create a directory for n8n data persistence
RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node/.n8n

# Set the working directory to the build output directory
WORKDIR /usr/src/app/dist

# Expose ports (3000 for your app, 5678 for n8n)
EXPOSE 3000 5678

# Command to run both the app and n8n
CMD ["sh", "-c", "n8n start & node server.js"]