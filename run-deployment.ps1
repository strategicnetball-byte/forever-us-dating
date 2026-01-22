# Forever Us - AWS Deployment Runner
# This script copies files to the instance and runs the deployment

param(
    [string]$InstanceIP = "18.141.201.176",
    [string]$PemPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
)

$user = "ubuntu"

Write-Host "🚀 Forever Us AWS Deployment" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "Target: $InstanceIP" -ForegroundColor Green
Write-Host ""

# Test connection
Write-Host "Testing SSH connection..." -ForegroundColor Yellow
$testConnection = ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=5 $user@$InstanceIP "echo 'ok'" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cannot connect to instance. Check IP and security group." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Connected" -ForegroundColor Green
Write-Host ""

# Step 1: Copy deployment script
Write-Host "Step 1: Copying deployment script..." -ForegroundColor Yellow
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "deploy-atlas.sh" "$user@$InstanceIP`:/tmp/deploy-atlas.sh" 2>&1 | Out-Null
ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP "chmod +x /tmp/deploy-atlas.sh" 2>&1 | Out-Null
Write-Host "✅ Deployment script copied" -ForegroundColor Green
Write-Host ""

# Step 2: Copy server files
Write-Host "Step 2: Copying server files..." -ForegroundColor Yellow
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r "server" "$user@$InstanceIP`:/tmp/forever-us-server" 2>&1 | Out-Null
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ".env" "$user@$InstanceIP`:/tmp/forever-us-server/.env" 2>&1 | Out-Null
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "package.json" "$user@$InstanceIP`:/tmp/forever-us-server/package.json" 2>&1 | Out-Null
scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "package-lock.json" "$user@$InstanceIP`:/tmp/forever-us-server/package-lock.json" 2>&1 | Out-Null
Write-Host "✅ Server files copied" -ForegroundColor Green
Write-Host ""

# Step 3: Copy frontend files (use pre-built version)
Write-Host "Step 3: Copying frontend files..." -ForegroundColor Yellow
if (Test-Path "client-new-backup/build") {
    scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r "client-new-backup/build" "$user@$InstanceIP`:/tmp/forever-us-frontend" 2>&1 | Out-Null
    Write-Host "✅ Pre-built frontend copied" -ForegroundColor Green
} else {
    scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r "client-new/src" "$user@$InstanceIP`:/tmp/forever-us-frontend" 2>&1 | Out-Null
    scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r "client-new/public" "$user@$InstanceIP`:/tmp/forever-us-frontend" 2>&1 | Out-Null
    scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "client-new/package.json" "$user@$InstanceIP`:/tmp/forever-us-frontend" 2>&1 | Out-Null
    scp -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "client-new/package-lock.json" "$user@$InstanceIP`:/tmp/forever-us-frontend" 2>&1 | Out-Null
    Write-Host "✅ Frontend source files copied" -ForegroundColor Green
}
Write-Host ""

# Step 4: Run deployment script
Write-Host "Step 4: Running deployment script..." -ForegroundColor Yellow
Write-Host "(This may take 5-10 minutes)" -ForegroundColor Gray
Write-Host ""

ssh -i $PemPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $user@$InstanceIP "bash /tmp/deploy-atlas.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your app is now running at:" -ForegroundColor Cyan
    Write-Host "   http://$InstanceIP" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Visit http://$InstanceIP in your browser" -ForegroundColor Gray
    Write-Host "2. Create a test account" -ForegroundColor Gray
    Write-Host "3. Test all features" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To SSH into the instance:" -ForegroundColor Yellow
    Write-Host "   ssh -i $PemPath $user@$InstanceIP" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To view logs:" -ForegroundColor Yellow
    Write-Host "   ssh -i $PemPath $user@$InstanceIP 'pm2 logs forever-us'" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Check the output above for errors." -ForegroundColor Red
    exit 1
}
