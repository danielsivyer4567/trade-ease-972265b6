#!/bin/bash

# Check if the development server is running
if ps -p 2012 > /dev/null 2>&1; then
    echo "✅ Development server is running (PID: 2012)"
    echo "📱 Available at: http://localhost:8080/"
    echo "📊 Server logs: tail -f dev-server.log"
else
    echo "❌ Development server is not running"
    echo "🚀 Start with: ./start-dev.sh"
fi