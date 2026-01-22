# MongoDB Atlas Setup (Cloud Database)

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/password
4. Verify email

## Step 2: Create a Cluster

1. After login, click "Create" (or "Build a Cluster")
2. Choose **M0 Sandbox** (Free tier)
3. Select region: **Singapore** (closest to your AWS instance in ap-southeast-1)
4. Click "Create Cluster"
5. Wait 5-10 minutes for cluster to be created

## Step 3: Create Database User

1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Enter username: `forever_us`
4. Enter password: `ForeverUs123!` (or your own)
5. Click "Add User"

## Step 4: Get Connection String

1. In left sidebar, click "Clusters"
2. Click "Connect" button on your cluster
3. Choose "Drivers"
4. Select "Node.js" and version "4.x or later"
5. Copy the connection string (looks like):
```
mongodb+srv://forever_us:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Replace `<password>` with your actual password: `ForeverUs123!`

Final string should look like:
```
mongodb+srv://forever_us:ForeverUs123!@cluster0.xxxxx.mongodb.net/forever-us?retryWrites=true&w=majority
```

## Step 5: Update AWS .env File

You need to update the `.env` file on AWS with the MongoDB Atlas connection string.

**Option A: Using SSH (if it works)**
```bash
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@52.221.223.55
nano ~/.env
```

Then update:
```
MONGODB_URI=mongodb+srv://forever_us:ForeverUs123!@cluster0.xxxxx.mongodb.net/forever-us?retryWrites=true&w=majority
```

Save (Ctrl+X, then Y, then Enter)

**Option B: If SSH doesn't work**
You'll need to manually update the file. Contact me for alternative methods.

## Step 6: Restart Backend

Once `.env` is updated:

```bash
pm2 restart forever-us
pm2 logs forever-us
```

You should see:
```
✅ Connected to MongoDB
Server running on port 3001
```

## Step 7: Test the App

Go to http://52.221.223.55 and try:
1. Register a new account
2. Login
3. Upload a photo
4. Browse profiles

## Troubleshooting

### Connection string not working
- Make sure you replaced `<password>` with actual password
- Check username is `forever_us`
- Verify cluster is in Singapore region

### Still getting "MongoDB connection error"
```bash
# Check logs
pm2 logs forever-us

# Restart
pm2 restart forever-us
```

### Need to find connection string again
1. Go to https://cloud.mongodb.com
2. Click your cluster
3. Click "Connect"
4. Choose "Drivers"
5. Copy the connection string

## MongoDB Atlas Free Tier Limits

- 512 MB storage
- Shared cluster
- Good for testing/development
- Upgrade anytime if needed

## Next Steps

Once MongoDB is working:
1. Test all features (register, login, upload photos, browse, like, message)
2. Create test accounts
3. Verify data persists after restart
4. Consider upgrading to paid tier if needed for production
