# Forever Us - Redeploy Checklist

## Pre-Deployment (5 minutes)

- [ ] Read `REDEPLOY_INSTRUCTIONS.md`
- [ ] Verify SSH key exists: `C:\Users\Chris Annesley\Downloads\Forever Us.pem`
- [ ] Have AWS console open: https://console.aws.amazon.com
- [ ] Have PowerShell ready on local machine

## Terminate Old Instance (2 minutes)

- [ ] Go to EC2 → Instances
- [ ] Find instance 52.221.223.55
- [ ] Right-click → Instance State → Terminate
- [ ] Confirm termination
- [ ] Wait for termination to complete (shows "terminated" state)

## Create New Instance (5 minutes)

- [ ] Click "Launch Instances"
- [ ] Set Name: "Forever Us"
- [ ] Select AMI: Ubuntu 22.04 LTS
- [ ] Select Instance Type: t2.micro
- [ ] Select Key Pair: "Forever Us"
- [ ] Create Security Group:
  - [ ] Name: forever-us-sg
  - [ ] Add SSH (22): 0.0.0.0/0
  - [ ] Add HTTP (80): 0.0.0.0/0
  - [ ] Add HTTPS (443): 0.0.0.0/0
- [ ] Storage: 20 GB (default)
- [ ] Click "Launch Instance"
- [ ] Wait 2-3 minutes for instance to start

## Get New IP Address (1 minute)

- [ ] Go to EC2 → Instances
- [ ] Click new instance
- [ ] Copy "Public IPv4 address"
- [ ] Save it: `_________________` (write it down)

## Test SSH Connection (1 minute)

```powershell
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<NEW_IP>
```

- [ ] SSH connection successful
- [ ] See prompt: `ubuntu@ip-xxx:~$`
- [ ] Type `exit` to disconnect

## Deploy Application (20 minutes)

### Option A: Automated (Recommended)

```powershell
cd "E:\Forever Us"
.\deploy-to-aws.ps1 -InstanceIP <NEW_IP>
```

- [ ] Script starts
- [ ] Files uploading...
- [ ] Deployment script running...
- [ ] Wait for completion (15-20 minutes)
- [ ] See success message with new app URL

### Option B: Manual

- [ ] SSH into instance
- [ ] Run all commands from `QUICK_REDEPLOY_SCRIPT.md`
- [ ] Wait for each step to complete
- [ ] Verify no errors

## Verify Deployment (5 minutes)

### Check Backend

```bash
pm2 logs forever-us
```

- [ ] See "✅ Connected to MongoDB"
- [ ] See "Server running on port 3001"
- [ ] No error messages

### Check Frontend

- [ ] Open browser: `http://<NEW_IP>`
- [ ] See login page
- [ ] Page loads without errors
- [ ] Hard refresh: Ctrl+Shift+R

### Check Nginx

```bash
sudo systemctl status nginx
```

- [ ] Status shows "active (running)"

## Test Application (10 minutes)

- [ ] Register new account
- [ ] Verify email (if configured)
- [ ] Login with new account
- [ ] Upload profile photo
- [ ] Browse profiles
- [ ] Like a profile
- [ ] Send a message
- [ ] Check rewards page
- [ ] Check membership page

## Post-Deployment

- [ ] Update DNS records (if using custom domain)
- [ ] Update any documentation with new IP
- [ ] Save new IP for future reference
- [ ] Delete old instance (already terminated)
- [ ] Monitor logs for errors: `pm2 logs forever-us`

## Troubleshooting

If something fails:

- [ ] Check logs: `pm2 logs forever-us`
- [ ] Check Nginx: `sudo tail -f /var/log/nginx/error.log`
- [ ] SSH into instance and debug
- [ ] Refer to `QUICK_REDEPLOY_SCRIPT.md` for detailed steps

## Final Status

- [ ] App is live at: `http://<NEW_IP>`
- [ ] Backend connected to MongoDB
- [ ] Frontend loading correctly
- [ ] All features tested
- [ ] No errors in logs

---

## Quick Reference

| Item | Value |
|------|-------|
| Old Instance | 52.221.223.55 (terminated) |
| New Instance IP | _________________ |
| SSH Key | C:\Users\Chris Annesley\Downloads\Forever Us.pem |
| App URL | http://_________________ |
| Backend | http://_________________/api |
| MongoDB | Connected ✓ |

---

## Time Tracking

| Step | Estimated | Actual | Status |
|------|-----------|--------|--------|
| Terminate old | 2 min | ___ | ⏳ |
| Create new | 5 min | ___ | ⏳ |
| Get IP | 1 min | ___ | ⏳ |
| Test SSH | 1 min | ___ | ⏳ |
| Deploy | 20 min | ___ | ⏳ |
| Verify | 5 min | ___ | ⏳ |
| Test app | 10 min | ___ | ⏳ |
| **Total** | **~45 min** | ___ | ⏳ |

---

**Start Time**: _______________
**End Time**: _______________
**Total Duration**: _______________

