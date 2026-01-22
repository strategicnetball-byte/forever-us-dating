# Session 12 - Forever Us Deployment Preparation

## Overview

The Forever Us dating app was 95% deployed in Session 11. The instance at 52.221.223.55 has network connectivity issues (SSH timeout, SSM Agent offline). Rather than troubleshoot, we're creating a new instance and redeploying.

**Good news**: Everything is ready to go. You just need to run the deployment script.

---

## What's Been Prepared

### Documentation Files

1. **SESSION_12_DEPLOYMENT_PLAN.md** ← **START HERE**
   - Overview of what needs to be done
   - Timeline and checklist
   - Key information

2. **REDEPLOY_INSTRUCTIONS.md**
   - Complete step-by-step guide
   - Both automated and manual options
   - Detailed explanations

3. **REDEPLOY_CHECKLIST.md**
   - Checkbox list to track progress
   - Time tracking
   - Success criteria

4. **REDEPLOY_TROUBLESHOOTING.md**
   - Common issues and solutions
   - Quick fixes
   - Emergency commands

5. **QUICK_REDEPLOY_SCRIPT.md**
   - Detailed manual instructions
   - All commands explained
   - Reference for each step

6. **QUICK_REFERENCE.md**
   - One-page quick reference
   - Key commands
   - Important credentials

### Automation Scripts

1. **deploy-to-aws.ps1** (PowerShell)
   - Runs on your local machine
   - Uploads source code
   - Executes deployment on AWS
   - Displays results

2. **deploy.sh** (Bash)
   - Runs on AWS instance
   - Installs all dependencies
   - Builds frontend
   - Configures Nginx
   - Starts backend

---

## Quick Start (3 Steps)

### Step 1: Terminate Old Instance (2 minutes)
```
AWS Console → EC2 → Instances → Right-click 52.221.223.55 → Terminate
```

### Step 2: Create New Instance (5 minutes)
```
AWS Console → Launch Instances → Ubuntu 22.04 LTS, t2.micro, same security settings
```

### Step 3: Deploy (20 minutes)
```powershell
cd "E:\Forever Us"
.\deploy-to-aws.ps1 -InstanceIP <NEW_IP>
```

**Total time**: ~35 minutes

---

## What Each File Does

### For Planning
- `SESSION_12_DEPLOYMENT_PLAN.md` - Read this first
- `REDEPLOY_SUMMARY.md` - Overview of the process

### For Execution
- `REDEPLOY_INSTRUCTIONS.md` - Step-by-step guide
- `deploy-to-aws.ps1` - Run this script
- `deploy.sh` - Runs automatically on AWS

### For Tracking
- `REDEPLOY_CHECKLIST.md` - Check off each step

### For Troubleshooting
- `REDEPLOY_TROUBLESHOOTING.md` - Fix issues
- `QUICK_REFERENCE.md` - Quick commands

---

## Reading Order

1. **This file** (you're reading it)
2. **SESSION_12_DEPLOYMENT_PLAN.md** (overview)
3. **REDEPLOY_INSTRUCTIONS.md** (detailed steps)
4. **REDEPLOY_CHECKLIST.md** (track progress)
5. **REDEPLOY_TROUBLESHOOTING.md** (if issues arise)

---

## What's Already Done

✅ Code is ready to deploy
✅ `.env` file has MongoDB connection string
✅ All components use dynamic URLs
✅ Deployment scripts are automated
✅ Documentation is complete
✅ Troubleshooting guide is ready

**You just need to:**
1. Click buttons in AWS Console
2. Run one PowerShell command
3. Wait for completion
4. Test the app

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

## Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Terminate old instance | 2 min |
| 2 | Create new instance | 5 min |
| 2 | Get IP and test SSH | 2 min |
| 3 | Run deployment script | 20 min |
| 4 | Verify deployment | 5 min |
| **Total** | | **~35 min** |

---

## Success Criteria

After deployment, you should see:

✅ App loads at `http://<NEW_IP>`
✅ Backend logs show "Connected to MongoDB"
✅ Can register new account
✅ Can login
✅ Can upload photo
✅ Can browse profiles
✅ Can like/match
✅ Can send messages

---

## If Something Goes Wrong

1. Check logs: `pm2 logs forever-us`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Read `REDEPLOY_TROUBLESHOOTING.md`
4. SSH into instance and debug manually

---

## Files in This Session

```
SESSION_12_DEPLOYMENT_PLAN.md          ← Start here
REDEPLOY_INSTRUCTIONS.md               ← Detailed guide
REDEPLOY_CHECKLIST.md                  ← Track progress
REDEPLOY_TROUBLESHOOTING.md            ← Fix issues
QUICK_REDEPLOY_SCRIPT.md               ← Manual steps
QUICK_REFERENCE.md                     ← Quick commands
README_SESSION_12.md                   ← This file
deploy-to-aws.ps1                      ← Run this script
deploy.sh                              ← Runs on AWS
```

---

## Next Steps

1. Read `SESSION_12_DEPLOYMENT_PLAN.md`
2. Follow `REDEPLOY_INSTRUCTIONS.md`
3. Use `REDEPLOY_CHECKLIST.md` to track progress
4. Run `deploy-to-aws.ps1` when ready
5. Verify deployment
6. Test application

---

## Important Notes

- **No data loss**: Old instance is being terminated, but no user data is stored there yet
- **Fresh start**: New instance will be clean and ready
- **Same code**: All code is identical, just new infrastructure
- **Faster**: Second deployment is quicker than troubleshooting
- **Automated**: Script handles all complex parts

---

## Support

If you need help:

1. Read the relevant documentation file
2. Check `REDEPLOY_TROUBLESHOOTING.md`
3. SSH into instance and debug manually
4. Check logs: `pm2 logs forever-us`

---

## Cost

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
- [ ] Read SESSION_12_DEPLOYMENT_PLAN.md
- [ ] Read REDEPLOY_INSTRUCTIONS.md
- [ ] Terminate old instance
- [ ] Create new instance
- [ ] Get new IP
- [ ] Test SSH
- [ ] Run deployment script
- [ ] Verify deployment
- [ ] Test application

---

## Summary

Everything is ready. The deployment process is:

1. **Terminate** old instance (2 min)
2. **Create** new instance (5 min)
3. **Deploy** with script (20 min)
4. **Verify** and test (5 min)

**Total**: ~35 minutes

The script handles all the complex parts. You just need to click buttons and run one command.

---

## Ready to Deploy?

1. Open `SESSION_12_DEPLOYMENT_PLAN.md`
2. Follow the instructions
3. Run the deployment script
4. Test the app

**Let's go!**

---

**Created**: January 17, 2026
**Session**: 12
**Status**: Ready for execution
**Estimated Time**: 35-40 minutes

