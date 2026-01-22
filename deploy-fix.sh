#!/bin/bash
# Forever Us - Deploy Reporting System Fix
# Deploys updated Dashboard and AuthContext with report button styling

INSTANCE_IP="${1:-18.141.201.176}"
KEY_PATH="C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
USER="ubuntu"

echo "Deploying Reporting System Fix to $INSTANCE_IP"
echo ""

# Upload updated server files
echo "Uploading updated server files..."
scp -i "$KEY_PATH" server/index.js "${USER}@${INSTANCE_IP}:/tmp/index.js"
scp -i "$KEY_PATH" server/models/Report.js "${USER}@${INSTANCE_IP}:/tmp/Report.js"
scp -i "$KEY_PATH" server/routes/reports.js "${USER}@${INSTANCE_IP}:/tmp/reports.js"

# Upload updated client source files
echo "Uploading updated client source files..."
scp -i "$KEY_PATH" client-new/src/contexts/AuthContext.tsx "${USER}@${INSTANCE_IP}:/tmp/AuthContext.tsx"
scp -i "$KEY_PATH" client-new/src/components/Dashboard/Dashboard.tsx "${USER}@${INSTANCE_IP}:/tmp/Dashboard.tsx"
scp -i "$KEY_PATH" client-new/src/components/Dashboard/Dashboard.css "${USER}@${INSTANCE_IP}:/tmp/Dashboard.css"

# Run remote deployment
echo "Running remote deployment..."
ssh -i "$KEY_PATH" "${USER}@${INSTANCE_IP}" << 'REMOTE_SCRIPT'
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
    # Copy pre-built if available
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
REMOTE_SCRIPT

echo ""
echo "Deployment complete!"
echo "App running at: http://$INSTANCE_IP"
