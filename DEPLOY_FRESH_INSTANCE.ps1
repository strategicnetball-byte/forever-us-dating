# Forever Us - Fresh Instance Deployment Script
# This script automates the entire deployment process

param(
    [string]$InstanceIP = "",
    [string]$PemPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
)

$user = "ubuntu"

if ([string]::IsNullOrEmpty($InstanceIP)) {
    Write-Host "Usage: .\DEPLOY_FRESH_INSTANCE.ps1 -InstanceIP <IP_ADDRESS>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps to get IP:" -ForegroundColor Cyan
    Write-Host "1. Launch new t2.small EC2 instance on AWS" -ForegroundColor Gray
    Write-Host "2. Wait for it to be 'running'" -ForegroundColor Gray
    Write-Host "3. Copy the Public IPv4 address" -ForegroundColor Gray
    Write-Host "4. Run this script with that IP" -ForegroundColor Gray
    exit 1
}

Write-Host "🚀 Forever Us Fresh Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Target: $InstanceIP" -ForegroundColor Green
Write-Host ""

# Test connection
Write-Host "Testing SSH connection..." -ForegroundColor Yellow
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP "echo 'Connected'" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cannot connect to instance. Check IP and security group." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Connected" -ForegroundColor Green
Write-Host ""

# Step 1: Update system and install dependencies
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP @"
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
"@ 2>&1 | Out-Null
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 2: Create directories
Write-Host "Step 2: Creating directories..." -ForegroundColor Yellow
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP "mkdir -p /home/ubuntu/forever-us-server /home/ubuntu/forever-us-frontend" 2>&1 | Out-Null
Write-Host "✅ Directories created" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy server
Write-Host "Step 3: Deploying server code..." -ForegroundColor Yellow
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r "server" "$user@$InstanceIP`:/home/ubuntu/forever-us-server" 2>&1 | Out-Null
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ".env" "$user@$InstanceIP`:/home/ubuntu/forever-us-server/.env" 2>&1 | Out-Null
Write-Host "✅ Server deployed" -ForegroundColor Green
Write-Host ""

# Step 4: Install server dependencies
Write-Host "Step 4: Installing server dependencies..." -ForegroundColor Yellow
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP "cd /home/ubuntu/forever-us-server && npm install" 2>&1 | Out-Null
Write-Host "✅ Server dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 5: Start server
Write-Host "Step 5: Starting server..." -ForegroundColor Yellow
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP @"
cd /home/ubuntu/forever-us-server
pm2 start index.js --name forever-us
pm2 save
pm2 startup
"@ 2>&1 | Out-Null
Write-Host "✅ Server started" -ForegroundColor Green
Write-Host ""

# Step 6: Deploy frontend
Write-Host "Step 6: Deploying frontend..." -ForegroundColor Yellow
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r "client-new/src" "$user@$InstanceIP`:/home/ubuntu/forever-us-frontend" 2>&1 | Out-Null
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "client-new/package.json" "$user@$InstanceIP`:/home/ubuntu/forever-us-frontend" 2>&1 | Out-Null
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "client-new/package-lock.json" "$user@$InstanceIP`:/home/ubuntu/forever-us-frontend" 2>&1 | Out-Null
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r "client-new/public" "$user@$InstanceIP`:/home/ubuntu/forever-us-frontend" 2>&1 | Out-Null
Write-Host "✅ Frontend deployed" -ForegroundColor Green
Write-Host ""

# Step 7: Build frontend
Write-Host "Step 7: Building frontend (this may take a few minutes)..." -ForegroundColor Yellow
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP @"
cd /home/ubuntu/forever-us-frontend
npm install
npm run build
"@ 2>&1 | Out-Null
Write-Host "✅ Frontend built" -ForegroundColor Green
Write-Host ""

# Step 8: Setup Nginx
Write-Host "Step 8: Setting up Nginx..." -ForegroundColor Yellow
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP @"
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/forever-us > /dev/null <<'NGINX'
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
NGINX

sudo ln -sf /etc/nginx/sites-available/forever-us /etc/nginx/sites-enabled/forever-us
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
"@ 2>&1 | Out-Null
Write-Host "✅ Nginx configured" -ForegroundColor Green
Write-Host ""

# Step 9: Verify
Write-Host "Step 9: Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP "pm2 status" 2>&1 | Out-Null
Write-Host "✅ Verification complete" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your app is now running at:" -ForegroundColor Cyan
Write-Host "   http://$InstanceIP" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit http://$InstanceIP in your browser" -ForegroundColor Gray
Write-Host "2. Create a test account" -ForegroundColor Gray
Write-Host "3. Test all features" -ForegroundColor Gray
Write-Host "4. Check logs: ssh -i $PemPath $user@$InstanceIP 'pm2 logs forever-us'" -ForegroundColor Gray
Write-Host ""
Write-Host "To SSH into the instance:" -ForegroundColor Yellow
Write-Host "   ssh -i $PemPath $user@$InstanceIP" -ForegroundColor Gray
