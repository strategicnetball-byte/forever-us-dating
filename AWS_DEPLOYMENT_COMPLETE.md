# AWS Deployment Complete - Forever Us Dating App

## Status: ✅ DEPLOYED

Your Forever Us dating app is now deployed on AWS EC2 at: **http://52.221.223.55**

## What Was Done

### 1. Infrastructure Setup
- ✅ EC2 t2.micro instance created (Ubuntu 22.04)
- ✅ Node.js v20 installed
- ✅ Nginx installed and configured as reverse proxy
- ✅ Git installed for version control

### 2. Application Deployment
- ✅ Source code uploaded via SCP
- ✅ Backend dependencies installed (`npm install` in root)
- ✅ Frontend dependencies installed (`npm install` in client-new)
- ✅ Frontend built (`npm run build`)
- ✅ Backend running on port 3001 via PM2
- ✅ Frontend served via Nginx on port 80

### 3. Code Updates for AWS
- ✅ Created `client-new/src/utils/api.ts` - Dynamic API URL utility
- ✅ Updated all components to use dynamic URLs
- ✅ Updated backend CORS to accept AWS IP
- ✅ Updated `.env` with AWS IP configuration

### 4. File Permissions Fixed
- ✅ Fixed Nginx access to build folder
- ✅ Set correct permissions on all directories

## Current Architecture

```
Browser (http://52.221.223.55)
         ↓
    Nginx (Port 80)
         ↓
    Backend (Port 3001)
         ↓
    API Routes & Socket.io
```

## Services Running

### Backend (PM2)
```bash
pm2 status
# Shows: forever-us process running on port 3001
```

### Frontend (Nginx)
```bash
sudo systemctl status nginx
# Shows: nginx running, serving static files from /home/ubuntu/client-new/build
```

## Testing the Deployment

### From AWS Instance
```bash
# Test Nginx locally
curl http://localhost

# Check backend
curl http://localhost:3001/api/auth/me

# View logs
pm2 logs forever-us
sudo tail -f /var/log/nginx/access.log
```

### From Browser
Open: http://52.221.223.55

Expected: Login page loads with register/login forms

## If Page Doesn't Load

### Issue 1: Blank Page / Timeout
**Cause:** Network connectivity between your machine and AWS
**Solution:**
1. Check AWS Security Group allows HTTP (port 80)
2. Check AWS instance is running
3. Try accessing from different network
4. Check browser console (F12) for errors

### Issue 2: 500 Error
**Cause:** Nginx or backend issue
**Solution:**
```bash
# Check Nginx errors
sudo tail -50 /var/log/nginx/error.log

# Check backend
pm2 logs forever-us

# Restart services
sudo systemctl restart nginx
pm2 restart forever-us
```

### Issue 3: API Calls Fail
**Cause:** Backend not responding or CORS issue
**Solution:**
```bash
# Test backend directly
curl http://localhost:3001/api/auth/me

# Check backend is running
pm2 status

# Restart if needed
pm2 restart forever-us
```

## Key Files on AWS

```
/home/ubuntu/
├── server/                    # Backend code
│   ├── index.js              # Main server file
│   ├── routes/               # API routes
│   └── models/               # Database models
├── client-new/
│   ├── build/                # Built frontend (served by Nginx)
│   ├── src/                  # Frontend source
│   └── package.json
├── .env                      # Environment variables
└── uploads/                  # User uploaded photos
```

## Environment Variables (.env)

```
MONGODB_URI=mongodb://localhost:27017/forever-us
JWT_SECRET=forever-us-super-secret-jwt-key-2024
PORT=3001
CLIENT_URL=http://52.221.223.55
```

## Nginx Configuration

Location: `/etc/nginx/sites-available/forever-us`

- Serves static files from `/home/ubuntu/client-new/build`
- Proxies `/api` requests to `localhost:3001`
- Proxies `/socket.io` to `localhost:3001`

## PM2 Configuration

Backend is managed by PM2:
```bash
pm2 start node --name "forever-us" -- server/index.js
pm2 save
```

To restart:
```bash
pm2 restart forever-us
```

## Next Steps

### 1. Test Core Features
- [ ] Register new account
- [ ] Login
- [ ] Upload profile photo
- [ ] Browse profiles
- [ ] Like/match profiles
- [ ] Send messages

### 2. Monitor Logs
```bash
# Backend logs
pm2 logs forever-us

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### 3. Optional: Add MongoDB
Currently running without database. To add MongoDB:
```bash
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Optional: Add SSL/HTTPS
Use Let's Encrypt with Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 52.221.223.55
```

### 5. Optional: Custom Domain
Update DNS records to point to 52.221.223.55, then update Nginx config

## Troubleshooting Commands

```bash
# SSH into instance
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@52.221.223.55

# Check if services are running
pm2 status
sudo systemctl status nginx

# Restart services
pm2 restart forever-us
sudo systemctl restart nginx

# View logs
pm2 logs forever-us
sudo tail -f /var/log/nginx/error.log

# Test connectivity
curl http://localhost
curl http://localhost:3001/api/auth/me

# Check file permissions
ls -la /home/ubuntu/client-new/build/
```

## Important Notes

1. **No Database**: App runs without MongoDB. Data is not persisted between restarts.
2. **Free Tier**: AWS free tier covers this for 12 months (~$10/month after)
3. **Swap Space**: 2GB swap created for npm build on t2.micro
4. **Dynamic URLs**: Frontend automatically uses correct API URL based on hostname

## Cost Estimate

- **EC2 t2.micro**: Free for 12 months, then ~$10/month
- **Data Transfer**: Free for first 1GB/month outbound
- **Total**: Free for 12 months, then ~$10-15/month

## Support

If you encounter issues:
1. Check the logs (see Troubleshooting Commands above)
2. Verify services are running (`pm2 status`, `sudo systemctl status nginx`)
3. Test connectivity (`curl http://localhost`)
4. Check file permissions (`ls -la /home/ubuntu/client-new/build/`)
