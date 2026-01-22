# Docker Build Instructions - Step by Step

## Quick Start (Copy & Paste)

Open PowerShell and run these commands:

```powershell
# Navigate to your project
cd "E:\Forever Us"

# Start Docker container
docker run -it -v ${PWD}:/app node:18-alpine bash

# Inside the container, run these commands:
cd /app/client-new
npm install --legacy-peer-deps
npm run build
exit
```

That's it! The build will be in `client-new/build/`

---

## Detailed Step-by-Step

### Step 1: Open PowerShell
- Press `Win + X` and select "Windows PowerShell"
- Or search for "PowerShell" in Start menu

### Step 2: Navigate to Project
```powershell
cd "E:\Forever Us"
```

### Step 3: Start Docker Container
```powershell
docker run -it -v ${PWD}:/app node:18-alpine bash
```

**What this does:**
- `docker run` - Start a new container
- `-it` - Interactive terminal
- `-v ${PWD}:/app` - Mount current folder to `/app` in container
- `node:18-alpine` - Use Node.js 18 (lightweight version)
- `bash` - Open bash shell

**You should see:**
```
root@abc123:/# 
```

### Step 4: Navigate Inside Container
```bash
cd /app/client-new
```

### Step 5: Install Dependencies
```bash
npm install --legacy-peer-deps
```

**This will:**
- Download all npm packages
- Take 3-5 minutes
- Show lots of output (this is normal)

**You'll see:**
```
added 1234 packages in 4m
```

### Step 6: Build the Frontend
```bash
npm run build
```

**This will:**
- Compile React code
- Bundle everything
- Create optimized build
- Take 2-3 minutes

**You'll see:**
```
Creating an optimized production build...
The build folder is ready to be deployed.
```

### Step 7: Exit Container
```bash
exit
```

**You're back in PowerShell**

---

## What Happens Next

The build output is automatically in:
```
E:\Forever Us\client-new\build\
```

Because we mounted the folder with `-v ${PWD}:/app`, the build is saved to your Windows machine automatically.

---

## Troubleshooting

### "docker: command not found"
- Docker Desktop is not installed or not in PATH
- Restart PowerShell after installing Docker

### "Unable to find image 'node:18-alpine'"
- Docker needs to download the image
- First run will take longer (5-10 minutes)
- Subsequent runs will be faster

### "npm install" is very slow
- This is normal on first run
- Subsequent builds will be faster (npm caches packages)

### Build fails with "Module not found"
- This shouldn't happen in Docker
- If it does, try: `npm install --legacy-peer-deps --force`

### Permission denied errors
- Try running PowerShell as Administrator
- Or restart Docker Desktop

---

## After Build is Complete

Once you see the build folder is ready:

### Option A: Deploy Automatically (Recommended)

Run this PowerShell script:
```powershell
$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
$instanceIP = "18.141.201.176"
$user = "ubuntu"

# Upload build
scp -i $keyPath -r "client-new/build/*" "${user}@${instanceIP}:/home/ubuntu/forever-us-frontend/build/"

# Restart server
ssh -i $keyPath "${user}@${instanceIP}" "pm2 restart forever-us"

Write-Host "✅ Deployed! Visit http://$instanceIP" -ForegroundColor Green
```

### Option B: Deploy Manually

1. Upload the build folder to AWS:
```powershell
scp -i "C:\Users\Chris Annesley\Downloads\forever-us-new.pem" -r "client-new/build/*" ubuntu@18.141.201.176:/home/ubuntu/forever-us-frontend/build/
```

2. Restart the server:
```powershell
ssh -i "C:\Users\Chris Annesley\Downloads\forever-us-new.pem" ubuntu@18.141.201.176 "pm2 restart forever-us"
```

3. Visit the app:
```
http://18.141.201.176
```

---

## Expected Timeline

- Docker image download: 2-3 minutes (first time only)
- npm install: 3-5 minutes
- npm build: 2-3 minutes
- Upload to AWS: 1-2 minutes
- **Total: 8-13 minutes**

---

## What You'll See

### During npm install:
```
npm notice
npm notice New minor version of npm available! 10.2.4 -> 10.8.1
npm notice To update run: npm install -g npm@10.8.1
npm notice
added 1234 packages, and audited 1235 packages in 4m
```

### During npm build:
```
> forever-us-client@0.1.0 build
> react-scripts build

Creating an optimized production build...
Compiled successfully.

The build folder is ready to be deployed.
```

### After exit:
```
root@abc123:/app/client-new# exit
exit
PS E:\Forever Us>
```

---

## Verify Build Succeeded

After exiting Docker, check if the build exists:

```powershell
ls client-new/build/index.html
```

You should see:
```
    Directory: E:\Forever Us\client-new\build

Mode                 LastWriteTime         Length Name
----                 -----------         ------ ----
-a---           1/21/2026  2:30 PM            644 index.html
```

If you see this, the build is ready to deploy!

---

## Summary

1. Open PowerShell
2. `cd "E:\Forever Us"`
3. `docker run -it -v ${PWD}:/app node:18-alpine bash`
4. `cd /app/client-new`
5. `npm install --legacy-peer-deps`
6. `npm run build`
7. `exit`
8. Deploy to AWS (see options above)

That's it! The report button will appear on the Dashboard.
