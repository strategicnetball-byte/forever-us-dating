#!/bin/bash

# Forever Us - Fresh AWS Deployment with MongoDB Atlas
# Run this on the EC2 instance: bash deploy-fresh.sh

set -e

echo "🚀 Forever Us Fresh Deployment"
echo "=============================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

# Update system
echo -e "${YELLOW}Updating system...${NC}"
sudo apt update -qq && sudo apt upgrade -y -qq
log_info "System updated"
echo ""

# Install Node.js
echo -e "${YELLOW}Installing Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
    sudo apt install -y -qq nodejs
    log_info "Node.js installed"
else
    log_warn "Node.js already installed: $(node --version)"
fi
echo ""

# Install PM2
echo -e "${YELLOW}Installing PM2...${NC}"
if ! npm list -g pm2 > /dev/null 2>&1; then
    sudo npm install -g pm2 -q
    log_info "PM2 installed"
else
    log_warn "PM2 already installed"
fi
echo ""

# Create directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p ~/forever-us-server ~/forever-us-frontend
log_info "Directories created"
echo ""

# Deploy server
echo -e "${YELLOW}Deploying server...${NC}"
if [ -d "/tmp/forever-us-server/server" ]; then
    cp -r /tmp/forever-us-server/server/* ~/forever-us-server/
    cp /tmp/forever-us-server/.env ~/forever-us-server/.env 2>/dev/null || true
elif [ -d "/tmp/forever-us-server" ]; then
    cp -r /tmp/forever-us-server/* ~/forever-us-server/
fi
log_info "Server files deployed"
echo ""

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
cd ~/forever-us-server
npm install -q 2>/dev/null || npm install
log_info "Dependencies installed"
echo ""

# Deploy frontend
echo -e "${YELLOW}Deploying frontend...${NC}"
if [ -d "/tmp/forever-us-frontend/build" ]; then
    mkdir -p ~/forever-us-frontend/build
    cp -r /tmp/forever-us-frontend/build/* ~/forever-us-frontend/build/
    log_info "Frontend deployed"
fi
echo ""

# Start server with PM2
echo -e "${YELLOW}Starting server...${NC}"
pm2 delete forever-us 2>/dev/null || true
cd ~/forever-us-server
pm2 start index.js --name forever-us
pm2 save
sudo pm2 startup -u ubuntu --hp /home/ubuntu > /dev/null 2>&1 || true
log_info "Server started"
echo ""

# Install and configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y -qq nginx
fi

sudo tee /etc/nginx/sites-available/forever-us > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/forever-us /etc/nginx/sites-enabled/forever-us
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t > /dev/null 2>&1
sudo systemctl restart nginx
log_info "Nginx configured"
echo ""

# Verify
echo -e "${YELLOW}Verifying deployment...${NC}"
if pm2 list | grep -q forever-us; then
    log_info "Server is running"
else
    log_error "Server is not running"
fi

if sudo systemctl is-active --quiet nginx; then
    log_info "Nginx is running"
else
    log_error "Nginx is not running"
fi
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "App running at: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "Commands:"
echo "  Logs:    pm2 logs forever-us"
echo "  Restart: pm2 restart forever-us"
echo "  Status:  pm2 status"
