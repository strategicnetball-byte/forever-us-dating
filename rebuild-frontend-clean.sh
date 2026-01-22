#!/bin/bash
set -e

echo "Rebuilding Forever Us Frontend (Clean Build)..."
echo ""

# Navigate to frontend directory
cd /home/ubuntu/forever-us-frontend

# Clean previous build
echo "Cleaning previous build..."
rm -rf build node_modules package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps 2>&1 | grep -E "(added|up to date|npm warn)" | tail -3

# Build the frontend
echo "Building frontend..."
CI=false npm run build 2>&1 | tail -30

# Check if build was successful
if [ -f "build/index.html" ]; then
    echo ""
    echo "✅ Frontend build successful!"
    ls -lh build/index.html
else
    echo ""
    echo "❌ Frontend build failed"
    exit 1
fi

# Restart the server
echo ""
echo "Restarting server..."
pm2 restart forever-us

# Wait for server to start
sleep 3

# Check status
pm2 list

echo ""
echo "✅ Frontend rebuild complete!"
