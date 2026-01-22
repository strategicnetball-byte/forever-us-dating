#!/bin/bash
set -e

echo "Rebuilding Forever Us Frontend..."
echo ""

# Navigate to frontend directory
cd /home/ubuntu/forever-us-frontend

# Install dependencies if needed
echo "Installing dependencies..."
npm install --legacy-peer-deps 2>&1 | tail -5

# Build the frontend
echo "Building frontend..."
npm run build 2>&1 | tail -20

# Check if build was successful
if [ -f "build/index.html" ]; then
    echo "✅ Frontend build successful!"
    ls -lh build/index.html
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Restart the server
echo "Restarting server..."
pm2 restart forever-us

# Wait for server to start
sleep 3

# Check status
pm2 list

echo "✅ Frontend rebuild complete!"
