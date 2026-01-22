# Beta Deployment Checklist

## Overview
This checklist covers everything needed to deploy a working beta version of Forever Us dating app.

---

## Phase 1: Pre-Deployment Verification (Current Status)

### Backend
- ✅ Express server running on port 3001
- ✅ MongoDB connected
- ✅ All routes implemented (auth, users, matches, messages, rewards, membership, compatibility)
- ✅ CORS configured for multiple ports
- ✅ Socket.io for real-time messaging
- ✅ Point system fully functional
- ✅ Daily earning limits enforced
- ✅ Like card expiration (10 days no message)

### Frontend
- ✅ React app running on port 3000+
- ✅ All pages implemented (Home, Auth, Dashboard, Browse, Matches, Likes, Messages, Profile, Rewards, Settings)
- ✅ Authentication working
- ✅ Profile management working
- ✅ Messaging system working
- ✅ Rewards system functional (points awarded)
- ✅ Membership tiers implemented
- ✅ Compatibility matching system

### Database
- ✅ MongoDB local instance running
- ✅ User model with all fields
- ✅ Message model
- ✅ Reward model
- ✅ Indexes for performance

---

## Phase 2: Critical Fixes Before Beta

### 1. Remove Old Client Folder
The old `client` folder should not be deployed. Only use `client-new`.

```bash
# Verify only client-new is used
rm -rf client
```

### 2. Environment Variables
Create production `.env` files:

**Root `.env` (for backend):**
```bash
MONGODB_URI=mongodb://localhost:27017/forever-us
JWT_SECRET=your-production-secret-key-here
PORT=3001
CLIENT_URL=http://your-domain.com
```

**`client-new/.env` (for frontend):**
```bash
REACT_APP_API_URL=http://your-domain.com:3001
REACT_APP_ADMOB_AD_UNIT_ID=your-test-ad-unit
REACT_APP_POLLFISH_API_KEY=your-test-key
REACT_APP_TAPRESEARCH_TOKEN=your-test-token
REACT_APP_UNITY_GAME_ID=your-test-game-id
REACT_APP_FB_PLACEMENT_ID=your-test-placement
```

### 3. Build Frontend for Production
```bash
cd client-new
npm run build
```

This creates an optimized production build in `client-new/build/`.

### 4. Serve Frontend from Backend
Update `server/index.js` to serve the built frontend:

```javascript
// After all routes, add:
app.use(express.static(path.join(__dirname, '../client-new/build')));

// Catch-all for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client-new/build/index.html'));
});
```

### 5. Update CORS for Production Domain
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://your-domain.com', 'https://your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Phase 3: Testing Before Beta Launch

### Functional Testing
- [ ] User registration works
- [ ] User login works
- [ ] Profile creation/update works
- [ ] Photo upload works
- [ ] Browse profiles works
- [ ] Like/unlike works
- [ ] Matches display correctly
- [ ] Messaging works (send/receive)
- [ ] Rewards page loads
- [ ] Points are awarded
- [ ] Daily limits enforced
- [ ] Membership tiers work
- [ ] Compatibility matching works

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API responses < 500ms
- [ ] No memory leaks
- [ ] Database queries optimized

### Security Testing
- [ ] JWT tokens working
- [ ] Password hashing working
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

---

## Phase 4: Deployment Options

### Option A: Local Server (Quick Beta)
**Best for:** Testing with small group of users

1. Keep MongoDB running locally
2. Start backend: `npm run server`
3. Start frontend: `cd client-new && npm start`
4. Share local IP with beta testers
5. Use ngrok for remote access: `ngrok http 3000`

### Option B: Cloud Deployment (Recommended for Beta)
**Best for:** Wider beta testing

#### Using Heroku (Free tier available)
1. Create Heroku account
2. Install Heroku CLI
3. Create `Procfile`:
```
web: npm run server
```
4. Deploy:
```bash
heroku create your-app-name
git push heroku main
```

