# Forever Us - Redeploy Troubleshooting Guide

## Common Issues and Solutions

### SSH Connection Issues

#### Problem: "Connection timed out" when trying to SSH

**Cause**: Instance not fully booted or security group not configured correctly

**Solutions**:
1. Wait 30 seconds after instance shows "Running"
2. Verify security group allows SSH (port 22)
3. Check instance is in "Running" state (not "Pending")
4. Try again

```powershell
# Test SSH connection
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@<NEW_IP>
```

#### Problem: "Permission denied (publickey)"

**Cause**: Wrong SSH key or key permissions

**Solutions**:
1. Verify key path: `C:\Users\Chris Annesley\Downloads\Forever Us.pem`
2. Verify key file exists
3. Verify you selected the correct key pair when creating instance
4. Try creating a new key pair and instance

#### Problem: "Could not resolve hostname"

**Cause**: Invalid IP address

**Solutions**:
1. Copy IP from AWS console again
2. Verify IP format: `xxx.xxx.xxx.xxx`
3. Verify instance is in "Running" state

---

### Deployment Script Issues

#### Problem: "npm install" fails with "out of memory"

**Cause**: t2.micro has limited RAM (1GB)

**Solutions**:
1. Swap space should be created automatically
2. Check swap: `sudo swapon --show`
3. If no swap, create it:
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```
4. Retry npm install

#### Problem: "npm ERR! code EACCES" (permission denied)

**Cause**: npm trying to write to system directories

**Solutions**:
1. Don't use `sudo npm install`
2. Use regular `npm install`
3. If already used sudo, fix permissions:
   ```bash
   sudo chown -R ubuntu:ubuntu ~/.npm
   sudo chown -R ubuntu:ubuntu ~/node_modules
   ```

#### Problem: "git clone" fails

**Cause**: Git not installed or repository not accessible

**Solutions**:
1. Install git: `sudo apt install -y git`
2. If using private repo, configure SSH keys
3. Or upload files via SCP instead

#### Problem: "npm run build" fails

**Cause**: TypeScript errors or missing dependencies

**Solutions**:
1. Check logs for specific error
2. Verify all dependencies installed: `npm install`
3. Try again: `npm run build`
4. If still fails, check `client-new/package.json` for issues

---

### Backend Issues

#### Problem: Backend not starting (pm2 shows "errored")

**Cause**: Port already in use or missing dependencies

**Solutions**:
1. Check logs: `pm2 logs forever-us`
2. Check if port 3001 is in use: `sudo lsof -i :3001`
3. Kill process if needed: `sudo kill -9 <PID>`
4. Restart: `pm2 restart forever-us`

#### Problem: "Cannot find module" error

**Cause**: Dependencies not installed

**Solutions**:
1. Install dependencies: `npm install`
2. Check `server/index.js` for required modules
3. Verify `package.json` has all dependencies

#### Problem: "MongoDB connection failed"

**Cause**: Connection string wrong or MongoDB Atlas not accessible

**Solutions**:
1. Check `.env` file: `cat .env`
2. Verify connection string:
   ```
   mongodb+srv://strategicnetball_db_user:Faith@Miley2025@cluster0.y2tnarx.mongodb.net/forever-us?retryWrites=true&w=majority
   ```
3. Verify MongoDB Atlas cluster is running
4. Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
5. Test connection manually:
   ```bash
   mongosh "mongodb+srv://strategicnetball_db_user:Faith@Miley2025@cluster0.y2tnarx.mongodb.net/forever-us"
   ```

#### Problem: Backend running but not responding to requests

**Cause**: Nginx not configured correctly or backend not listening

**Solutions**:
1. Check backend is listening: `sudo lsof -i :3001`
2. Check Nginx config: `sudo nginx -t`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Restart Nginx: `sudo systemctl restart nginx`

---

### Frontend Issues

#### Problem: Frontend not loading (blank page)

**Cause**: Build files missing or Nginx not serving them

**Solutions**:
1. Check build folder exists: `ls -la ~/client-new/build/`
2. Check index.html exists: `ls -la ~/client-new/build/index.html`
3. Check Nginx config: `cat /etc/nginx/sites-available/forever-us`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
5. Rebuild frontend:
   ```bash
   cd ~/client-new
   npm run build
   ```

#### Problem: "404 Not Found" for static files

**Cause**: Nginx not serving static files correctly

**Solutions**:
1. Check file permissions: `ls -la ~/client-new/build/`
2. Fix permissions: `sudo chmod -R 755 ~/client-new/build`
3. Check Nginx config has correct root path
4. Restart Nginx: `sudo systemctl restart nginx`

#### Problem: API calls failing (CORS error)

**Cause**: Backend CORS not configured for new IP

**Solutions**:
1. Check `.env` has correct CLIENT_URL
2. Verify backend CORS includes new IP
3. Restart backend: `pm2 restart forever-us`
4. Hard refresh browser: Ctrl+Shift+R

#### Problem: Images not loading

**Cause**: Image URLs pointing to wrong server

**Solutions**:
1. Check `client-new/src/utils/api.ts` for `getImageUrl()`
2. Verify it returns correct base URL
3. Check backend is serving images from `/uploads`
4. Restart backend: `pm2 restart forever-us`

---

### Nginx Issues

#### Problem: "502 Bad Gateway"

**Cause**: Backend not running or not responding

**Solutions**:
1. Check backend: `pm2 status`
2. Check backend logs: `pm2 logs forever-us`
3. Restart backend: `pm2 restart forever-us`
4. Check port 3001: `sudo lsof -i :3001`

#### Problem: "500 Internal Server Error"

**Cause**: Nginx configuration error

**Solutions**:
1. Test config: `sudo nginx -t`
2. Check logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify config file: `cat /etc/nginx/sites-available/forever-us`
4. Restart Nginx: `sudo systemctl restart nginx`

#### Problem: Nginx not starting

**Cause**: Port 80 already in use or config error

**Solutions**:
1. Check port 80: `sudo lsof -i :80`
2. Kill process if needed: `sudo kill -9 <PID>`
3. Test config: `sudo nginx -t`
4. Start Nginx: `sudo systemctl start nginx`

---

### MongoDB Issues

#### Problem: "Authentication failed"

**Cause**: Wrong credentials in connection string

**Solutions**:
1. Verify username: `strategicnetball_db_user`
2. Verify password: `Faith@Miley2025`
3. Check for special characters (@ is in password)
4. Verify connection string format

#### Problem: "Connection timeout"

**Cause**: MongoDB Atlas cluster not running or IP not whitelisted

**Solutions**:
1. Go to MongoDB Atlas console
2. Check cluster is running
3. Check IP whitelist includes 0.0.0.0/0
4. Try connecting from local machine to verify

#### Problem: "Database not found"

**Cause**: Database name wrong in connection string

**Solutions**:
1. Verify database name: `forever-us`
2. Check connection string includes `/forever-us`
3. Create database if needed in MongoDB Atlas

---

### PM2 Issues

#### Problem: "pm2 command not found"

**Cause**: PM2 not installed globally

**Solutions**:
1. Install PM2: `sudo npm install -g pm2`
2. Verify: `pm2 --version`

#### Problem: "pm2 logs" shows nothing

**Cause**: Process not running or logs cleared

**Solutions**:
1. Check status: `pm2 status`
2. Check if process exists: `pm2 list`
3. Restart process: `pm2 restart forever-us`
4. View logs: `pm2 logs forever-us --lines 50`

#### Problem: Process keeps crashing

**Cause**: Application error or out of memory

**Solutions**:
1. Check logs: `pm2 logs forever-us`
2. Check memory: `free -h`
3. Check swap: `sudo swapon --show`
4. Increase swap if needed
5. Fix application error

---

### General Troubleshooting

#### Check System Resources

```bash
# Check memory
free -h

