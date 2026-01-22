# Auto-deploy function - one command to deploy to AWS
# Usage: .\deploy-local.ps1

param(
    [switch]$NoRestart = $false
)

$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$awsHost = "ubuntu@18.141.201.176"
$buildPath = "client/build/build"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Forever Us - Auto Deploy" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if build exists
if (-not (Test-Path $buildPath)) {
    Write-Host "ERROR: Build not found at $buildPath" -ForegroundColor Red
    Write-Host "Run: npm run build in client directory first" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n[1/3] Uploading build to AWS..." -ForegroundColor Green
scp -i $keyPath -r "$buildPath/*" "$awsHost`:/home/ubuntu/forever-us-frontend/build/" 2>&1 | Select-String -Pattern "100%|error" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed" -ForegroundColor Red
    exit 1
}

Write-Host "[2/3] Restarting server..." -ForegroundColor Green
ssh -i $keyPath $awsHost "pm2 restart forever-us" 2>&1 | Select-String -Pattern "online|error" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Server restart failed" -ForegroundColor Red
    exit 1
}

Write-Host "[3/3] Verifying deployment..." -ForegroundColor Green
ssh -i $keyPath $awsHost "pm2 status forever-us" 2>&1 | Select-String -Pattern "online|stopped" -ErrorAction SilentlyContinue

Write-Host "`n================================" -ForegroundColor Green
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "`nApp URL: http://18.141.201.176" -ForegroundColor Cyan
Write-Host "Hard refresh browser to see changes" -ForegroundColor Cyan
