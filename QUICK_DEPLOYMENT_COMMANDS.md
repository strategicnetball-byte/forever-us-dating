# Quick Deployment Commands for AWS

## SSH into AWS Instance
```bash
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@52.221.223.55
```

## One-Command Deployment (Run on AWS)
```bash
cd ~/client-new && npm run build && cd ~ && pm2 delete forever-us 2>/dev/null; pm2 start node --name "forever-us" -- server/index.js && pm2 save && echo "✅ Deployment complete! Visit http://52.221.223.55"
```

## Step-by-Step Deployment

### 1. Stop old backend
```bash
pm2 delete forever-us
```

### 2. Rebuild frontend
```bash
cd ~/client-new
npm run build
```

### 3. Start backend
```bash
cd ~
pm2 start node --name "forever-us" -- server/index.js
pm2 save
```

### 4. Verify it's running
```bash
pm2 logs forever-us
```

### 5. Test in browser
Open: http://52.221.223.55

## Monitoring Commands

### Check backend status
```bash
pm2 status
```

### View backend logs
```bash
pm2 logs forever-us
```

### Check Nginx status
```bash
sudo systemctl status nginx
```

### View Nginx access logs
```bash
sudo tail -f /var/log/nginx/access.log
```

### View Nginx error logs
```bash
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Backend won't start
```bash
pm2 logs forever-us
# Check for errors in output
```

### Timeout when accessing site
```bash
# Test locally on server
curl http://localhost

# Check Nginx is running
sudo systemctl status nginx

# Check backend is running
pm2 status
```

### Images not loading
```bash
# Check photos exist
ls -la ~/uploads/photos/

# Check permissions
ls -la ~/client-new/build/
```

## What Changed

All hardcoded `localhost:3001` references have been replaced with dynamic URLs that:
- Use `52.221.223.55` when accessed from AWS
- Use `localhost:3001` when accessed locally

No code changes needed - just rebuild and restart!
