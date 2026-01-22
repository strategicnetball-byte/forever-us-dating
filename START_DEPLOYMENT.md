# 🚀 START HERE - Forever Us Deployment

## What Happened

The Forever Us app was 95% deployed in Session 11. The instance at 52.221.223.55 has network connectivity issues (SSH timeout, SSM Agent offline). Rather than troubleshoot, we're creating a new instance and redeploying.

**Good news**: Everything is ready. You just need to run the deployment script.

---

## What You Need to Do

### 3 Simple Steps (35 minutes total)

#### Step 1: Terminate Old Instance (2 minutes)
1. Go to https://console.aws.amazon.com
2. EC2 → Instances
3. Right-click instance 52.221.223.55
4. Instance State → Terminate
5. Confirm

#### Step 2: Create New Instance (5 minutes)
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

#### Step 3: Deploy (20 minutes)
1. Get new IP from AWS console
2. Open PowerShell
3. Run this command:
   ```powershell
   cd "E:\Forever Us"
   .\deploy-to-aws.ps1 -InstanceIP <NEW_IP>
   ```
   Replace `<NEW_IP>` with your new instance IP
4. Wait for completion (15-20 minutes)

---

## What Happens Next

The script will:
- Upload all source code
- Install Node.js, Nginx, PM2
- Install dependencies
- Build frontend
- Configure Nginx
- Start backend
- Connect to MongoDB

When done, you'll see:
```
✅ Deployment Complete!
🌐 App URL: http://<NEW_IP>
```

---

## Test the App

1. Open browser: `http://<NEW_IP>`
2. You should see the login page
3. Try to register a new account
4. Login
5. Upload a photo
6. Browse profiles

---

## Files Created

All documentation and scripts are in your project folder:

| File | Purpose |
|------|---------|
| `README_SESSION_12.md` | Overview |
| `SESSION_12_DEPLOYMENT_PLAN.md` | Complete plan |
| `REDEPLOY_INSTRUCTIONS.md` | Step-by-step guide |
| `REDEPLOY_CHECKLIST.md` | Track progress |
| `REDEPLOY_TROUBLESHOOTING.md` | Fix issues |
| `QUICK_REFERENCE.md` | Quick commands |
| `deploy-to-aws.ps1` | Run this script |
| `deploy.sh` | Runs on AWS |

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

## If Something Goes Wrong

1. Check logs: `pm2 logs forever-us`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Read `REDEPLOY_TROUBLESHOOTING.md`
4. SSH into instance and debug manually

---

## Cost

- **EC2 t2.micro**: Free for 12 months
- **MongoDB Atlas**: Free tier (512MB)
- **Total**: Free for 12 months

---

## Timeline

| Step | Time |
|------|------|
| Terminate old instance | 2 min |
| Create new instance | 5 min |
| Get IP and test SSH | 2 min |
| Run deployment script | 20 min |
| Verify deployment | 5 min |
| **Total** | **~35 min** |

---

## Ready?

1. Terminate old instance in AWS Console
2. Create new instance in AWS Console
3. Get new IP
4. Run: `.\deploy-to-aws.ps1 -InstanceIP <NEW_IP>`
5. Wait 20 minutes
6. Open `http://<NEW_IP>` in browser

**Let's go!**

---

## Need Help?

- **Overview**: Read `README_SESSION_12.md`
- **Detailed Steps**: Read `REDEPLOY_INSTRUCTIONS.md`
- **Track Progress**: Use `REDEPLOY_CHECKLIST.md`
- **Fix Issues**: Read `REDEPLOY_TROUBLESHOOTING.md`
- **Quick Commands**: See `QUICK_REFERENCE.md`

---

**Status**: ✅ Ready to Deploy
**Difficulty**: Easy (mostly automated)
**Estimated Time**: 35-40 minutes
**Risk**: Low (fresh instance, no data loss)

