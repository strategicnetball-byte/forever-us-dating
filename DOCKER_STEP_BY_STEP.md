# Docker Build - Complete Step-by-Step Guide

## Step 1: Open PowerShell

1. Press **Windows Key + X**
2. Click **Windows PowerShell** (or search for "PowerShell" in Start menu)
3. You should see a blue window with `PS C:\Users\...>`

## Step 2: Navigate to Your Project

Copy and paste this into PowerShell:

```powershell
cd "E:\Forever Us"
```

Press **Enter**

You should see:
```
PS E:\Forever Us>
```

## Step 3: Start Docker Container

Copy and paste this into PowerShell:

```powershell
docker run -it -v ${PWD}:/app node:18-alpine bash
```

Press **Enter**

**What happens:**
- Docker downloads the Node.js image (first time only, takes 2-3 minutes)
- You'll see lots of output
- Eventually you'll see a prompt like: `root@abc123:/# `

**If you see an error about authentication:**
- Open Docker Desktop
- Wait for it to fully load
- Try the command again

## Step 4: Navigate Inside Docker

You're now inside the Docker container. Copy and paste:

```bash
cd /app/client-new
```

Press **Enter**

You should see:
```
root@abc123:/app/client-new#
```

## Step 5: Install Dependencies

Copy and paste:

```bash
npm install --legacy-peer-deps
```

Press **Enter**

**What happens:**
- npm downloads all packages
- Takes 3-5 minutes
- You'll see lots of output
- Eventually shows: `added 1234 packages in 4m`

**This is normal - wait for it to finish**

## Step 6: Build the Frontend

Copy and paste:

```bash
npm run build
```

Press **Enter**

**What happens:**
- React compiles your code
- Takes 2-3 minutes
- You'll see output like:
  ```
  Creating an optimized production build...
  Compiled successfully.
  The build folder is ready to be deployed.
  ```

**Wait for it to finish - this is the important part**

## Step 7: Exit Docker

Copy and paste:

```bash
exit
```

Press **Enter**

You should be back in PowerShell:
```
PS E:\Forever Us>
```

## Step 8: Verify Build Succeeded

Copy and paste:

```powershell
ls client-new/build/index.html
```

Press **Enter**

**You should see:**
```
    Directory: E:\Forever Us\client-new\build

Mode                 LastWriteTime         Length Name
----                 -----------         ------ ----
-a---           1/21/2026  2:30 PM            644 index.html
```

If you see this, the build is successful! ✅

## Step 9: Deploy to AWS

Now upload the build to your server. Copy and paste:

```powershell
$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$instanceIP = "18.141.201.176"
$user = "ubuntu"

scp -i $keyPath -r "client-new/build/*" "${user}@${instanceIP}:/home/ubuntu/forever-us-frontend/build/"
```

Press **Enter**

**What happens:**
- Uploads the build to AWS
- Takes 1-2 minutes
- Shows file transfer progress

## Step 10: Restart Server

Copy and paste:

```powershell
ssh -i $keyPath "${user}@${instanceIP}" "pm2 restart forever-us"
```

Press **Enter**

**You should see:**
```
[PM2] Applying action restartProcessId on app [forever-us](ids: [ 0 ])
[PM2] [forever-us](0) ✓
```

## Step 11: Verify App is Running

Copy and paste:

```powershell
Start-Sleep -Seconds 3
Invoke-WebRequest -Uri "http://18.141.201.176/" -UseBasicParsing | Select-Object StatusCode
```

Press **Enter**

**You should see:**
```
StatusCode
----------
       200
```

## Done! 🎉

Visit: **http://18.141.201.176**

The report button should now be visible on the Dashboard!

---

## Troubleshooting

### Problem: "docker: command not found"
**Solution:**
- Docker Desktop is not installed
- Or PowerShell needs to be restarted after installation
- Restart PowerShell and try again

### Problem: "Unable to find image 'node:18-alpine'"
**Solution:**
- Docker Desktop is not running
- Open Docker Desktop and wait for it to fully load
- Try the command again

### Problem: Build takes very long
**Solution:**
- This is normal on first run (npm install takes time)
- Don't close the window
- Let it finish (5-10 minutes total)

### Problem: "npm ERR! code ERESOLVE"
**Solution:**
- This is normal with React
- The `--legacy-peer-deps` flag handles this
- Just wait for it to finish

### Problem: Build fails with "Module not found"
**Solution:**
- This shouldn't happen in Docker
- If it does, try:
  ```bash
  npm install --legacy-peer-deps --force
  npm run build
  ```

### Problem: Can't connect to AWS after deploy
**Solution:**
- Wait 5 seconds for server to restart
- Try: `http://18.141.201.176` in browser
- If still not working, check server status:
  ```powershell
  ssh -i $keyPath "${user}@${instanceIP}" "pm2 list"
  ```

---

## What Each Command Does

| Command | What it does |
|---------|------------|
| `docker run -it -v ${PWD}:/app node:18-alpine bash` | Start Docker container with Node.js |
| `cd /app/client-new` | Navigate to your project inside Docker |
| `npm install --legacy-peer-deps` | Download all npm packages |
| `npm run build` | Compile React code into optimized build |
| `exit` | Leave Docker container |
| `scp -i $keyPath -r "client-new/build/*" ...` | Upload build to AWS |
| `ssh -i $keyPath ... "pm2 restart forever-us"` | Restart server on AWS |

---

## Timeline

- Docker image download: 2-3 minutes (first time only)
- npm install: 3-5 minutes
- npm build: 2-3 minutes
- Upload to AWS: 1-2 minutes
- **Total: 8-13 minutes**

---

## Success Indicators

✅ You see: `Compiled successfully.`
✅ You see: `The build folder is ready to be deployed.`
✅ You see: `StatusCode: 200`
✅ Report button appears on Dashboard

---

## Next Time

The next time you build:
- Docker image is already downloaded (faster)
- npm packages are cached (faster)
- **Total time: 3-5 minutes**

---

## Questions?

If anything goes wrong:
1. Read the error message carefully
2. Check the Troubleshooting section above
3. Make sure Docker Desktop is running
4. Try the command again

Good luck! 🚀