# Check disk space
df -h

# Check CPU
top

# Check running processes
ps aux | grep node
```

#### Check All Services

```bash
# Check backend
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check MongoDB connection
pm2 logs forever-us
```

#### Restart Everything

```bash
# Restart backend
pm2 restart forever-us

# Restart Nginx
sudo systemctl restart nginx

# Check status
pm2 status
sudo systemctl status nginx
```

#### View Logs

```bash
# Backend logs
pm2 logs forever-us

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo tail -f /var/log/syslog
```

---

## Quick Fixes

### "App not loading"
1. Check backend: `pm2 status`
2. Check Nginx: `sudo systemctl status nginx`
3. Restart both: `pm2 restart forever-us && sudo systemctl restart nginx`
4. Hard refresh: Ctrl+Shift+R

### "Login not working"
1. Check MongoDB: `pm2 logs forever-us`
2. Verify connection string in `.env`
3. Restart backend: `pm2 restart forever-us`

### "Images not loading"
1. Check backend is running: `pm2 status`
2. Check uploads folder: `ls -la ~/uploads/photos/`
3. Restart backend: `pm2 restart forever-us`

### "API calls failing"
1. Check backend: `pm2 logs forever-us`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Restart both: `pm2 restart forever-us && sudo systemctl restart nginx`

---

## Getting Help

If you're stuck:

1. **Check logs first**: `pm2 logs forever-us`
2. **Check Nginx**: `sudo tail -f /var/log/nginx/error.log`
3. **SSH into instance**: `ssh -i "key.pem" ubuntu@<IP>`
4. **Run diagnostics**: See "Check All Services" section above
5. **Refer to guides**: Check `QUICK_REDEPLOY_SCRIPT.md` for detailed steps

---

## Emergency Restart

If everything is broken:

```bash
# Stop everything
pm2 stop forever-us
sudo systemctl stop nginx

# Wait 5 seconds
sleep 5

# Start everything
pm2 start node --name "forever-us" -- server/index.js
sudo systemctl start nginx

# Check status
pm2 status
sudo systemctl status nginx
```

---

**Last Updated**: January 17, 2026
**Status**: Ready for troubleshooting

