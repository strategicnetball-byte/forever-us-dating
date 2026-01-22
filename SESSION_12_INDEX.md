# Session 12 - Complete File Index

## 📋 Documentation Files Created

### Getting Started
- **README_SESSION_12.md** - Overview and quick start guide
- **SESSION_12_DEPLOYMENT_PLAN.md** - Complete deployment plan with timeline

### Step-by-Step Guides
- **REDEPLOY_INSTRUCTIONS.md** - Detailed step-by-step instructions (both automated and manual)
- **QUICK_REDEPLOY_SCRIPT.md** - Detailed manual commands with explanations

### Tracking & Reference
- **REDEPLOY_CHECKLIST.md** - Checkbox list to track progress
- **QUICK_REFERENCE.md** - One-page quick reference card
- **REDEPLOY_SUMMARY.md** - Summary of the redeploy process

### Troubleshooting
- **REDEPLOY_TROUBLESHOOTING.md** - Common issues and solutions

---

## 🚀 Automation Scripts

### PowerShell (Local Machine)
- **deploy-to-aws.ps1** - Automated deployment script
  - Uploads source code
  - Executes deployment on AWS
  - Displays results

### Bash (AWS Instance)
- **deploy.sh** - Automated setup script
  - Installs dependencies
  - Builds frontend
  - Configures Nginx
  - Starts backend

---

## 📖 Reading Guide

### For First-Time Users
1. **README_SESSION_12.md** - Start here
2. **SESSION_12_DEPLOYMENT_PLAN.md** - Understand the plan
3. **REDEPLOY_INSTRUCTIONS.md** - Follow the steps

### For Execution
1. **REDEPLOY_CHECKLIST.md** - Track progress
2. **deploy-to-aws.ps1** - Run the script
3. **QUICK_REFERENCE.md** - Quick commands

### For Troubleshooting
1. **REDEPLOY_TROUBLESHOOTING.md** - Fix issues
2. **QUICK_REFERENCE.md** - Quick fixes
3. **QUICK_REDEPLOY_SCRIPT.md** - Manual debugging

---

## 🎯 Quick Start

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

## 📊 File Purposes

| File | Purpose | Read Time |
|------|---------|-----------|
| README_SESSION_12.md | Overview and quick start | 5 min |
| SESSION_12_DEPLOYMENT_PLAN.md | Complete plan with timeline | 10 min |
| REDEPLOY_INSTRUCTIONS.md | Step-by-step guide | 15 min |
| REDEPLOY_CHECKLIST.md | Track progress | 5 min |
| QUICK_REFERENCE.md | Quick commands | 2 min |
| REDEPLOY_TROUBLESHOOTING.md | Fix issues | 10 min |
| QUICK_REDEPLOY_SCRIPT.md | Manual commands | 15 min |
| REDEPLOY_SUMMARY.md | Process overview | 5 min |
| deploy-to-aws.ps1 | Run this script | - |
| deploy.sh | Runs on AWS | - |

---

## 🔑 Key Information

| Item | Value |
|------|-------|
| Old Instance | 52.221.223.55 (terminate) |
| New Instance IP | (will be provided by AWS) |
| SSH Key | C:\Users\Chris Annesley\Downloads\Forever Us.pem |
| Region | ap-southeast-1 |
| Instance Type | t2.micro |
| Backend Port | 3001 |
| Frontend Port | 80 |
| MongoDB | Already configured |

---

## ⏱️ Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Terminate old instance | 2 min |
| 2 | Create new instance | 5 min |
| 2 | Get IP and test SSH | 2 min |
| 3 | Run deployment script | 20 min |
| 4 | Verify deployment | 5 min |
| **Total** | | **~35 min** |

---

## ✅ Success Criteria

After deployment:

- [ ] App loads at `http://<NEW_IP>`
- [ ] Backend logs show "Connected to MongoDB"
- [ ] Can register new account
- [ ] Can login
- [ ] Can upload photo
- [ ] Can browse profiles
- [ ] Can like/match
- [ ] Can send messages

---

