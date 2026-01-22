# Forever Us Deployment Script
# This script deploys the pre-reporting version to AWS

$pemPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$instanceIP = "3.0.99.28"
$remoteUser = "ubuntu"

Write-Host "🚀 Forever Us Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if instance is responsive
Write-Host "⏳ Checking if instance is responsive..." -ForegroundColor Yellow
$pingTest = ssh -i $pemPath $remoteUser@$instanceIP "echo 'OK'" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Instance is not responsive. Please restart it from AWS console." -ForegroundColor Red
    Write-Host "   Once restarted, run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Instance is responsive" -ForegroundColor Green
Write-Host ""

# Deploy server files
Write-Host "📤 Deploying server files..." -ForegroundColor Yellow
scp -i $pemPath -r "server" "$remoteUser@$instanceIP:/home/ubuntu/forever-us-server"
scp -i $pemPath ".env" "$remoteUser@$instanceIP:/home/ubuntu/forever-us-server/.env"

# Deploy frontend build
Write-Host "📤 Deploying frontend build..." -ForegroundColor Yellow
scp -i $pemPath -r "client-new/build" "$remoteUser@$instanceIP:/home/ubuntu/forever-us-frontend"

Write-Host "✅ Files deployed" -ForegroundColor Green
Write-Host ""

# Restart the server
Write-Host "🔄 Restarting server..." -ForegroundColor Yellow
ssh -i $pemPath $remoteUser@$instanceIP "cd /home/ubuntu/forever-us-server && pm2 restart forever-us"

Write-Host "✅ Server restarted" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "   App should be available at: http://3.0.99.28" -ForegroundColor Cyan