#### Using AWS (EC2 + RDS)
1. Launch EC2 instance (t2.micro free tier)
2. Install Node.js and MongoDB
3. Clone repo
4. Set environment variables
5. Start server with PM2 for persistence

#### Using DigitalOcean (Recommended)
1. Create droplet ($5/month)
2. Install Node.js
3. Install MongoDB
4. Clone repo
5. Use Nginx as reverse proxy
6. Use Let's Encrypt for SSL

### Option C: Docker Deployment
**Best for:** Consistent environments

Create `Dockerfile`:
```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN cd client-new && npm run build
EXPOSE 3001
CMD ["npm", "run", "server"]
```

---

## Phase 5: Beta Launch Checklist

### Before Going Live
- [ ] All environment variables set
- [ ] Database backed up
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] Support email configured
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Beta testing agreement ready

### Launch Day
- [ ] Server running and stable
- [ ] Database connected
- [ ] Frontend loading correctly
- [ ] All pages accessible
- [ ] Authentication working
- [ ] Messaging working
- [ ] Rewards working
- [ ] No console errors

### Post-Launch
- [ ] Monitor error logs
- [ ] Track user feedback
- [ ] Monitor performance
- [ ] Fix critical bugs immediately
- [ ] Collect usage metrics
- [ ] Plan next features

---

## Phase 6: Known Issues & Workarounds

### Issue: Ad/Survey UI Not Showing
**Status:** Points are awarded correctly, UI overlays need refinement
**Workaround:** Users can still earn points by clicking ads/surveys
**Fix:** Can be addressed in next iteration

### Issue: Real Ad Networks Not Integrated
**Status:** Mock implementations working
**Next Step:** Add real credentials when ready
**Timeline:** Post-beta

---

## Phase 7: Post-Beta Improvements

### High Priority
1. Fix ad/survey UI overlays
2. Add real ad network credentials
3. Implement email verification
4. Add password reset functionality
5. Implement user blocking/reporting

### Medium Priority
1. Add push notifications
2. Implement video profiles
3. Add advanced search filters
4. Implement user verification (ID check)
5. Add analytics dashboard

### Low Priority
1. Add social media integration
2. Implement referral system
3. Add premium features
4. Implement AI matching
5. Add video chat

---

## Deployment Commands

### Local Development
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
cd client-new
npm start
```

### Production Build
```bash
# Build frontend
cd client-new
npm run build

# Start backend (serves built frontend)
npm run server
```

### Docker Deployment
```bash
docker build -t forever-us .
docker run -p 3001:3001 forever-us
```

---

## Monitoring & Maintenance

### Daily
- Check error logs
- Monitor server health
- Check database size

### Weekly
- Review user feedback
- Analyze usage metrics
- Plan bug fixes

### Monthly
- Performance review
- Security audit
- Feature planning

---

## Support & Communication

### Beta Tester Communication
- Email updates on bugs/fixes
- Slack/Discord channel for feedback
- Weekly status reports
- Bug bounty for critical issues

### Documentation
- User guide for beta testers
- FAQ document
- Troubleshooting guide
- Feature roadmap

---

## Success Metrics for Beta

- [ ] 100+ beta testers
- [ ] 50%+ daily active users
- [ ] < 5% crash rate
- [ ] < 1 second average page load
- [ ] 4+ star rating
- [ ] < 24 hour bug fix time
- [ ] 90%+ feature completion

---

## Next Steps

1. **Immediate (Today)**
   - [ ] Verify all systems working
   - [ ] Create production .env files
   - [ ] Build frontend for production

2. **This Week**
   - [ ] Choose deployment platform
   - [ ] Set up hosting
   - [ ] Configure domain/SSL
   - [ ] Deploy beta version

3. **Next Week**
   - [ ] Invite beta testers
   - [ ] Monitor for issues
   - [ ] Collect feedback
   - [ ] Plan fixes

---

## Questions?

Refer to:
- `READY_TO_DEPLOY.md` - Deployment readiness
- `COMPLETE_IMPLEMENTATION_GUIDE.md` - Feature implementation
- `README.md` - Project overview

