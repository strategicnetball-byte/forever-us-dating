# Next Steps: Ad Networks

This document outlines what you can do next with the ad networks system.

---

## Option 1: Test Locally (Recommended First Step)

### What You'll Do
Test the ad networks locally using mock implementations without creating any accounts.

### Time Required
5-10 minutes

### Steps
1. Start backend: `cd server && npm start`
2. Start frontend: `cd client-new && npm start`
3. Open http://localhost:3000
4. Log in
5. Go to Rewards page
6. Click any "Watch" or "Start" button
7. See mock ad/survey
8. Earn points

### What You'll See
- 30-second countdown for AdMob video
- 25-second countdown for Unity video
- 20-second countdown for Facebook video
- 2-question survey for Pollfish
- 3-question survey for TapResearch
- Points awarded immediately

### Benefits
- No setup required
- No accounts needed
- No credentials needed
- Complete testing experience
- Realistic UI and interactions

### Next: Go to Option 2

---

## Option 2: Upgrade to Real Credentials (Optional)

### What You'll Do
Create accounts on ad networks and get real test credentials to use real ads/surveys instead of mocks.

### Time Required
30-60 minutes (mostly account creation and waiting for approvals)

### Steps

#### Step 1: Create Google AdMob Account (10 minutes)
1. Go to [AdMob Console](https://admob.google.com)
2. Sign in with Google account
3. Click "Get Started"
4. Accept terms
5. Create app: "Forever Us Dating App"
6. Create ad unit: "Video Reward Ad" (Rewarded type)
7. Copy Ad Unit ID
8. Go to Settings → Test Devices
9. Add test device ID
10. Copy test device ID

#### Step 2: Create Pollfish Account (10 minutes)
1. Go to [Pollfish Dashboard](https://www.pollfish.com/dashboard)
2. Click "Sign Up"
3. Fill in details
4. Verify email
5. Create app: "Forever Us Dating App"
6. Go to Settings
7. Copy API Key
8. Toggle "Test Mode" ON

#### Step 3: Create TapResearch Account (10 minutes)
1. Go to [TapResearch Publisher Dashboard](https://publisher.tapresearch.com)
2. Click "Sign Up"
3. Fill in details
4. Verify email
5. Create app: "Forever Us Dating App"
6. Go to Settings
7. Copy API Token
8. Toggle "Sandbox Mode" ON

#### Step 4: Create Unity Ads Account (10 minutes)
1. Go to [Unity Dashboard](https://dashboard.unity3d.com)
2. Sign in or create account
3. Create organization: "Forever Us"
4. Create project: "Forever Us Dating App"
5. Go to Monetization → Unity Ads
6. Enable Unity Ads
7. Copy Game ID
8. Create ad placement: "RewardedVideo"
9. Copy Placement ID

#### Step 5: Update .env File (5 minutes)
Edit `client-new/.env`:
```bash
# AdMob
REACT_APP_ADMOB_AD_UNIT_ID=your-real-ad-unit-id
REACT_APP_ADMOB_TEST_DEVICE_ID=your-test-device-id

# Pollfish
REACT_APP_POLLFISH_API_KEY=your-api-key
REACT_APP_POLLFISH_TEST_MODE=true

# TapResearch
REACT_APP_TAPRESEARCH_TOKEN=your-token
REACT_APP_TAPRESEARCH_SANDBOX=true

# Unity
REACT_APP_UNITY_GAME_ID=your-game-id
REACT_APP_UNITY_PLACEMENT_ID=RewardedVideo
REACT_APP_UNITY_TEST_MODE=true
```

#### Step 6: Restart Frontend (2 minutes)
```bash
# Kill frontend (Ctrl+C)
cd client-new
npm start
```

Hard refresh browser: **Ctrl+Shift+R**

#### Step 7: Test Real Ads (5 minutes)
1. Go to Rewards page
2. Click "Watch" on AdMob video
3. See real test ad from AdMob
4. Earn points
5. Click "Start" on Pollfish survey
6. See real test survey from Pollfish
7. Earn points
8. Repeat for other networks

### What You'll See
- Real ads from ad networks (in test mode)
- Real survey questions from survey platforms
- Real completion times
- Points still awarded normally
- Console shows real SDKs loaded

### Benefits
- Test with real ad networks
- See real ads/surveys
- Verify integration works
- Monitor performance
- Prepare for production

### Next: Go to Option 3

---

## Option 3: Monitor and Optimize (Ongoing)

### What You'll Do
Monitor ad performance, user engagement, and revenue. Optimize point values and provider mix.

### Time Required
Ongoing (15-30 minutes per week)

### Steps

#### Monitor Performance
1. Check ad impressions in each network's dashboard
2. Track completion rates
3. Monitor user engagement
4. Track revenue per provider
5. Identify top-performing providers

#### Optimize Point Values
1. Analyze user feedback
2. Adjust point values based on engagement
3. Test different values
4. Monitor impact on user behavior
5. Find optimal balance

#### Optimize Provider Mix
1. Identify best-performing providers
2. Increase frequency of top providers
3. Reduce frequency of underperforming providers
4. Add new providers if needed
5. Monitor overall revenue

#### User Feedback
1. Collect user feedback on ads
2. Monitor support tickets
3. Track user complaints
4. Identify issues
5. Make improvements

### Metrics to Track
- Ad impressions per day
- Completion rate per provider
- Points earned per user per day
- Revenue per user
- User satisfaction
- Churn rate

### Next: Go to Option 4

---

## Option 4: Deploy to Production (When Ready)

### What You'll Do
Deploy the ad networks system to production with real credentials and monitor live performance.

### Time Required
1-2 hours (mostly deployment and testing)

### Prerequisites
- Real credentials from all ad networks
- Production app IDs/tokens
- Production database
- Production server

### Steps

#### Step 1: Get Production Credentials
1. Create production apps on each ad network
2. Get production Ad Unit IDs/tokens
3. Get production Game IDs
4. Document all credentials

#### Step 2: Update Production .env
```bash
# Production credentials (not test mode)
REACT_APP_ADMOB_AD_UNIT_ID=production-ad-unit-id
REACT_APP_ADMOB_TEST_DEVICE_ID=production-test-device-id

REACT_APP_POLLFISH_API_KEY=production-api-key
REACT_APP_POLLFISH_TEST_MODE=false

REACT_APP_TAPRESEARCH_TOKEN=production-token
REACT_APP_TAPRESEARCH_SANDBOX=false

REACT_APP_UNITY_GAME_ID=production-game-id
REACT_APP_UNITY_PLACEMENT_ID=RewardedVideo
REACT_APP_UNITY_TEST_MODE=false
```

#### Step 2: Deploy Frontend
1. Build frontend: `cd client-new && npm run build`
2. Deploy to production server
3. Verify deployment

#### Step 3: Deploy Backend
1. Ensure backend is running on production
2. Verify database is connected
3. Verify reward endpoints are working

#### Step 4: Test Production
1. Log in to production app
2. Go to Rewards page
3. Test each ad network
4. Verify points are awarded
5. Check console for errors

#### Step 5: Monitor Live
1. Monitor ad impressions
2. Track revenue
3. Monitor user engagement
4. Track errors and issues
5. Respond to user feedback

### Metrics to Monitor
- Daily active users
- Ad impressions per day
- Completion rate
- Revenue per user
- User satisfaction
- Error rate

### Next: Ongoing optimization

---

## Option 5: Add More Ad Networks (Advanced)

### What You'll Do
Add additional ad networks to increase revenue and user options.

### Time Required
2-4 hours per network

### Potential Networks
- **Admob Interstitial Ads** - Full-screen ads between actions
- **AdGate** - Offer wall (users complete tasks for points)
- **Fyber** - Multiple ad networks in one
- **Vungle** - Video ads
- **AppLovin** - Video ads and interstitials
- **IronSource** - Multiple ad formats
- **Chartboost** - Video ads

### Steps for Each Network
1. Create account on ad network
2. Create app and get credentials
3. Create provider class in AdService.ts
4. Implement initialize() method
5. Implement showRewardedAd() or showSurvey() method
6. Add mock implementation
7. Add to AdService providers map
8. Add environment variables to .env
9. Test locally with mock
10. Test with real credentials
11. Monitor performance

### Example: Adding AdGate Offers
```typescript
class AdGateProvider implements AdProvider {
  name = 'adgate';
  private initialized = false;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initialize(): Promise<boolean> {
    // Load AdGate SDK
    // Return true if successful
  }

  async showRewardedAd(): Promise<AdResult> {
    // Show offer wall
    // Return result with reward amount
  }

  isReady(): boolean {
    return this.initialized;
  }
}
```

### Next: Ongoing optimization

---

## Timeline Recommendation

### Week 1
- [ ] Test locally with mock implementations
- [ ] Verify all 5 providers work
- [ ] Check console logs
- [ ] Earn test points

### Week 2
- [ ] Create accounts on ad networks
- [ ] Get test credentials
- [ ] Update .env with real credentials
- [ ] Test with real ads/surveys
- [ ] Monitor performance

### Week 3
- [ ] Collect user feedback
- [ ] Analyze performance metrics
- [ ] Optimize point values
- [ ] Optimize provider mix
- [ ] Plan production deployment

### Week 4
- [ ] Get production credentials
- [ ] Deploy to production
- [ ] Monitor live performance
- [ ] Respond to user feedback
- [ ] Plan next improvements

---

## Decision Tree

```
Start Here
    ↓
Want to test locally?
├─ YES → Go to Option 1 (Test Locally)
│         ↓
│         Works well?
│         ├─ YES → Go to Option 2 (Real Credentials)
│         └─ NO → Check troubleshooting guide
│
└─ NO → Go to Option 2 (Real Credentials)
        ↓
        Got credentials?
        ├─ YES → Update .env and test
        └─ NO → Create accounts first
        ↓
        Works well?
        ├─ YES → Go to Option 3 (Monitor)
        └─ NO → Check troubleshooting guide
        ↓
        Ready for production?
        ├─ YES → Go to Option 4 (Deploy)
        └─ NO → Go to Option 3 (Monitor)
        ↓
        Want more networks?
        ├─ YES → Go to Option 5 (Add Networks)
        └─ NO → Continue monitoring
```

---

## Troubleshooting

### Ads Not Showing
1. Check browser console (F12)
2. Verify .env file exists
3. Verify environment variables are set
4. Restart frontend
5. Hard refresh browser

### Points Not Awarded
1. Check backend logs
2. Verify daily earning limit
3. Check user tier
4. Verify reward completion sent

### Real Ads Not Loading
1. Verify credentials are correct
2. Check that test mode is enabled
3. Verify SDK URLs are correct
4. Check for CORS errors
5. Check network tab in DevTools

---

## Support Resources

- [Google AdMob Help](https://support.google.com/admob)
- [Pollfish Documentation](https://www.pollfish.com/docs)
- [TapResearch Documentation](https://docs.tapresearch.com)
- [Unity Ads Documentation](https://docs.unity.com/ads)

---

## Summary

You have multiple options for working with ad networks:

1. **Test Locally** (5-10 min) - Start here!
2. **Real Credentials** (30-60 min) - Optional upgrade
3. **Monitor & Optimize** (ongoing) - Improve performance
4. **Deploy to Production** (1-2 hours) - Go live
5. **Add More Networks** (2-4 hours each) - Increase revenue

Start with Option 1 to test locally, then decide if you want to upgrade to real credentials.

