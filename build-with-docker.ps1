# Forever Us - Build Frontend with Docker
# This script builds the frontend in a Docker container on Windows
# Requires: Docker Desktop installed and running

param(
    [Parameter(Mandatory=$false)]
    [string]$InstanceIP = "18.141.201.176"
)

$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$user = "ubuntu"

Write-Host "Forever Us - Docker Build & Deploy" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps > $null 2>&1
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Build in Docker
Write-Host ""
Write-Host "Building frontend in Docker..." -ForegroundColor Yellow
Write-Host "(This will take 5-10 minutes)" -ForegroundColor Cyan
Write-Host ""

$buildCommand = @"
cd /app/client-new && `
npm install --legacy-peer-deps && `
npm run build
"@

docker run --rm -v "$(Get-Location):/app" node:18 bash -c $buildCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful!" -ForegroundColor Green

# Check if build directory exists
if (-not (Test-Path "client-new/build/index.html")) {
    Write-Host "❌ Build output not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build output verified" -ForegroundColor Green
Write-Host ""

# Upload to AWS
Write-Host "Uploading to AWS..." -ForegroundColor Yellow
scp -i $keyPath -r "client-new/build/*" "${user}@${InstanceIP}:/home/ubuntu/forever-us-frontend/build/"

Write-Host "✅ Upload complete" -ForegroundColor Green
Write-Host ""

# Restart server
Write-Host "Restarting server..." -ForegroundColor Yellow
ssh -i $keyPath "${user}@${InstanceIP}" "pm2 restart forever-us"

Start-Sleep -Seconds 3

Write-Host "✅ Server restarted" -ForegroundColor Green
Write-Host ""

Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host "App URL: http://$InstanceIP" -ForegroundColor Cyan
Write-Host ""
Write-Host "The report button should now be visible on the Dashboard!" -ForegroundColor Green
