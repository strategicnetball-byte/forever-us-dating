# Forever Us Frontend Deployment Script
# Usage: .\deploy-frontend.ps1

$AWS_IP = "3.0.99.28"
$SSH_KEY = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$BUILD_DIR = "client-new\build"

Write-Host "Building frontend..." -ForegroundColor Cyan
Set-Location client-new
npm run build
Set-Location ..

Write-Host "Uploading build to AWS..." -ForegroundColor Cyan
ssh -i $SSH_KEY ubuntu@$AWS_IP "sudo rm -rf /home/ubuntu/client-new/build/* ; sudo chown -R ubuntu:ubuntu /home/ubuntu/client-new/build ; sudo chmod -R 755 /home/ubuntu/client-new/build"

scp -i $SSH_KEY -r "$BUILD_DIR\*" ubuntu@$AWS_IP`:/home/ubuntu/client-new/build/

Write-Host "Setting permissions..." -ForegroundColor Cyan
ssh -i $SSH_KEY ubuntu@$AWS_IP "sudo chown -R www-data:www-data /home/ubuntu/client-new/build ; sudo chmod -R 755 /home/ubuntu/client-new/build"

Write-Host "Reloading Nginx..." -ForegroundColor Cyan
ssh -i $SSH_KEY ubuntu@$AWS_IP "sudo systemctl reload nginx"

Write-Host "Deployment complete!" -ForegroundColor Green
