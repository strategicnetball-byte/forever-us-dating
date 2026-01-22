# Session 12 - Forever Us AWS Deployment Plan

## Current Status

**Previous Session (Session 11)**: 95% complete
- ✅ App deployed to AWS (52.221.223.55)
- ✅ Frontend loads and renders
- ✅ Backend running on port 3001
- ✅ Nginx configured as reverse proxy
- ✅ Code updated for dynamic URLs
- ❌ SSH connection times out (network issue)
- ❌ MongoDB not yet connected

**Current Issue**: Instance 52.221.223.55 has network connectivity problems
- SSH port 22 times out
- SSM Agent offline
- These are AWS infrastructure issues, not application issues

**Decision**: Terminate old instance and create new one (faster than troubleshooting)

---

## What You Need to Do

### Phase 1: Terminate Old Instance (2 minutes)

1. Go to AWS Console: https://console.aws.amazon.com
2. EC2 → Instances
3. Right-click instance 52.221.223.55
4. Instance State → Terminate
5. Confirm termination
6. Wait for termination to complete

### Phase 2: Create New Instance (5 minutes)

1. Click "Launch Instances"
2. **Name**: Forever Us
3. **AMI**: Ubuntu 22.04 LTS
4. **Instance Type**: t2.micro
5. **Key Pair**: Forever Us (existing)
6. **Security Group**: Create new
   - Name: forever-us-sg
   - Inbound Rules:
     - SSH (22): 0.0.0.0/0
     - HTTP (80): 0.0.0.0/0
     - HTTPS (443): 0.0.0.0/0
7. **Storage**: 20 GB
8. Click "Launch Instance"
9. Wait 2-3 minutes for instance to start

### Phase 3: Deploy Application (20 minutes)

1. Get new IP from AWS console
2. Test SSH connection:
   ```powershell
   ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<NEW_IP>
   ```
3. Run deployment script:
   ```powershell
   cd "E:\Forever Us"
   .\deploy-to-aws.ps1 -InstanceIP <NEW_IP>
   ```
4. Wait for completion (15-20 minutes)

### Phase 4: Verify Deployment (5 minutes)

1. Check backend logs:
   ```bash
   pm2 logs forever-us
   ```
   Should show: "✅ Connected to MongoDB"

2. Open browser: `http://<NEW_IP>`
   Should see login page

3. Test features:
   - Register new account
   - Login
   - Upload photo
   - Browse profiles

---

## Files Created for This Session

| File | Purpose |
|------|---------|
| `REDEPLOY_INSTRUCTIONS.md` | Complete step-by-step guide |
| `QUICK_REDEPLOY_SCRIPT.md` | Detailed manual instructions |
| `deploy.sh` | Automated bash script for AWS instance |
| `deploy-to-aws.ps1` | PowerShell script for local machine |
| `REDEPLOY_CHECKLIST.md` | Checklist to track progress |
| `REDEPLOY_SUMMARY.md` | Overview of redeploy process |
| `REDEPLOY_TROUBLESHOOTING.md` | Troubleshooting guide |
| `SESSION_12_DEPLOYMENT_PLAN.md` | This file |

---

## Quick Start

```powershell
# 1. Terminate old instance in AWS Console

# 2. Create new instance in AWS Console

# 3. Get new IP from AWS Console

# 4. Run deployment script
cd "E:\Forever Us"
.\deploy-to-aws.ps1 -InstanceIP <NEW_IP>

# 5. Wait 20 minutes

# 6. Open http://<NEW_IP> in browser
```

---

## Timeline

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Terminate old instance | 2 min | ⏳ |
| 2 | Create new instance | 5 min | ⏳ |
| 2 | Get IP and test SSH | 2 min | ⏳ |
| 3 | Run deployment script | 20 min | ⏳ |
| 4 | Verify deployment | 5 min | ⏳ |
| 4 | Test application | 5 min | ⏳ |
| **Total** | | **~40 min** | ⏳ |

---

## Key Information

