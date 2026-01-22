#!/bin/bash

# Forever Us - AWS Deployment with MongoDB Atlas
# Run this on the EC2 instance: bash deploy-atlas.sh

set -e

echo "🚀 Forever Us Deployment (MongoDB Atlas)"
echo "========================================"
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
sudo rm -f /etc/apt/sources.list.d/mongodb-org-7.0.list 2>/dev/null || true
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
    # Files are nested in server subdirectory
    cp -r /tmp/forever-us-server/server/* ~/forever-us-server/
    cp /tmp/forever-us-server/.env ~/forever-us-server/.env 2>/dev/null || true
    log_info "Server files copied"
elif [ -d "/tmp/forever-us-server" ]; then
    # Files are directly in the directory
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

# Step 7: Start server with PM2
echo -e "${YELLOW}Step 7: Starting server...${NC}"
pm2 delete forever-us 2>/dev/null || true
pm2 start index.js --name forever-us --watch
pm2 save
pm2 startup -u ubuntu --hp /home/ubuntu > /dev/null 2>&1 || true
log_info "Server started with PM2"
echo ""

# Step 8: Deploy frontend
echo -e "${YELLOW}Step 8: Deploying frontend...${NC}"
if [ -d "/tmp/forever-us-frontend/build" ]; then
    # Pre-built version
    mkdir -p ~/forever-us-frontend/build
    cp -r /tmp/forever-us-frontend/build/* ~/forever-us-frontend/build/
    log_info "Pre-built frontend deployed"
    FRONTEND_BUILT=true
elif [ -d "/tmp/forever-us-frontend/src" ]; then
    # Source files
    cp -r /tmp/forever-us-frontend/* ~/forever-us-frontend/
    log_info "Frontend source files copied"
    FRONTEND_BUILT=false
else
    log_warn "Frontend files not found"
    FRONTEND_BUILT=false
fi
echo ""

# Step 9: Build frontend (only if needed)
echo -e "${YELLOW}Step 9: Building frontend...${NC}"
if [ "$FRONTEND_BUILT" = false ] && [ -f "~/forever-us-frontend/package.json" ]; then
    cd ~/forever-us-frontend
    npm install -q 2>/dev/null || true
    npm run build -q 2>/dev/null || true
    log_info "Frontend built"
else
    log_warn "Frontend already built or source not available"
fi
echo ""

# Step 10: Install Nginx
echo -e "${YELLOW}Step 10: Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y -qq nginx
    log_info "Nginx installed"
else
    log_warn "Nginx already installed"
fi
echo ""

# Step 11: Configure Nginx
echo -e "${YELLOW}Step 11: Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/forever-us > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /home/ubuntu/forever-us-frontend/build;
        try_files $uri /index.html;
    }

    # API
    location /api {
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

    # Uploads
    location /uploads {
        alias /home/ubuntu/forever-us-server/uploads;
        expires 30d;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:3001/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/forever-us /etc/nginx/sites-enabled/forever-us
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t > /dev/null 2>&1
sudo systemctl restart nginx
log_info "Nginx configured"
echo ""

# Step 12: Verify deployment
echo -e "${YELLOW}Step 12: Verifying deployment...${NC}"
echo ""

# Check Node server
if pm2 list | grep -q forever-us; then
    log_info "Node server is running"
else
    log_error "Node server is not running"
fi

# Check Nginx
if sudo systemctl is-active --quiet nginx; then
    log_info "Nginx is running"
else
    log_error "Nginx is not running"
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
echo "  Nginx logs:    sudo tail -f /var/log/nginx/error.log"
echo ""
