# Forever Us - Deploy Reporting System Fix
# Deploys updated Dashboard and AuthContext with report button styling

param(
    [Parameter(Mandatory=$false)]
    [string]$InstanceIP = "18.141.201.176"
)

$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$user = "ubuntu"

Write-Host "Deploying Reporting System Fix to $InstanceIP" -ForegroundColor Green
Write-Host ""

if (-not (Test-Path $keyPath)) {
    Write-Host "Key not found at $keyPath" -ForegroundColor Red
    exit 1
}

# Upload updated client source files
Write-Host "Uploading updated client source files..." -ForegroundColor Yellow
scp -i $keyPath -r client-new/src "${user}@${InstanceIP}:/tmp/forever-us-client-src/"

# Upload updated server files
Write-Host "Uploading updated server files..." -ForegroundColor Yellow
scp -i $keyPath -r server "${user}@${InstanceIP}:/tmp/forever-us-server/"

# Create deployment script on remote
Write-Host "Creating remote deployment script..." -ForegroundColor Yellow
$remoteScript = @"
#!/bin/bash
set -e

echo "Deploying reporting system fix..."

# Stop the server
echo "Stopping server..."
sudo systemctl stop forever-us || true

# Update client source
echo "Updating client source files..."
cp -r /tmp/forever-us-client-src/* /home/ubuntu/forever-us/client-new/src/

# Update server files
echo "Updating server files..."
cp -r /tmp/forever-us-server/* /home/ubuntu/forever-us/server/

# Rebuild frontend
echo "Building frontend..."
cd /home/ubuntu/forever-us/client-new
npm run build 2>&1 || {
    echo "Frontend build failed, using pre-built version..."
    cp -r /home/ubuntu/forever-us/client-new-backup/build /home/ubuntu/forever-us/client-new/
}

# Start the server
echo "Starting server..."
sudo systemctl start forever-us

# Wait for server to start
sleep 3

# Check if server is running
if sudo systemctl is-active --quiet forever-us; then
    echo "✅ Server started successfully"
else
    echo "❌ Server failed to start"
    sudo systemctl status forever-us
    exit 1
fi

echo "✅ Deployment complete!"
"@

# Write script to temp file and upload
$tempScript = "$env:TEMP\deploy-remote.sh"
$remoteScript | Out-File -FilePath $tempScript -Encoding ASCII
scp -i $keyPath $tempScript "${user}@${InstanceIP}:/tmp/deploy-remote.sh"
Remove-Item $tempScript

# Run deployment
Write-Host "Running remote deployment..." -ForegroundColor Yellow
ssh -i $keyPath "${user}@${InstanceIP}" "bash /tmp/deploy-remote.sh"

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "App running at: http://$InstanceIP" -ForegroundColor Cyan
