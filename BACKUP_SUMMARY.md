# Forever Us - Backup Summary
**Date**: January 21, 2026

## Backup Locations

### 1. Local Backup (E: Drive)
- **Path**: `E:\forever-us-backup-20260121-175157`
- **Contents**:
  - Server code (routes, models, middleware)
  - Client source code (src, public)
  - Configuration files (.env, package.json)
  - Deployment scripts
- **Size**: ~0.3 MB (excludes node_modules and build)
- **Purpose**: Quick restore of source code

### 2. EC2 Instance Backup
- **Location**: `/home/ubuntu/backups/forever-us-backup-20260121-*.tar.gz`
- **Contents**:
  - Server files and configuration
  - Frontend build files
  - Environment variables
- **Purpose**: Server-side recovery

### 3. MongoDB Atlas
- **Database**: ForeverUsDating
- **Connection**: `mongodb+srv://strategicnetball_db_user:FaithandMiley2025@foreverusdating.womclyt.mongodb.net/forever-us`
- **Data**: All user data, matches, messages, etc.
- **Backup**: Automatic daily backups via MongoDB Atlas

## Current Deployment Status

**Instance**: 18.141.201.176
- Frontend: http://18.141.201.176
- Backend: Port 3001 (via Nginx on port 80)
- Database: MongoDB Atlas (Connected ✅)

**Test User**:
- Email: test@example.com
- Password: test123
- Tier: VIP
- Points: 1000

**Dummy Users**: 10 female profiles (Emma, Sophia, Olivia, Ava, Isabella, Mia, Charlotte, Amelia, Harper, Evelyn)

## Restore Instructions

### From Local Backup
```powershell
# Copy backup to workspace
Copy-Item -Path "E:\forever-us-backup-20260121-175157\*" -Destination "." -Recurse -Force

# Install dependencies
npm install
cd client-new && npm install
```

### From EC2 Backup
```bash
# SSH into instance
ssh -i "forever-us-new.pem" ubuntu@18.141.201.176

# Extract backup
cd ~
tar -xzf backups/forever-us-backup-20260121-*.tar.gz
```

## Key Files

- `.env` - Environment variables (MongoDB URI, JWT secret, etc.)
- `server/index.js` - Backend entry point
- `client-new/src/App.tsx` - Frontend entry point
- `deploy-fresh.ps1` - Deployment script (PowerShell)
- `deploy-fresh.sh` - Deployment script (Bash)

## Important Notes

- **MongoDB Atlas**: Cluster is at `foreverusdating.womclyt.mongodb.net`
- **IP Whitelist**: 18.141.201.176 is whitelisted
- **Database User**: `strategicnetball_db_user` with password `FaithandMiley2025`
- **JWT Secret**: `forever-us-super-secret-jwt-key-2024`
- **AWS Key**: `forever-us-new.pem` (stored locally)

## Next Steps

1. Test all features (browse, matches, messages, profile)
2. Add photos to test user
3. Test payment/tier system
4. Deploy to production when ready
