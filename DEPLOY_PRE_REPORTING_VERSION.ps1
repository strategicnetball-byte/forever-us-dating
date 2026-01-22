# Forever Us Deployment - Pre-Reporting Version
# This deploys the STABLE version WITHOUT the reporting system

$pemPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$instanceIP = "3.0.99.28"
$remoteUser = "ubuntu"

Write-Host "🚀 Forever Us Deployment - Pre-Reporting Version" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if instance is responsive
Write-Host "⏳ Checking if instance is responsive..." -ForegroundColor Yellow
$pingTest = ssh -i $pemPath $remoteUser@$instanceIP "echo 'OK'" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Instance is not responsive yet." -ForegroundColor Red
    Write-Host "   Please wait a bit longer and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Instance is responsive" -ForegroundColor Green
Write-Host ""

# Deploy server files (pre-reporting version)
Write-Host "📤 Deploying server files..." -ForegroundColor Yellow
$serverDest = "$remoteUser@$instanceIP`:/home/ubuntu/forever-us-server"
$envDest = "$remoteUser@$instanceIP`:/home/ubuntu/forever-us-server/.env"
scp -i $pemPath -r "server" $serverDest
scp -i $pemPath ".env" $envDest

Write-Host "✅ Server files deployed" -ForegroundColor Green
Write-Host ""

# Deploy frontend build
Write-Host "📤 Deploying frontend build..." -ForegroundColor Yellow
$frontendDest = "$remoteUser@$instanceIP`:/home/ubuntu/forever-us-frontend/"
scp -i $pemPath -r "client-new/build/*" $frontendDest

Write-Host "✅ Frontend build deployed" -ForegroundColor Green
Write-Host ""

# Restart the server
Write-Host "🔄 Restarting server..." -ForegroundColor Yellow
$sshCmd = "cd /home/ubuntu/forever-us-server && pm2 restart forever-us"
ssh -i $pemPath $remoteUser@$instanceIP $sshCmd

Write-Host "✅ Server restarted" -ForegroundColor Green
Write-Host ""

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Verify deployment
Write-Host "🔍 Verifying deployment..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$instanceIP" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ App is accessible!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  App may still be starting up. Check http://$instanceIP in a moment." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "   App URL: http://$instanceIP" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Important Notes:" -ForegroundColor Cyan
Write-Host "   - This is the PRE-REPORTING version (stable)" -ForegroundColor Gray
Write-Host "   - Reporting system is NOT included" -ForegroundColor Gray
Write-Host "   - All core features (Dashboard, Profile, Messages) are active" -ForegroundColor Gray
