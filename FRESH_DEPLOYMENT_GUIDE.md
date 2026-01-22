# Fresh AWS Deployment Guide - Forever Us

## Overview
This guide will help you set up a new AWS EC2 instance (t2.small) and deploy Forever Us with a clean, working environment.

## Prerequisites
- AWS Account with EC2 access
- SSH key pair (you already have `forever-us-new.pem`)
- Your source code (already in local workspace)

## Step 1: Launch New EC2 Instance

1. Go to AWS Console → EC2 → Instances
2. Click "Launch Instances"
3. Configure:
   - **AMI**: Ubuntu 22.04 LTS (ami-0c55b159cbfafe1f0 or similar)
   - **Instance Type**: t2.small (2GB RAM - important for npm builds)
   - **Key Pair**: Use your existing `forever-us-new.pem`
   - **Security Group**: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3001 (API)
   - **Storage**: 20GB (default is fine)

4. Launch and note the new IP address (e.g., 1.2.3.4)

## Step 2: Connect to Instance

```powershell
ssh -i "C:\Users\Chris Annesley\Downloads\forever-us-new.pem" ubuntu@<NEW_IP>
```

## Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install MongoDB (or use MongoDB Atlas)
# For local MongoDB:
sudo apt install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Step 4: Deploy Your Code

From your local machine:

```powershell
$newIp = "<YOUR_NEW_IP>"
$pemPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$user = "ubuntu"

# Create directories
ssh -i $pemPath $user@$newIp "mkdir -p /home/ubuntu/forever-us-server /home/ubuntu/forever-us-frontend"

# Deploy server code
scp -i $pemPath -r "server" "$user@$newIp:/home/ubuntu/forever-us-server"
scp -i $pemPath ".env" "$user@$newIp:/home/ubuntu/forever-us-server/.env"

# Deploy client code
scp -i $pemPath -r "client-new/src" "$user@$newIp:/home/ubuntu/forever-us-frontend"
scp -i $pemPath "client-new/package.json" "$user@$newIp:/home/ubuntu/forever-us-frontend"
scp -i $pemPath "client-new/package-lock.json" "$user@$newIp:/home/ubuntu/forever-us-frontend"
scp -i $pemPath "client-new/public" "$user@$newIp:/home/ubuntu/forever-us-frontend"
```

## Step 5: Build and Start Server

```bash
# SSH into instance
ssh -i "C:\Users\Chris Annesley\Downloads\forever-us-new.pem" ubuntu@<NEW_IP>

# Install server dependencies
cd /home/ubuntu/forever-us-server
npm install

# Start server with PM2
pm2 start index.js --name forever-us
pm2 save
pm2 startup

# Check status
pm2 status
```

## Step 6: Build and Deploy Frontend

```bash
# On your local machine, build the frontend
cd client-new
npm install
npm run build

# Deploy the build
scp -i $pemPath -r "client-new/build" "$user@$newIp:/home/ubuntu/forever-us-frontend"
```

## Step 7: Configure Nginx (Optional but Recommended)

```bash
# SSH into instance
sudo apt install -y nginx

# Create nginx config
sudo tee /etc/nginx/sites-available/forever-us > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        root /home/ubuntu/forever-us-frontend/build;
        try_files \$uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        alias /home/ubuntu/forever-us-server/uploads;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/forever-us /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Verify Deployment

```bash
# Check server is running
pm2 status

# Check logs
pm2 logs forever-us

# Test API
curl http://localhost:3001/api/auth/me

# Test frontend
curl http://localhost
```

## Step 9: Update Your Local .env

Make sure your `.env` file has the correct MongoDB connection string and other settings:

```
MONGODB_URI=mongodb://localhost:27017/forever-us
PORT=3001
CLIENT_URL=http://<NEW_IP>
```

## Troubleshooting

**Server won't start:**
```bash
pm2 logs forever-us
# Check for MongoDB connection errors
# Check .env file is present
```

**Frontend not loading:**
```bash
# Check nginx is running
sudo systemctl status nginx

# Check build exists
ls -la /home/ubuntu/forever-us-frontend/build
```

**Port already in use:**
```bash
# Find what's using port 3001
sudo lsof -i :3001

# Kill it if needed
sudo kill -9 <PID>
```

## Next Steps

1. Test the app at `http://<NEW_IP>`
2. Create test accounts
3. Verify all features work
4. Set up SSL certificate (Let's Encrypt)
5. Configure domain name if you have one

## Important Notes

- t2.small has 2GB RAM - sufficient for npm builds
- Keep PM2 running with `pm2 startup` and `pm2 save`
- Monitor logs regularly: `pm2 logs`
- Back up your database regularly
- Consider using MongoDB Atlas instead of local MongoDB for production

---

**Your code is safe and ready to deploy. All your work is preserved.**
