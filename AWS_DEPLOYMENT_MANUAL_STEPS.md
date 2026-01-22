# AWS Deployment - Manual Steps

## Instance Details
- **IP**: 18.141.201.176
- **Key**: forever-us-new.pem
- **User**: ubuntu
- **Instance Type**: t2.small
- **OS**: Ubuntu 24.04 LTS

## Issues Encountered
1. Automated deployment script had issues with interactive prompts
2. MongoDB not available in Ubuntu 24.04 default repos
3. SSH connection timing out during Docker installation

## Manual Deployment Steps

### Step 1: SSH into Instance
```bash
ssh -i "C:\Users\Chris Annesley\Downloads\forever-us-new.pem" ubuntu@18.141.201.176
```

### Step 2: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (already done)
node --version  # Should show v18.20.8
npm --version   # Should show 10.8.2

# Install Docker
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu
```

### Step 3: Start MongoDB in Docker
```bash
# Run MongoDB container
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Wait for it to start
sleep 10

# Test connection
docker logs mongodb
```

### Step 4: Deploy Server
```bash
# Create directories
mkdir -p ~/forever-us-server ~/forever-us-frontend

# Copy files from local machine (run from your Windows machine):
# scp -i "C:\Users\Chris Annesley\Downloads\forever-us-new.pem" -r server ubuntu@18.141.201.176:~/forever-us-server/
# scp -i "C:\Users\Chris Annesley\Downloads\forever-us-new.pem" .env ubuntu@18.141.201.176:~/forever-us-server/.env

# Or manually on the instance:
cd ~/forever-us-server
npm install
```

### Step 5: Start Server
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start server
cd ~/forever-us-server
pm2 start index.js --name forever-us
pm2 save
pm2 startup
```

### Step 6: Deploy Frontend
```bash
# Copy frontend files
cd ~/forever-us-frontend
# Copy src, public, package.json, package-lock.json

# Install and build
npm install
npm run build
```

### Step 7: Setup Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo tee /etc/nginx/sites-available/forever-us > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        root /home/ubuntu/forever-us-frontend/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /home/ubuntu/forever-us-server/uploads;
    }
}
NGINX

# Enable site
sudo ln -sf /etc/nginx/sites-available/forever-us /etc/nginx/sites-enabled/forever-us
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Verify Everything
```bash
# Check server
pm2 status

# Check MongoDB
docker ps

# Check Nginx
sudo systemctl status nginx

# Test API
curl http://localhost:3001/api/users/profile

# Test frontend
curl http://localhost/
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# View logs
docker logs mongodb

# Restart if needed
docker restart mongodb
```

### Server Not Starting
```bash
# Check PM2 logs
pm2 logs forever-us

# Check Node version
node --version

# Reinstall dependencies
cd ~/forever-us-server
rm -rf node_modules package-lock.json
npm install
```

### Frontend Build Issues
```bash
# Clear cache
cd ~/forever-us-frontend
rm -rf node_modules build
npm install
npm run build
```

### Nginx Issues
```bash
# Check config
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart
sudo systemctl restart nginx
```

## Access Your App
Once everything is running:
- **Frontend**: http://18.141.201.176
- **API**: http://18.141.201.176/api
- **Backend Direct**: http://18.141.201.176:3001

## Next Steps
1. SSH into the instance
2. Follow the manual steps above
3. Test the app
4. Create test accounts
5. Verify all features work
