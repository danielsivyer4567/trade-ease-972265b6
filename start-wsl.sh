#!/bin/bash

# WSL Startup Script for Trade Ease
# This script fixes common WSL issues and starts the development server

echo "🔧 Setting up WSL environment for Trade Ease..."

# Fix terminal display issues
export TERM=xterm-256color
export FORCE_COLOR=1

# Set Node.js options for better performance
export NODE_OPTIONS=--max-old-space-size=4096

# Display system information
echo "📋 System Information:"
echo "   Node.js version: $(node --version)"
echo "   NPM version: $(npm --version)"
echo "   Yarn version: $(yarn --version 2>/dev/null || echo 'Not installed')"
echo "   Current directory: $(pwd)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    if command -v yarn &> /dev/null; then
        echo "   Using yarn..."
        yarn install
    else
        echo "   Installing yarn..."
        npm install -g yarn
        echo "   Installing dependencies with yarn..."
        yarn install
    fi
    echo "✅ Dependencies installed successfully!"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating with default values..."
    cp .env.example .env.local 2>/dev/null || echo "# Add your environment variables here" > .env.local
    echo "📝 Please configure your environment variables in .env.local"
fi

echo ""
echo "🚀 Starting Trade Ease development server..."
echo "   Server will be available at: http://localhost:8080"
echo "   To stop the server, press Ctrl+C"
echo ""

# Start the development server
yarn dev 