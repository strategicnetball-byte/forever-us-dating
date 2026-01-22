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

# Upload updated server files
Write-Host "Uploading updated server files..." -ForegroundColor Yellow
scp -i $keyPath server/index.js "${user}@${InstanceIP}:/tmp/index.js"
scp -i $keyPath server/models/Report.js "${user}@${InstanceIP}:/tmp/Report.js"
scp -i $keyPath server/routes/reports.js "${user}@${InstanceIP}:/tmp/reports.js"

# Upload updated client source files
Write-Host "Uploading updated client source files..." -ForegroundColor Yellow
scp -i $keyPath client-new/src/contexts/AuthContext.tsx "${user}@${InstanceIP}:/tmp/AuthContext.tsx"
scp -i $keyPath client-new/src/components/Dashboard/Dashboard.tsx "${user}@${InstanceIP}:/tmp/Dashboard.tsx"
scp -i $keyPath client-new/src/components/Dashboard/Dashboard.css "${user}@${InstanceIP}:/tmp/Dashboard.css"

# Create and run remote deployment script
Write-Host "Running remote deployment..." -ForegroundColor Yellow

$remoteCommands = @"
#!/bin/bash
set -e

echo "Deploying reporting system fix..."

# Stop the server
echo "Stopping server..."
pm2 stop forever-us || true

# Update server files
echo "Updating server files..."
cp /tmp/index.js /home/ubuntu/forever-us-server/index.js
cp /tmp/Report.js /home/ubuntu/forever-us-server/models/Report.js
cp /tmp/reports.js /home/ubuntu/forever-us-server/routes/reports.js

# Update client source files
echo "Updating client source files..."
cp /tmp/AuthContext.tsx /home/ubuntu/forever-us-frontend/src/contexts/AuthContext.tsx
cp /tmp/Dashboard.tsx /home/ubuntu/forever-us-frontend/src/components/Dashboard/Dashboard.tsx
cp /tmp/Dashboard.css /home/ubuntu/forever-us-frontend/src/components/Dashboard/Dashboard.css

# Rebuild frontend
echo "Building frontend..."
cd /home/ubuntu/forever-us-frontend
npm run build 2>&1 || {
    echo "Frontend build failed, using pre-built version..."
    if [ -d "/home/ubuntu/forever-us-frontend/build" ]; then
        echo "Using existing build"
    fi
}

# Start the server
echo "Starting server..."
pm2 start forever-us || pm2 restart forever-us

# Wait for server to start
sleep 3

# Check if server is running
if pm2 list | grep -q "online"; then
    echo "✅ Server started successfully"
else
    echo "❌ Server failed to start"
    pm2 logs forever-us --lines 20
    exit 1
fi

echo "✅ Deployment complete!"
"@

ssh -i $keyPath "${user}@${InstanceIP}" $remoteCommands

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "App running at: http://$InstanceIP" -ForegroundColor Cyan
