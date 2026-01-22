# Forever Us - AWS Deployment Helper Script
# Run this from your local machine (PowerShell)

param(
    [Parameter(Mandatory=$true)]
    [string]$InstanceIP,
    
    [Parameter(Mandatory=$false)]
    [string]$KeyPath = "C:\Users\Chris Annesley\Downloads\Forever Us.pem"
)

$ErrorActionPreference = "Stop"

function Write-Status {
    param([string]$Message)
    Write-Host "[*] $Message"
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message"
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[ERROR] $Message"
}

# Verify key file exists
if (-not (Test-Path $KeyPath)) {
    Write-ErrorMsg "SSH key not found at: $KeyPath"
    exit 1
}

Write-Status "Deploying Forever Us to AWS Instance: $InstanceIP"
Write-Status "SSH Key: $KeyPath"
Write-Status ""

# Step 1: Upload source code
Write-Status "Uploading source code..."
scp -i $KeyPath -o StrictHostKeyChecking=no -r server ubuntu@${InstanceIP}:~/
Write-Success "Uploaded server/"

scp -i $KeyPath -o StrictHostKeyChecking=no -r client-new ubuntu@${InstanceIP}:~/
Write-Success "Uploaded client-new/"

scp -i $KeyPath -o StrictHostKeyChecking=no package.json ubuntu@${InstanceIP}:~/
Write-Success "Uploaded package.json"

scp -i $KeyPath -o StrictHostKeyChecking=no package-lock.json ubuntu@${InstanceIP}:~/
Write-Success "Uploaded package-lock.json"

# Step 2: Upload deployment script
Write-Status "Uploading deployment script..."
scp -i $KeyPath -o StrictHostKeyChecking=no deploy.sh ubuntu@${InstanceIP}:~/
Write-Success "Uploaded deploy.sh"

# Step 3: Execute deployment script
Write-Status "Executing deployment script on instance..."
Write-Status "This will take 15-20 minutes. Please wait..."
Write-Status ""

ssh -i $KeyPath -o StrictHostKeyChecking=no ubuntu@${InstanceIP} "chmod +x ~/deploy.sh; ~/deploy.sh"

Write-Success "Deployment Complete!"
Write-Host ""
Write-Host "=========================================="
Write-Host "Forever Us is now live!"
Write-Host "=========================================="
Write-Host ""
Write-Host "App URL: http://$InstanceIP"
Write-Host "Backend: http://$InstanceIP/api"
Write-Host "SSH: ssh -i `"$KeyPath`" ubuntu@$InstanceIP"
Write-Host ""
Write-Host "Next Steps:"
Write-Host "1. Open http://$InstanceIP in your browser"
Write-Host "2. Register a new account"
Write-Host "3. Login and test features"
Write-Host ""

