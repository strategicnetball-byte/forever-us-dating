# Forever Us - Fresh Deployment to AWS
# Usage: .\deploy-fresh.ps1 -InstanceIP <ip>

param(
    [Parameter(Mandatory=$true)]
    [string]$InstanceIP
)

$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$user = "ubuntu"

Write-Host "Deploying Forever Us to $InstanceIP" -ForegroundColor Green
Write-Host ""

if (-not (Test-Path $keyPath)) {
    Write-Host "Key not found at $keyPath" -ForegroundColor Red
    exit 1
}

# Upload deployment script
Write-Host "Uploading deployment script..." -ForegroundColor Yellow
scp -i $keyPath deploy-fresh.sh "${user}@${InstanceIP}:/tmp/deploy-fresh.sh"

# Upload server files
Write-Host "Uploading server files..." -ForegroundColor Yellow
scp -i $keyPath -r server "${user}@${InstanceIP}:/tmp/forever-us-server/"
scp -i $keyPath .env "${user}@${InstanceIP}:/tmp/forever-us-server/.env"

# Upload frontend files
Write-Host "Uploading frontend files..." -ForegroundColor Yellow
scp -i $keyPath -r client-new-backup/build "${user}@${InstanceIP}:/tmp/forever-us-frontend/"

# Run deployment
Write-Host "Running deployment..." -ForegroundColor Yellow
ssh -i $keyPath "${user}@${InstanceIP}" "bash /tmp/deploy-fresh.sh"

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "App running at: http://$InstanceIP" -ForegroundColor Cyan
