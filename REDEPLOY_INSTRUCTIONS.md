# Forever Us - Redeploy to AWS (New Instance)

## Current Situation

The instance at 52.221.223.55 has network connectivity issues:
- SSH times out (port 22 unreachable)
- SSM Agent offline (can't connect to Systems Manager)
- These are AWS infrastructure issues, not application issues

**Solution**: Create a new instance and redeploy. The second deployment will be much faster.

---

## Quick Start (5 Minutes to New Instance)

### 1. Terminate Old Instance

1. Go to https://console.aws.amazon.com
2. EC2 → Instances
3. Right-click instance 52.221.223.55
4. Instance State → Terminate
5. Confirm
6. Wait 2 minutes

### 2. Create New Instance

1. Click "Launch Instances"
2. **Name**: Forever Us
3. **AMI**: Ubuntu 22.04 LTS
4. **Instance Type**: t2.micro
5. **Key Pair**: Forever Us (existing)
6. **Security Group**: Create new
   - Name: forever-us-sg
   - Inbound Rules:
     - SSH (22): 0.0.0.0/0
     - HTTP (80): 0.0.0.0/0
     - HTTPS (443): 0.0.0.0/0
7. **Storage**: 20 GB
8. Click "Launch Instance"
9. Wait 2-3 minutes for instance to start

### 3. Get New IP

1. EC2 → Instances
2. Click new instance
3. Copy "Public IPv4 address" (e.g., 54.123.45.67)

### 4. Test SSH Connection

```powershell
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<NEW_IP>
```

Replace `<NEW_IP>` with your new IP. You should get a prompt like:
```
ubuntu@ip-172-31-46-74:~$
```

If it works, proceed to Step 5. If it times out, wait 30 seconds and try again.

---

## Deployment (20 Minutes)

### Option A: Automated (Recommended)

**From PowerShell on your local machine:**

```powershell
# Navigate to your project directory
cd "E:\Forever Us"

# Run the deployment script
.\deploy-to-aws.ps1 -InstanceIP <NEW_IP>
```

Replace `<NEW_IP>` with your new instance IP.

This will:
- Upload all source code
- Install dependencies
- Build frontend
- Configure Nginx
- Start backend
- Display your new app URL

**Time**: ~20 minutes

### Option B: Manual (Step-by-Step)

**SSH into the instance:**

```powershell
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<NEW_IP>
```

**Then run these commands one by one:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install PM2
sudo npm install -g pm2

# Create swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Install backend dependencies
cd ~
npm install

# Install frontend dependencies
cd ~/client-new
npm install

# Build frontend
npm run build

# Configure Nginx
sudo tee /etc/nginx/sites-available/forever-us > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        root /home/ubuntu/client-new/build;
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

# Enable Nginx config
sudo ln -sf /etc/nginx/sites-available/forever-us /etc/nginx/sites-enabled/forever-us
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Fix permissions
sudo chmod -R 755 /home/ubuntu/client-new/build

# Start backend
cd ~
pm2 start node --name "forever-us" -- server/index.js
pm2 save
sudo pm2 startup

# Check logs
pm2 logs forever-us
```

---

## Upload Source Code

If you don't have a GitHub repo, upload files via SCP:

```powershell
# From your local machine (PowerShell)
$IP = "<NEW_IP>"
$Key = "C:\Users\Chris Annesley\Downloads\Forever Us.pem"

scp -i $Key -r server ubuntu@${IP}:~/
scp -i $Key -r client-new ubuntu@${IP}:~/
scp -i $Key package.json ubuntu@${IP}:~/
scp -i $Key package-lock.json ubuntu@${IP}:~/
```

---

## Verify Deployment

### Check Backend Logs

```bash
pm2 logs forever-us
```

You should see:
```
✅ Connected to MongoDB
Server running on port 3001
```

### Test Frontend

1. Open browser: `http://<NEW_IP>`
2. You should see the login page
3. Try to register a new account
4. Login
5. Upload a photo

### Check Nginx

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
```

---

## Troubleshooting

### SSH Connection Timeout
- Wait 30 seconds after instance starts
- Verify security group allows port 22
- Check instance is "Running" in AWS console

### Backend Not Connecting to MongoDB
```bash
pm2 logs forever-us
```
Check for connection errors. Verify:
- MongoDB Atlas cluster is running
- Connection string is correct in `.env`
- IP whitelist includes 0.0.0.0/0

### Frontend Not Loading
```bash
sudo tail -f /var/log/nginx/error.log
```

### npm install Fails (Out of Memory)
The swap space should prevent this. If it happens:
```bash
sudo swapon --show  # Check swap is active
```

---

## Files Included

- `QUICK_REDEPLOY_SCRIPT.md` - Detailed step-by-step guide
- `deploy.sh` - Automated bash script for instance
- `deploy-to-aws.ps1` - PowerShell script for local machine
- `REDEPLOY_INSTRUCTIONS.md` - This file

---

## Key Information

| Item | Value |
|------|-------|
| Old Instance IP | 52.221.223.55 (terminate) |
| New Instance IP | (will be provided by AWS) |
| SSH Key | C:\Users\Chris Annesley\Downloads\Forever Us.pem |
| Backend Port | 3001 (internal) |
| Frontend Port | 80 (public) |
| MongoDB | Already configured in .env |
| Region | ap-southeast-1 |
| Instance Type | t2.micro (free tier) |

---

## Time Estimate

| Step | Time |
|------|------|
| Terminate old instance | 2 min |
| Create new instance | 2-3 min |
| SSH connection | 1 min |
| Deployment (automated) | 15-20 min |
| **Total** | **~25 minutes** |

---

## Next Steps After Deployment

1. ✅ App is live at `http://<NEW_IP>`
2. Test registration/login
3. Upload profile photo
4. Browse profiles
5. Like/match
6. Send messages
7. Check rewards system
8. Verify ad networks (if configured)

---

## Support

If you encounter issues:

1. Check logs: `pm2 logs forever-us`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. SSH into instance and debug manually
4. Refer to `QUICK_REDEPLOY_SCRIPT.md` for detailed steps

---

**Status**: Ready to redeploy
**Estimated Time**: 25 minutes
**Difficulty**: Easy (mostly automated)

