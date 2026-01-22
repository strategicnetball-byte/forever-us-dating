# AWS Deployment Fix - Session 11 Continuation

## Problem
The browser times out when accessing http://52.221.223.55 because:
1. Backend CORS was hardcoded to only accept localhost origins
2. Frontend was hardcoded to make API calls to localhost:3001
3. Image URLs were hardcoded to localhost:3001

## Solution Applied
1. Updated `.env` to set `CLIENT_URL=http://52.221.223.55`
2. Updated `server/index.js` to dynamically accept AWS IP in CORS
3. Created `client-new/src/utils/api.ts` utility for dynamic API base URL
4. Updated all frontend components to use dynamic URLs based on current hostname
5. Updated all image URLs to use the `getImageUrl()` utility

## Steps to Deploy on AWS

### 1. SSH into your AWS instance
```bash
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@52.221.223.55
```

### 2. Navigate to the project directory
```bash
cd ~
```

### 3. Pull the latest changes (if using git) or verify files are updated
The following files have been updated locally:
- `.env` - CLIENT_URL changed to AWS IP
- `server/index.js` - CORS updated for AWS IP
- `client-new/src/utils/api.ts` - NEW utility file
- `client-new/src/contexts/AuthContext.tsx` - Uses new utility
- `client-new/src/components/Auth/PasswordReset.tsx` - Uses new utility
- `client-new/src/components/Profile/Profile.tsx` - Uses new utility
- `client-new/src/components/Dashboard/Dashboard.tsx` - Uses new utility
- `client-new/src/components/Messages/Messages.tsx` - Uses new utility
- `client-new/src/components/Likes/Likes.tsx` - Uses new utility
- `client-new/src/components/Browse/Browse.tsx` - Uses new utility
- `client-new/src/components/Matches/Matches.tsx` - Uses new utility
- `client-new/src/components/Compatibility/CompatibilityMatches.tsx` - Uses new utility

### 4. Stop the current backend process
```bash
pm2 delete forever-us
```

### 5. Rebuild the frontend
```bash
cd ~/client-new
npm run build
```
This will take 2-3 minutes on t2.micro. If you get memory errors, the swap space should handle it.

### 6. Restart the backend
```bash
cd ~
pm2 start node --name "forever-us" -- server/index.js
pm2 save
```

### 7. Verify backend is running
```bash
pm2 logs forever-us
```
You should see: `Server running on port 3001`

### 8. Check Nginx is still running
```bash
sudo systemctl status nginx
```

### 9. Test the deployment
Open your browser and go to: http://52.221.223.55

You should see the login page. Try:
- Registering a new account
- Logging in
- Uploading a photo
- Browsing profiles

## Troubleshooting

### If you still get timeout:
1. Check Nginx access logs: `sudo tail -f /var/log/nginx/access.log`
2. Check backend logs: `pm2 logs forever-us`
3. Test locally on server: `curl http://localhost`
4. Check security group allows HTTP on port 80

### If build fails with memory error:
The swap space should handle it, but if not:
```bash
# Check swap
free -h
# If needed, create more swap (requires sudo)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### If images don't load:
1. Check that photos exist: `ls -la ~/uploads/photos/`
2. Verify Nginx is serving uploads: Check `/etc/nginx/sites-available/forever-us` has the uploads location block
3. Check browser console for 404 errors

## Next Steps After Deployment
1. Test all core features (register, login, browse, like, match, message)
2. Test photo uploads
3. Test rewards system
4. Test membership features
5. Once stable, consider adding MongoDB for persistent data
