#!/bin/bash

# Forever Us Frontend Deployment Script
# Usage: ./deploy-frontend.sh

set -e

AWS_IP="3.0.99.28"
SSH_KEY="$HOME/.ssh/forever-us-new.pem"
BUILD_DIR="client-new/build"

echo "🔨 Building frontend..."
cd client-new
npm run build
cd ..

echo "📦 Uploading build to AWS..."
ssh -i "$SSH_KEY" ubuntu@$AWS_IP "sudo rm -rf /home/ubuntu/client-new/build/* && sudo chown -R ubuntu:ubuntu /home/ubuntu/client-new/build && sudo chmod -R 755 /home/ubuntu/client-new/build"

scp -i "$SSH_KEY" -r "$BUILD_DIR"/* ubuntu@$AWS_IP:/home/ubuntu/client-new/build/

echo "🔐 Setting permissions..."
ssh -i "$SSH_KEY" ubuntu@$AWS_IP "sudo chown -R www-data:www-data /home/ubuntu/client-new/build && sudo chmod -R 755 /home/ubuntu/client-new/build"

echo "🔄 Reloading Nginx..."
ssh -i "$SSH_KEY" ubuntu@$AWS_IP "sudo systemctl reload nginx"

echo "✅ Deployment complete!"
