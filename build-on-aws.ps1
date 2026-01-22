# Build the app on AWS using Docker
# This solves the Windows build issue by building on the Linux server

param(
    [switch]$NoRestart = $false
)

$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$awsHost = "ubuntu@18.141.201.176"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Forever Us - Build on AWS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Uploading source code to AWS..." -ForegroundColor Green
# Upload the client-new source code
scp -i $keyPath -r "client-new/src" "$awsHost`:/tmp/forever-us-src/" 2>&1 | Select-String -Pattern "100%|error" -ErrorAction SilentlyContinue
scp -i $keyPath "client-new/package.json" "$awsHost`:/tmp/forever-us-src/" 2>&1 | Select-String -Pattern "100%|error" -ErrorAction SilentlyContinue
scp -i $keyPath "client-new/package-lock.json" "$awsHost`:/tmp/forever-us-src/" 2>&1 | Select-String -Pattern "100%|error" -ErrorAction SilentlyContinue
scp -i $keyPath "client-new/tsconfig.json" "$awsHost`:/tmp/forever-us-src/" 2>&1 | Select-String -Pattern "100%|error" -ErrorAction SilentlyContinue
scp -i $keyPath "client-new/public" "$awsHost`:/tmp/forever-us-src/" -r 2>&1 | Select-String -Pattern "100%|error" -ErrorAction SilentlyContinue

Write-Host "[2/4] Building on AWS..." -ForegroundColor Green
ssh -i $keyPath $awsHost @"
cd /tmp/forever-us-src
npm ci
npm run build
"@ 2>&1 | Select-String -Pattern "successfully|error|failed" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed on AWS" -ForegroundColor Red
    exit 1
}

Write-Host "[3/4] Copying build to deployment directory..." -ForegroundColor Green
ssh -i $keyPath $awsHost "cp -r /tmp/forever-us-src/build/* /home/ubuntu/forever-us-frontend/build/" 2>&1 | Select-String -Pattern "error" -ErrorAction SilentlyContinue

Write-Host "[4/4] Restarting server..." -ForegroundColor Green
ssh -i $keyPath $awsHost "pm2 restart forever-us" 2>&1 | Select-String -Pattern "online|error" -ErrorAction SilentlyContinue

Write-Host "`n================================" -ForegroundColor Green
Write-Host "Build complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "`nApp URL: http://18.141.201.176" -ForegroundColor Cyan
Write-Host "Hard refresh browser to see changes" -ForegroundColor Cyan