## 🛠️ Common Commands

### SSH into Instance
```powershell
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<IP>
```

### Check Backend
```bash
pm2 status
pm2 logs forever-us
```

### Check Nginx
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
pm2 restart forever-us
sudo systemctl restart nginx
```

---

## 📁 File Organization

```
Forever Us/
├── README_SESSION_12.md              ← Start here
├── SESSION_12_DEPLOYMENT_PLAN.md     ← Overview
├── SESSION_12_INDEX.md               ← This file
├── REDEPLOY_INSTRUCTIONS.md          ← Detailed guide
├── REDEPLOY_CHECKLIST.md             ← Track progress
├── REDEPLOY_SUMMARY.md               ← Summary
├── REDEPLOY_TROUBLESHOOTING.md       ← Fix issues
├── QUICK_REDEPLOY_SCRIPT.md          ← Manual steps
├── QUICK_REFERENCE.md                ← Quick commands
├── deploy-to-aws.ps1                 ← Run this
├── deploy.sh                         ← Runs on AWS
└── [other project files]
```

---

## 🚀 Deployment Steps

### Step 1: Prepare (5 minutes)
- [ ] Read README_SESSION_12.md
- [ ] Read SESSION_12_DEPLOYMENT_PLAN.md
- [ ] Have AWS console open

### Step 2: Terminate Old Instance (2 minutes)
- [ ] Go to AWS Console
- [ ] EC2 → Instances
- [ ] Right-click 52.221.223.55 → Terminate

### Step 3: Create New Instance (5 minutes)
- [ ] Click "Launch Instances"
- [ ] Ubuntu 22.04 LTS, t2.micro
- [ ] Same security settings
- [ ] Wait for instance to start

### Step 4: Deploy (20 minutes)
- [ ] Get new IP from AWS console
- [ ] Test SSH connection
- [ ] Run: `.\deploy-to-aws.ps1 -InstanceIP <NEW_IP>`
- [ ] Wait for completion

### Step 5: Verify (5 minutes)
- [ ] Check backend logs
- [ ] Open app in browser
- [ ] Test features

---

## 🔍 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| SSH timeout | Wait 30 sec, try again |
| npm out of memory | Swap created automatically |
| Backend not responding | `pm2 restart forever-us` |
| Frontend not loading | `sudo systemctl restart nginx` |
| MongoDB connection failed | Check `.env` and MongoDB Atlas |

See **REDEPLOY_TROUBLESHOOTING.md** for detailed solutions.

---

## 📞 Support

If you need help:

1. Check **REDEPLOY_TROUBLESHOOTING.md**
2. Check logs: `pm2 logs forever-us`
3. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
4. SSH into instance and debug manually

---

## 💰 Cost

- **EC2 t2.micro**: Free for 12 months
- **MongoDB Atlas**: Free tier (512MB)
- **Total**: Free for 12 months

---

## 📝 Notes

- All code is ready to deploy
- MongoDB connection string is configured
- Deployment scripts are automated
- No data loss (old instance has no data)
- Fresh start with new infrastructure

---

## 🎯 Next Steps

1. Open **README_SESSION_12.md**
2. Follow **REDEPLOY_INSTRUCTIONS.md**
3. Use **REDEPLOY_CHECKLIST.md** to track
4. Run **deploy-to-aws.ps1**
5. Verify deployment
6. Test application

---

## 📊 File Statistics

| Category | Count |
|----------|-------|
| Documentation | 8 files |
| Scripts | 2 files |
| Total | 10 files |

---

## ✨ What's Included

✅ Complete documentation
✅ Automated deployment scripts
✅ Troubleshooting guide
✅ Quick reference cards
✅ Checklists and tracking
✅ Step-by-step instructions
✅ Manual fallback options

---

## 🚀 Ready to Deploy?

1. Open **README_SESSION_12.md**
2. Follow the instructions
3. Run the deployment script
4. Test the app

**Let's go!**

---

**Created**: January 17, 2026
**Session**: 12
**Status**: Ready for execution
**Estimated Time**: 35-40 minutes

