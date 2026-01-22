# Forever Us - Quick Reference Card

## Deployment Quick Start

```powershell
# 1. Terminate old instance in AWS Console
# 2. Create new instance in AWS Console
# 3. Get new IP from AWS Console
# 4. Run this command:

cd "E:\Forever Us"
.\deploy-to-aws.ps1 -InstanceIP <NEW_IP>

# 5. Wait 20 minutes
# 6. Open http://<NEW_IP> in browser
```

---

## Key Commands

### SSH into Instance
```powershell
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<IP>
```

### Check Backend Status
```bash
pm2 status
pm2 logs forever-us
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Restart Backend
```bash
pm2 restart forever-us
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### View MongoDB Connection
```bash
pm2 logs forever-us | grep MongoDB
```

---

## Important Credentials

| Item | Value |
|------|-------|
| SSH Key | C:\Users\Chris Annesley\Downloads\Forever Us.pem |
| MongoDB User | strategicnetball_db_user |
| MongoDB Password | Faith@Miley2025 |
| MongoDB Cluster | cluster0.y2tnarx.mongodb.net |
| JWT Secret | forever-us-super-secret-jwt-key-2024 |

---

## AWS Information

| Item | Value |
|------|-------|
| Region | ap-southeast-1 |
| Instance Type | t2.micro |
| OS | Ubuntu 22.04 LTS |
| Backend Port | 3001 |
| Frontend Port | 80 |
| Old Instance | 52.221.223.55 (terminate) |
| New Instance IP | (will be provided) |

---

## File Locations

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `server/index.js` | Backend server |
| `client-new/build/` | Frontend static files |
| `/etc/nginx/sites-available/forever-us` | Nginx config |
| `~/.pm2/logs/forever-us-out.log` | Backend logs |

---

## Troubleshooting Quick Fixes

### App not loading
```bash
pm2 restart forever-us
sudo systemctl restart nginx
```

### Login not working
```bash
pm2 logs forever-us
# Check for MongoDB connection error
```

### Images not loading
```bash
pm2 restart forever-us
# Hard refresh: Ctrl+Shift+R
```

### API calls failing
```bash
sudo tail -f /var/log/nginx/error.log
pm2 logs forever-us
```

---

## Deployment Timeline

| Step | Time |
|------|------|
| Terminate old instance | 2 min |
| Create new instance | 5 min |
| SSH connection | 1 min |
| Deployment script | 20 min |
| Verify | 5 min |
| **Total** | **~35 min** |

---

## Success Indicators

✅ App loads at `http://<NEW_IP>`
✅ Backend logs show "Connected to MongoDB"
✅ Can register new account
✅ Can login
✅ Can upload photo
✅ Can browse profiles

---

## Files to Read

1. `REDEPLOY_INSTRUCTIONS.md` - Step-by-step guide
2. `REDEPLOY_CHECKLIST.md` - Track progress
3. `REDEPLOY_TROUBLESHOOTING.md` - Fix issues
4. `SESSION_12_DEPLOYMENT_PLAN.md` - Overview

---

## Common Issues

| Issue | Solution |
|-------|----------|
| SSH timeout | Wait 30 sec, try again |
| npm out of memory | Swap space created automatically |
| Backend not responding | `pm2 restart forever-us` |
| Frontend not loading | `sudo systemctl restart nginx` |
| MongoDB connection failed | Check `.env` and MongoDB Atlas |

---

## Useful Links

- AWS Console: https://console.aws.amazon.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- App URL: http://<NEW_IP>

---

## Emergency Commands

```bash
# Stop everything
pm2 stop forever-us
sudo systemctl stop nginx

# Start everything
pm2 start node --name "forever-us" -- server/index.js
sudo systemctl start nginx

# Check everything
pm2 status
sudo systemctl status nginx
```

---

## Deployment Script

```powershell
# Automated deployment (recommended)
.\deploy-to-aws.ps1 -InstanceIP <NEW_IP>

# Manual deployment (if script fails)
# See QUICK_REDEPLOY_SCRIPT.md for commands
```

---

## Monitoring

```bash
# Watch backend logs
pm2 logs forever-us --lines 50

# Watch Nginx logs
sudo tail -f /var/log/nginx/access.log

# Watch system resources
top
free -h
df -h
```

---

## Backup/Recovery

- **Code**: All in GitHub (or uploaded to AWS)
- **Database**: MongoDB Atlas (cloud backup)
- **Configuration**: `.env` file (backed up locally)

---

## Cost

- **EC2 t2.micro**: Free for 12 months
- **MongoDB Atlas**: Free tier (512MB)
- **Total**: Free for 12 months

---

## Support

1. Check logs: `pm2 logs forever-us`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Read troubleshooting guide
4. SSH and debug manually

---

## Next Steps

1. ✅ Terminate old instance
2. ✅ Create new instance
3. ✅ Run deployment script
4. ✅ Verify deployment
5. ✅ Test application
6. Monitor for errors
7. Plan next features

---

**Quick Reference Card**
**Forever Us Dating App**
**January 17, 2026**