| Item | Value |
|------|-------|
| Old Instance | 52.221.223.55 (terminate) |
| New Instance IP | (will be provided by AWS) |
| SSH Key | C:\Users\Chris Annesley\Downloads\Forever Us.pem |
| Region | ap-southeast-1 |
| Instance Type | t2.micro (free tier) |
| Backend Port | 3001 |
| Frontend Port | 80 |
| MongoDB | Already configured |

---

## What's Already Done

✅ Code is ready to deploy
✅ `.env` file has MongoDB connection string
✅ All components use dynamic URLs
✅ Deployment scripts are automated
✅ Troubleshooting guide created
✅ Checklist created

**You just need to run the script!**

---

## Success Criteria

After deployment, verify:

- [ ] App loads at `http://<NEW_IP>`
- [ ] Backend logs show "Connected to MongoDB"
- [ ] Can register new account
- [ ] Can login
- [ ] Can upload photo
- [ ] Can browse profiles
- [ ] Can like/match
- [ ] Can send messages
- [ ] No errors in logs

---

## If Something Goes Wrong

1. Check logs: `pm2 logs forever-us`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Refer to `REDEPLOY_TROUBLESHOOTING.md`
4. SSH into instance and debug manually

---

## Next Steps After Deployment

1. ✅ App is live
2. Test all features
3. Monitor logs for errors
4. Update DNS if using custom domain
5. Consider setting up monitoring/alerts
6. Plan for scaling if needed

---

## Important Notes

- **No data loss**: Old instance is being terminated, but no user data is stored there yet (MongoDB is in the cloud)
- **Fresh start**: New instance will be clean and ready
- **Same code**: All code is identical, just new infrastructure
- **Faster**: Second deployment is quicker than troubleshooting

---

## Support

If you need help:

1. Read `REDEPLOY_INSTRUCTIONS.md` first
2. Follow `REDEPLOY_CHECKLIST.md` to track progress
3. Use `REDEPLOY_TROUBLESHOOTING.md` if issues arise
4. SSH into instance and debug manually if needed

---

## Estimated Cost

- **EC2 t2.micro**: Free for 12 months (then ~$10/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: Free for 12 months

---

## Architecture

```
Browser (http://<NEW_IP>)
    ↓
Nginx (Port 80)
    ↓
Backend (Port 3001)
    ↓
MongoDB Atlas (Cloud)
```

---

## Deployment Checklist

- [ ] Read this file
- [ ] Read `REDEPLOY_INSTRUCTIONS.md`
- [ ] Terminate old instance
- [ ] Create new instance
- [ ] Get new IP
- [ ] Test SSH
- [ ] Run deployment script
- [ ] Verify deployment
- [ ] Test application
- [ ] Update documentation

---

## Files to Reference

1. **REDEPLOY_INSTRUCTIONS.md** - Start here for step-by-step guide
2. **REDEPLOY_CHECKLIST.md** - Use this to track progress
3. **deploy-to-aws.ps1** - Run this script for automated deployment
4. **REDEPLOY_TROUBLESHOOTING.md** - Use if issues arise
5. **QUICK_REDEPLOY_SCRIPT.md** - Reference for manual steps

---

## Summary

The deployment is straightforward:

1. Terminate old instance (2 min)
2. Create new instance (5 min)
3. Run deployment script (20 min)
4. Verify and test (5 min)

**Total time**: ~35 minutes

The script handles all the complex parts. You just need to:
1. Click buttons in AWS Console
2. Run one PowerShell command
3. Wait for completion
4. Test the app

---

**Status**: Ready to deploy
**Difficulty**: Easy (mostly automated)
**Risk**: Low (fresh instance, no data loss)
**Estimated Time**: 35-40 minutes

---

## Next Session

Once deployment is complete:

1. Monitor app for errors
2. Test all features thoroughly
3. Consider additional features or improvements
4. Plan for production deployment if needed
5. Set up monitoring and alerts

---

**Created**: January 17, 2026
**Session**: 12
**Status**: Ready for execution

