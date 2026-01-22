#!/bin/bash

# Forever Us - AWS Deployment (Direct to Port 80, No Nginx)
# Run this on the EC2 instance: bash deploy-direct.sh

set -e

echo "🚀 Forever Us Deployment (Direct Port 80)"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Update system
echo -e "${YELLOW}Step 1: Updating system...${NC}"
sudo apt update -qq 2>/dev/null || true
sudo apt upgrade -y -qq 2>/dev/null || true
log_info "System updated"
echo ""

# Step 2: Install Node.js (if not already installed)
echo -e "${YELLOW}Step 2: Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
    sudo apt install -y -qq nodejs
    log_info "Node.js installed"
else
    NODE_VERSION=$(node --version)
    log_warn "Node.js already installed: $NODE_VERSION"
fi
echo ""

# Step 3: Install PM2 globally
echo -e "${YELLOW}Step 3: Installing PM2...${NC}"
if ! npm list -g pm2 > /dev/null 2>&1; then
    sudo npm install -g pm2 -q
    log_info "PM2 installed"
else
    log_warn "PM2 already installed"
fi
echo ""

# Step 4: Create app directories
echo -e "${YELLOW}Step 4: Creating directories...${NC}"
mkdir -p ~/forever-us-server ~/forever-us-frontend
log_info "Directories created"
echo ""

# Step 5: Deploy server
echo -e "${YELLOW}Step 5: Deploying server...${NC}"
if [ -d "/tmp/forever-us-server/server" ]; then
    cp -r /tmp/forever-us-server/server/* ~/forever-us-server/
    cp /tmp/forever-us-server/.env ~/forever-us-server/.env 2>/dev/null || true
    log_info "Server files copied"
elif [ -d "/tmp/forever-us-server" ]; then
    cp -r /tmp/forever-us-server/* ~/forever-us-server/
    log_info "Server files copied"
else
    log_warn "Server files not found in /tmp/forever-us-server"
fi
echo ""

# Step 6: Install server dependencies
echo -e "${YELLOW}Step 6: Installing server dependencies...${NC}"
cd ~/forever-us-server
npm install -q
log_info "Server dependencies installed"
echo ""

# Step 7: Stop Nginx if running
echo -e "${YELLOW}Step 7: Stopping Nginx...${NC}"
sudo systemctl stop nginx 2>/dev/null || true
sudo systemctl disable nginx 2>/dev/null || true
log_info "Nginx stopped and disabled"
echo ""

# Step 8: Deploy frontend
echo -e "${YELLOW}Step 8: Deploying frontend...${NC}"
if [ -d "/tmp/forever-us-frontend/build" ]; then
    mkdir -p ~/forever-us-frontend/build
    cp -r /tmp/forever-us-frontend/build/* ~/forever-us-frontend/build/
    log_info "Pre-built frontend deployed"
elif [ -d "/tmp/forever-us-frontend/src" ]; then
    cp -r /tmp/forever-us-frontend/* ~/forever-us-frontend/
    log_info "Frontend source files copied"
else
    log_warn "Frontend files not found"
fi
echo ""

# Step 9: Start server with PM2 on port 80
echo -e "${YELLOW}Step 9: Starting server on port 80...${NC}"
pm2 delete forever-us 2>/dev/null || true
cd ~/forever-us-server
pm2 start index.js --name forever-us --watch
pm2 save
sudo pm2 startup -u ubuntu --hp /home/ubuntu > /dev/null 2>&1 || true
log_info "Server started with PM2 on port 80"
echo ""

# Step 10: Verify deployment
echo -e "${YELLOW}Step 10: Verifying deployment...${NC}"
echo ""

if pm2 list | grep -q forever-us; then
    log_info "Node server is running"
else
    log_error "Node server is not running"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Your app is running at:"
echo -e "  ${GREEN}http://$(hostname -I | awk '{print $1}')${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:     pm2 logs forever-us"
echo "  Restart app:   pm2 restart forever-us"
echo "  Stop app:      pm2 stop forever-us"
echo ""
