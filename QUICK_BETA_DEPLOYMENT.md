# Quick Beta Deployment Guide

Get Forever Us running on a public server in 30 minutes.

---

## Best Option: AWS (Free for 12 months)

### Step 1: Create AWS Account & EC2 Instance
1. Go to [AWS](https://aws.amazon.com)
2. Create account
3. Go to EC2 Console
4. Launch new instance:
   - Image: Ubuntu 22.04 LTS
   - Instance type: t2.micro (free tier)
   - Security group: Allow ports 22, 80, 443
5. Create key pair and download `.pem` file
6. Copy public IP address

### Step 2: Connect to Server
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your_ip
```

### Step 3-8: Same as DigitalOcean below
(Just use `sudo` before commands since you're ubuntu user, not root)

### Step 2: Connect to Server
```bash
ssh root@your_droplet_ip
```

### Step 3: Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Install Git
apt install -y git

# Install Nginx (reverse proxy)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

### Step 4: Clone & Setup App
```bash
# Clone repository
git clone https://github.com/your-username/forever-us.git
cd forever-us

# Install dependencies
npm install
cd client-new && npm install && cd ..

# Build frontend
cd client-new && npm run build && cd ..
```

### Step 5: Create Production .env
```bash
# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/forever-us
JWT_SECRET=$(openssl rand -base64 32)
PORT=3001
CLIENT_URL=http://your_droplet_ip
EOF
```

### Step 6: Start Backend with PM2
```bash
pm2 start npm --name "forever-us" -- run server
pm2 save
pm2 startup
```

### Step 7: Configure Nginx
```bash
# Create Nginx config
cat > /etc/nginx/sites-available/forever-us << 'EOF'
server {
    listen 80;
    server_name your_droplet_ip;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3001/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/forever-us /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test config
nginx -t

# Start Nginx
systemctl start nginx
systemctl enable nginx
```

### Step 8: Verify It's Working
```bash
# Check if backend is running
curl http://localhost:3001

# Check if Nginx is running
curl http://your_droplet_ip
```

### Step 9: Share with Beta Testers
Send them: `http://your_droplet_ip`

---

## Alternative: Heroku (Free tier deprecated, but still cheapest)

### Step 1: Create Heroku Account
1. Go to [Heroku](https://www.heroku.com)
2. Sign up
3. Install Heroku CLI

### Step 2: Create Procfile
```bash
cat > Procfile << EOF
web: npm run server
EOF
```

### Step 3: Deploy
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Step 4: Add MongoDB
```bash
heroku addons:create mongolab:sandbox
```

### Step 5: Set Environment Variables
```bash
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
```

### Step 6: Open App
```bash
heroku open
```

---

## Alternative: AWS EC2 (Free tier for 12 months)

### Step 1: Create EC2 Instance
1. Go to AWS Console
2. Launch EC2 instance (t2.micro - free tier)
3. Ubuntu 22.04 AMI
4. Create security group allowing ports 80, 443, 22

### Step 2: Connect & Setup
```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Same as DigitalOcean steps 3-8 above
```

---

## Monitoring & Maintenance

### Check Logs
```bash
# Backend logs
pm2 logs forever-us

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Restart Services
```bash
# Restart backend
pm2 restart forever-us

# Restart Nginx
systemctl restart nginx

# Restart MongoDB
systemctl restart mongod
```

### Monitor Resources
```bash
# Check CPU/Memory
top

# Check disk space
df -h

# Check MongoDB size
du -sh /var/lib/mongodb
```

---

## Troubleshooting

### Backend not responding
```bash
# Check if running
pm2 status

# Restart
pm2 restart forever-us

# Check logs
pm2 logs forever-us
```

### Nginx not working
```bash
# Test config
nginx -t

# Restart
systemctl restart nginx

# Check status
systemctl status nginx
```

### MongoDB connection error
```bash
# Check if running
systemctl status mongod

# Restart
systemctl restart mongod

# Check logs
tail -f /var/log/mongodb/mongod.log
```

### Port already in use
```bash
# Find process using port 3001
lsof -i :3001

# Kill it
kill -9 <PID>
```

---

## SSL Certificate (Optional but Recommended)

### Using Let's Encrypt (Free)
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot certonly --nginx -d your-domain.com

# Update Nginx config to use SSL
# (Certbot can do this automatically)
certbot --nginx -d your-domain.com

# Auto-renew
systemctl enable certbot.timer
```

---

## Backup Strategy

### Daily Backup
```bash
# Create backup script
cat > /root/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
mkdir -p $BACKUP_DIR
mongodump --out $BACKUP_DIR/$(date +%Y%m%d_%H%M%S)
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
EOF

# Make executable
chmod +x /root/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup.sh") | crontab -
```

---

## Performance Optimization

### Enable Gzip Compression
```bash
# Add to Nginx config
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
```

### Add Caching Headers
```bash
# Add to Nginx config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Indexing
Already done in code, but verify:
```bash
# Connect to MongoDB
mongosh

# Check indexes
db.users.getIndexes()
db.messages.getIndexes()
```

---

## Monitoring Tools

### PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-auto-pull

# View dashboard
pm2 monit
```

### Nginx Monitoring
```bash
# Enable Nginx stats
# Add to Nginx config:
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}
```

---

## Scaling for More Users

### When you need more power:
1. Upgrade droplet size ($10, $20, etc.)
2. Add more MongoDB replicas
3. Add load balancer
4. Separate database server
5. Add caching layer (Redis)

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| AWS EC2 (t2.micro) | Free for 12 months | Then ~$10/month |
| Railway | $5/month | Pay as you go |
| Render | $7/month | Includes database |
| DigitalOcean | $32/month | Full control |
| Domain (optional) | $10-15/year | namecheap.com |
| SSL Certificate | Free | Let's Encrypt |
| **Best Option** | **AWS Free Tier** | **Free for 12 months** |

---

## Next Steps

1. **Choose platform** (DigitalOcean recommended)
2. **Deploy** (follow steps above)
3. **Test** (verify all features work)
4. **Share** (send link to beta testers)
5. **Monitor** (watch logs for issues)
6. **Iterate** (fix bugs, add features)

---

## Support

If you get stuck:
1. Check logs: `pm2 logs forever-us`
2. Check Nginx: `systemctl status nginx`
3. Check MongoDB: `systemctl status mongod`
4. Restart everything: `pm2 restart all && systemctl restart nginx`

