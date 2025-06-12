#!/bin/bash

# n8n Quick Start Script
# This script starts n8n using Docker for development

echo "🚀 Starting n8n with Docker..."
echo "This will make n8n available at http://localhost:5678"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   - Windows/Mac: https://www.docker.com/products/docker-desktop"
    echo "   - Linux: Follow your distribution's Docker installation guide"
    exit 1
fi

# Stop any existing n8n container
echo "🛑 Stopping any existing n8n container..."
docker stop n8n 2>/dev/null || true

# Start n8n with persistent data
echo "▶️  Starting n8n..."
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE="America/New_York" \
  -e TZ="America/New_York" \
  -e N8N_CORS_ORIGIN="http://localhost:3000,http://localhost:8080" \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

if [ $? -eq 0 ]; then
    echo "✅ n8n started successfully!"
    echo ""
    echo "🌐 Access n8n at: http://localhost:5678"
    echo "📱 Access your app at: http://localhost:3000"
    echo ""
    echo "To stop n8n, run: docker stop n8n"
    echo "To view logs, run: docker logs -f n8n"
else
    echo "❌ Failed to start n8n. Check Docker installation and try again."
    exit 1
fi 