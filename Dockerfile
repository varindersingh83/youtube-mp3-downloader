# Use Python base image to avoid externally managed environment issues
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install yt-dlp
RUN pip install yt-dlp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm run install-all

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Create downloads directory
RUN mkdir -p backend/downloads

# Copy built frontend to backend public directory
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# Expose port (Railway uses PORT environment variable)
EXPOSE 8080

# Start the backend application (which will serve both API and frontend)
CMD ["node", "backend/index.js"] 