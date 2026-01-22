# GitHub Actions Setup - Auto Deploy

## What This Does
Every time you push code to GitHub, it automatically:
1. Builds the frontend on Linux
2. Uploads to AWS
3. Restarts the server
4. Your changes go live

## Setup Steps

### 1. Create GitHub Repository
If you don't have one:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/forever-us.git
git branch -M main
git push -u origin main
```

### 2. Add GitHub Secrets
Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:
- **AWS_ACCESS_KEY_ID**: Your AWS access key
- **AWS_SECRET_ACCESS_KEY**: Your AWS secret key
- **AWS_INSTANCE_IP**: `18.141.201.176`

### 3. Add AWS Key to GitHub
The workflow needs your PEM key to SSH into AWS.

**Option A: Add as Secret (Recommended)**
1. Go to GitHub Secrets (same place as above)
2. Add new secret: `AWS_PEM_KEY`
3. Paste the contents of `forever-us-new.pem`

Then update `.github/workflows/deploy.yml` line 40:
```yaml
- name: Setup AWS Key
  run: |
    mkdir -p /tmp
    echo "${{ secrets.AWS_PEM_KEY }}" > /tmp/aws-key.pem
    chmod 600 /tmp/aws-key.pem
```

**Option B: Use GitHub Deploy Keys**
1. Generate new SSH key: `ssh-keygen -t ed25519 -f github-deploy`
2. Add public key to AWS instance authorized_keys
3. Add private key as GitHub secret

### 4. Test It
Push a small change:
```bash
git add .
git commit -m "Test GitHub Actions"
git push
```

Go to **GitHub Repo → Actions** and watch it build and deploy!

## How to Use Going Forward

**To deploy changes:**
```bash
git add .
git commit -m "Your change description"
git push
```

That's it! GitHub Actions handles the rest.

## Troubleshooting

**Build fails?**
- Check GitHub Actions logs: Repo → Actions → Latest workflow
- Common issues: npm install fails, build errors

**Deploy fails?**
- Check AWS credentials are correct
- Check PEM key is valid
- Check instance IP is correct

**Changes not appearing?**
- Hard refresh browser (Ctrl+Shift+R)
- Check server logs: `ssh -i forever-us-new.pem ubuntu@18.141.201.176 "pm2 logs forever-us"`

## Costs
- GitHub Actions: Free (2000 minutes/month)
- AWS: Only what you're already paying

## Next Steps
1. Create GitHub repo
2. Add secrets
3. Push code
4. Watch it deploy automatically!
