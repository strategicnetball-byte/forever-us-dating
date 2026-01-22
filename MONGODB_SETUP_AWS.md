# Adding MongoDB to AWS EC2

## Step 1: SSH into AWS Instance

```bash
ssh -i "C:\Users\Chris Annesley\Downloads\Forever Us.pem" ubuntu@52.221.223.55
```

## Step 2: Install MongoDB

Run these commands one at a time:

```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB to apt sources
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Verify it's running
sudo systemctl status mongod
```

## Step 3: Verify MongoDB is Working

```bash
# Connect to MongoDB
mongosh

# You should see a prompt like: test>

# Type 'exit' to quit
exit
```

## Step 4: Restart Backend

```bash
pm2 restart forever-us
pm2 logs forever-us
```

You should see: `✅ Connected to MongoDB`

## Step 5: Test the App

Go to http://52.221.223.55 and try:
1. Register a new account
2. Login
3. Upload a photo
4. Browse profiles

## Troubleshooting

### MongoDB won't start
```bash
sudo systemctl status mongod
sudo journalctl -u mongod -n 50
```

### Backend still shows "MongoDB connection error"
```bash
# Check if MongoDB is listening
sudo netstat -tlnp | grep mongod

# Restart backend
pm2 restart forever-us
pm2 logs forever-us
```

### Can't connect to mongosh
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Try restarting
sudo systemctl restart mongod
```

## Verify Everything Works

Once MongoDB is running and backend restarted:

```bash
# Check backend logs
pm2 logs forever-us

# Should show:
# ✅ Connected to MongoDB
# Server running on port 3001
```

Then test in browser at http://52.221.223.55
