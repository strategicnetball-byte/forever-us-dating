# Quick Redeploy Script - Forever Us to AWS

Since the current instance (52.221.223.55) has network connectivity issues (SSH timeout, SSM Agent offline), we'll create a new instance. This script automates the entire process.

## Step 1: Terminate Current Instance

1. Go to AWS Console: https://console.aws.amazon.com
2. EC2 → Instances
3. Right-click instance 52.221.223.55
4. Instance State → Terminate
5. Confirm termination
6. Wait 2 minutes for termination to complete

## Step 2: Create New EC2 Instance

1. Click "Launch Instances"
2. **Name**: Forever Us
3. **AMI**: Ubuntu 22.04 LTS (free tier eligible)
4. **Instance Type**: t2.micro (free tier)
5. **Key Pair**: Select "Forever Us" (or create new)
6. **Network Settings**:
   - VPC: Default
   - Auto-assign public IP: Enable
   - Security Group: Create new
     - Name: forever-us-sg
     - Inbound Rules:
       - SSH (22): 0.0.0.0/0
       - HTTP (80): 0.0.0.0/0
       - HTTPS (443): 0.0.0.0/0
7. **Storage**: 20 GB (default)
8. Click "Launch Instance"
9. Wait 2-3 minutes for instance to start

## Step 3: Get New IP Address

1. Go to EC2 → Instances
2. Click the new instance
3. Copy the "Public IPv4 address" (e.g., 54.xxx.xxx.xxx)
4. Note this down - you'll need it

## Step 4: SSH into New Instance

```powershell
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<NEW_IP>
```

Replace `<NEW_IP>` with the IP from Step 3.

## Step 5: Run Deployment Commands

Once SSH is connected, run these commands one by one:

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install Nginx
```bash
sudo apt install -y nginx
```

### Install Git
```bash
sudo apt install -y git
```

### Install PM2
```bash
sudo npm install -g pm2
```

### Create 2GB Swap (for build)
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Clone Repository
```bash
cd ~
git clone https://github.com/yourusername/forever-us.git
cd forever-us
```

Or if you don't have a GitHub repo, upload via SCP:
```powershell
# From your local machine (PowerShell)
scp -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" -r server ubuntu@<NEW_IP>:~/
scp -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" -r client-new ubuntu@<NEW_IP>:~/
scp -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" package.json ubuntu@<NEW_IP>:~/
```

### Install Backend Dependencies
```bash
cd ~/
npm install
```

### Install Frontend Dependencies
```bash
cd ~/client-new
npm install
```

### Build Frontend
```bash
npm run build
```

### Create .env File
```bash
cd ~/
cat > .env << 'EOF'
# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://strategicnetball_db_user:Faith@Miley2025@cluster0.y2tnarx.mongodb.net/forever-us?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=forever-us-super-secret-jwt-key-2024

# Server Port
PORT=3001

# Client URL (for CORS)
CLIENT_URL=http://<NEW_IP>

# AdSense/AdMob Configuration
REACT_APP_ADMOB_CLIENT_ID=pub-1497360981430251
REACT_APP_ADSENSE_CUSTOMER_ID=363-006-2612

# Ad Unit IDs
REACT_APP_ADMOB_BANNER_AD_UNIT_ID=ca-app-pub-1497360981430251~4357056055
REACT_APP_ADMOB_NATIVE_AD_UNIT_ID=ca-app-pub-1497360981430251/7500070624
REACT_APP_ADMOB_INTERSTITIAL_AD_UNIT_ID=ca-app-pub-1497360981430251/5236869362
EOF
```

Replace `<NEW_IP>` with your actual IP.

### Verify .env
```bash
cat .env
```

### Configure Nginx
```bash
sudo tee /etc/nginx/sites-available/forever-us > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    # Serve static files from the built frontend
    location / {
        root /home/ubuntu/client-new/build;
        try_files $uri /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3001/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
EOF
```

### Enable Nginx Config
```bash
sudo ln -sf /etc/nginx/sites-available/forever-us /etc/nginx/sites-enabled/forever-us
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Fix File Permissions
```bash
sudo chmod -R 755 /home/ubuntu/client-new/build
```

### Start Backend with PM2
```bash
cd ~/
pm2 start node --name "forever-us" -- server/index.js
pm2 save
pm2 startup
```

### Verify Backend is Running
```bash
pm2 logs forever-us
```

You should see:
```
✅ Connected to MongoDB
Server running on port 3001
```

## Step 6: Test the App

1. Open browser: `http://<NEW_IP>` (replace with your new IP)
2. You should see the login page
3. Try to register a new account
4. Login
5. Upload a photo
6. Browse profiles

## Step 7: Update DNS (Optional)

If you have a domain, update the DNS A record to point to the new IP.

## Troubleshooting

### Backend not connecting to MongoDB
```bash
pm2 logs forever-us
```
Check for connection errors. Verify:
- MongoDB Atlas cluster is running
- Connection string is correct
- IP whitelist includes 0.0.0.0/0

### Frontend not loading
```bash
sudo tail -f /var/log/nginx/error.log
```

### SSH Connection Timeout
- Wait 30 seconds after instance starts
- Verify security group allows port 22
- Try again

## Quick Reference

- **New Instance IP**: (will be provided by AWS)
- **SSH Command**: `ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<NEW_IP>`
- **App URL**: `http://<NEW_IP>`
- **MongoDB**: Already configured in .env
- **Backend Port**: 3001 (internal)
- **Frontend Port**: 80 (public)

## Time Estimate

- Instance creation: 2-3 minutes
- SSH connection: 1 minute
- Deployment: 15-20 minutes (mostly waiting for npm install and build)
- **Total**: ~20-25 minutes

