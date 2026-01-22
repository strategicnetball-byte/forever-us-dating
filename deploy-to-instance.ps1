# Deploy Forever Us to AWS Instance (Direct Port 80)

$instanceIP = "18.141.201.176"
$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$user = "ubuntu"

Write-Host "Deploying Forever Us to $instanceIP" -ForegroundColor Green

# Check if key exists
if (-not (Test-Path $keyPath)) {
    Write-Host "Key not found at $keyPath" -ForegroundColor Red
    exit 1
}

# Copy deployment script
Write-Host "Uploading deployment script..." -ForegroundColor Yellow
scp -i $keyPath deploy-direct.sh "${user}@${instanceIP}:/tmp/deploy-direct.sh"

# Copy server files
Write-Host "Uploading server files..." -ForegroundColor Yellow
scp -i $keyPath -r server "${user}@${instanceIP}:/tmp/forever-us-server/"
scp -i $keyPath .env "${user}@${instanceIP}:/tmp/forever-us-server/.env"

# Copy frontend files
Write-Host "Uploading frontend files..." -ForegroundColor Yellow
scp -i $keyPath -r client-new-backup/build "${user}@${instanceIP}:/tmp/forever-us-frontend/"

# Run deployment script
Write-Host "Running deployment on instance..." -ForegroundColor Yellow
ssh -i $keyPath "${user}@${instanceIP}" "bash /tmp/deploy-direct.sh"

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "App running at: http://$instanceIP" -ForegroundColor Cyan
