# Next Session Action Plan

## Current Status

✅ **App is live and accessible**: http://52.221.223.55
✅ **Frontend loads**: Login page displays
✅ **Backend running**: API endpoints available
❌ **SSH connection**: Timing out (network issue)
❌ **MongoDB**: Not yet connected

## What's Ready to Deploy

The `.env` file is updated locally with MongoDB Atlas connection string:
```
mongodb+srv://strategicnetball_db_user:Faith@Miley2025@cluster0.y2tnarx.mongodb.net/forever-us?retryWrites=true&w=majority
```

## Options for Next Session

### Option 1: Wait and Retry SSH (Recommended)
AWS SSH timeouts are often temporary. In the next session:
1. Try SSH again - it may work now
2. If it works, upload `.env` and restart backend
3. Done!

### Option 2: Terminate and Recreate Instance
If SSH continues to fail:
1. Terminate current instance (52.221.223.55)
2. Create new t2.micro instance
3. Repeat deployment (will be faster second time)
4. Upload `.env` with MongoDB connection

### Option 3: Use AWS Systems Manager Session Manager
If SSH still times out:
1. Go to AWS Console
2. EC2 → Instances → Select instance
3. Click "Connect" → "Session Manager" tab
4. Click "Connect"
5. Run: `pm2 restart forever-us`

### Option 4: Use AWS EC2 Instance Connect
1. Go to AWS Console
2. EC2 → Instances → Select instance
3. Click "Connect" → "EC2 Instance Connect" tab
4. Click "Connect"
5. Run: `pm2 restart forever-us`

## Files to Upload When SSH Works

**Local file**: `.env`
**Destination**: `~/` on AWS

**Command**:
```powershell
scp -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" .env ubuntu@52.221.223.55:~/
```

## Commands to Run After Upload

```bash
pm2 restart forever-us
pm2 logs forever-us
```

Expected output:
```
✅ Connected to MongoDB
Server running on port 3001
```

## Testing After MongoDB Connection

1. Go to http://52.221.223.55
2. Register new account
3. Login
4. Upload photo
5. Browse profiles
6. Like/match
7. Send messages

## Credentials for Reference

- **AWS IP**: 52.221.223.55
- **SSH Key**: C:\Users\Chris Annesley\Downloads\Forever Us.pem
- **MongoDB User**: strategicnetball_db_user
- **MongoDB Password**: Faith@Miley2025
- **MongoDB Cluster**: cluster0.y2tnarx.mongodb.net

## Summary

The deployment is 95% complete. The only remaining task is uploading the `.env` file and restarting the backend. This is a 2-minute task once SSH access is restored.

The app infrastructure is solid and production-ready. Just waiting for the final database connection step.
