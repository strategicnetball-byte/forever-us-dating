# Deploy client-new to AWS
# Builds on AWS and deploys the new version

$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$awsHost = "ubuntu@18.141.201.176"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Forever Us - Deploy client-new" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Uploading client-new source..." -ForegroundColor Green
scp -i $keyPath -r "client-new/src" "$awsHost`:/home/ubuntu/forever-us-build/src"
scp -i $keyPath -r "client-new/public" "$awsHost`:/home/ubuntu/forever-us-build/public"
scp -i $keyPath "client-new/package.json" "$awsHost`:/home/ubuntu/forever-us-build/"
scp -i $keyPath "client-new/package-lock.json" "$awsHost`:/home/ubuntu/forever-us-build/"
scp -i $keyPath "client-new/tsconfig.json" "$awsHost`:/home/ubuntu/forever-us-build/"

Write-Host "[2/4] Building on AWS..." -ForegroundColor Green
ssh -i $keyPath $awsHost @"
cd /home/ubuntu/forever-us-build
npm ci
npm run build
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "[3/4] Deploying build..." -ForegroundColor Green
ssh -i $keyPath $awsHost "rm -rf /home/ubuntu/forever-us-frontend/build/* && cp -r /home/ubuntu/forever-us-build/build/* /home/ubuntu/forever-us-frontend/build/"

Write-Host "[4/4] Restarting server..." -ForegroundColor Green
ssh -i $keyPath $awsHost "pm2 restart forever-us"

Write-Host "`n================================" -ForegroundColor Green
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "`nApp URL: http://18.141.201.176" -ForegroundColor Cyan
Write-Host "Hard refresh browser to see changes" -ForegroundColor Cyan
