# Simple Deployment Workflow

This is the workflow that was working 3 days ago. Keep it simple.

## Development Process

1. **Make code changes** in `client/src/` directory
2. **Update CSS** in `client/src/components/*/` files
3. **Commit to git** when ready:
   ```
   git add .
   git commit -m "Your change description"
   git push origin main
   ```

## Deployment to AWS

When ready to deploy:

```powershell
# 1. Deploy the build to AWS
$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
scp -i $keyPath -r "client/build/build/*" ubuntu@18.141.201.176:/home/ubuntu/forever-us-frontend/build/

# 2. Restart the server
ssh -i $keyPath ubuntu@18.141.201.176 "pm2 restart forever-us"
```

Or use the deploy script:
```powershell
.\deploy-local.ps1
```

## Important Notes

- **Do NOT try to build locally** - React-scripts has Windows issues
- **Use pre-built files** from `client/build/build/` 
- **The build is already on AWS** - just update the files and restart
- **Hard refresh browser** after deployment: `Ctrl+Shift+R`

## Current Build Status

- Build location: `client/build/build/`
- Deployed to: `ubuntu@18.141.201.176:/home/ubuntu/forever-us-frontend/build/`
- Server: PM2 process "forever-us"

## If Build Gets Deleted

Pull it back from AWS:
```powershell
$keyPath = "C:\Users\Chris Annesley\Downloads\forever-us-new.pem"
New-Item -ItemType Directory -Path "client/build/build" -Force | Out-Null
scp -i $keyPath -r "ubuntu@18.141.201.176:/home/ubuntu/forever-us-frontend/build/*" "client/build/build/"
```
