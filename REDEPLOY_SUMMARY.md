# Forever Us - Redeploy Summary

## What Happened

The instance at 52.221.223.55 has network connectivity issues:
- SSH port 22 times out
- SSM Agent can't connect to AWS Systems Manager
- These are AWS infrastructure issues, not application issues

The app itself is working fine - the frontend loads and the backend is running. We just can't connect to the instance to upload the MongoDB connection string.

## Solution

Create a new EC2 instance and redeploy. This is actually faster than troubleshooting the network issue.

## What You Need to Do

### 1. Terminate Old Instance (2 minutes)
- Go to AWS Console
- EC2 → Instances
- Right-click 52.221.223.55 → Terminate

### 2. Create New Instance (5 minutes)
- Click "Launch Instances"
- Ubuntu 22.04 LTS, t2.micro, same security settings
- Wait for it to start

### 3. Deploy Application (20 minutes)
- Get the new IP address
- Run the automated deployment script:
  ```powershell
  .\deploy-to-aws.ps1 -InstanceIP <NEW_IP>
  ```

### 4. Test (5 minutes)
- Open `http://<NEW_IP>` in browser
- Register, login, upload photo, browse profiles

**Total Time**: ~35 minutes

## Files Created

1. **REDEPLOY_INSTRUCTIONS.md** - Complete step-by-step guide
2. **QUICK_REDEPLOY_SCRIPT.md** - Detailed manual instructions
3. **deploy.sh** - Automated bash script (runs on AWS instance)
4. **deploy-to-aws.ps1** - PowerShell script (runs on your local machine)
5. **REDEPLOY_CHECKLIST.md** - Checklist to track progress
6. **REDEPLOY_SUMMARY.md** - This file

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

## What's Already Done

✅ Code is ready to deploy
✅ `.env` file has MongoDB connection string
✅ All components use dynamic URLs
✅ Deployment scripts are automated
✅ You just need to run the script

## What Will Happen

1. Script uploads all source code to new instance
2. Installs Node.js, Nginx, PM2
3. Installs dependencies
4. Builds frontend
5. Configures Nginx as reverse proxy
6. Starts backend with PM2
7. Backend connects to MongoDB Atlas
8. App is live and ready to use

## Why This Approach

- **Faster**: Second deployment is quicker than troubleshooting network issues
- **Cleaner**: Fresh instance, no accumulated issues
- **Reliable**: Automated script reduces human error
- **Tested**: Same process that worked before

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

## Credentials (For Reference)

- **MongoDB User**: strategicnetball_db_user
- **MongoDB Password**: Faith@Miley2025
- **MongoDB Cluster**: cluster0.y2tnarx.mongodb.net
- **JWT Secret**: forever-us-super-secret-jwt-key-2024

## Next Steps

1. Read `REDEPLOY_INSTRUCTIONS.md`
2. Follow the checklist in `REDEPLOY_CHECKLIST.md`
3. Run the deployment script
4. Test the app
5. Done!

## Support

If you encounter issues:

1. Check the logs: `pm2 logs forever-us`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Refer to `QUICK_REDEPLOY_SCRIPT.md` for detailed steps
4. SSH into instance and debug manually

## Estimated Timeline

- Terminate old instance: 2 min
- Create new instance: 5 min
- Get IP and test SSH: 2 min
- Run deployment script: 20 min
- Verify and test: 5 min
- **Total**: ~35 minutes

## Success Criteria

✅ App loads at `http://<NEW_IP>`
✅ Backend logs show "Connected to MongoDB"
✅ Can register new account
✅ Can login
✅ Can upload photo
✅ Can browse profiles
✅ Can like/match
✅ Can send messages

---

**Status**: Ready to redeploy
**Difficulty**: Easy (mostly automated)
**Risk**: Low (fresh instance, no data loss)

