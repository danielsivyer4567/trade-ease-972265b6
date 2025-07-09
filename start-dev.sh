#!/bin/bash

# Kill any existing Vite processes
pkill -f "vite --port 8080" || true

# Start Vite in background with proper logging
echo "Starting Trade Ease development server..."
nohup npm run dev:safe > dev-server.log 2>&1 &

# Get the process ID
DEV_PID=$!

echo "Development server started with PID: $DEV_PID"
echo "Server will be available at:"
echo "  - Local: http://localhost:8080/"
echo "  - Network: http://10.255.255.254:8080/"
echo "  - Network: http://172.31.136.169:8080/"
echo ""
echo "To stop the server, run: kill $DEV_PID"
echo "To view logs, run: tail -f dev-server.log"

# Wait a moment for server to start
sleep 3

# Check if server is running
if ps -p $DEV_PID > /dev/null; then
    echo "✅ Development server is running successfully!"
else
    echo "❌ Failed to start development server"
    exit 1
fi