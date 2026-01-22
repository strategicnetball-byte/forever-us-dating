# Ad Networks Local Testing Guide

This guide explains how to test the ad networks locally with mock implementations, and how to upgrade to real credentials when ready.

## Current Status

✅ **All ad networks are already implemented with mock fallbacks**
- AdMob (Google) - Video ads
- Pollfish - Surveys
- TapResearch - Surveys  
- Unity Ads - Interactive video ads
- Facebook Audience Network - Video ads

The system automatically falls back to mock implementations if real SDKs fail to load, so you can test everything locally without real credentials.

---

## Testing Locally (No Real Credentials Needed)

### Step 1: Verify Environment Variables

The `.env` file in `client-new` directory is already configured with test values:

```bash
# AdMob Configuration (Google)
REACT_APP_ADMOB_AD_UNIT_ID=ca-app-pub-3940256099942544/5224354917
REACT_APP_ADMOB_TEST_DEVICE_ID=33BE2250B43518CCDA7DE426D04EE232

# Pollfish Configuration (Surveys)
REACT_APP_POLLFISH_API_KEY=test-pollfish-key-local-dev
REACT_APP_POLLFISH_TEST_MODE=true

# TapResearch Configuration (Surveys)
REACT_APP_TAPRESEARCH_TOKEN=pub_test_tapresearch_local_dev
REACT_APP_TAPRESEARCH_SANDBOX=true

# Unity Ads Configuration
REACT_APP_UNITY_GAME_ID=test-game-id-local
REACT_APP_UNITY_PLACEMENT_ID=RewardedVideo
REACT_APP_UNITY_TEST_MODE=true

# Facebook Audience Network
REACT_APP_FB_PLACEMENT_ID=test-placement-local
```

### Step 2: Start the Frontend

```bash
cd client-new
npm start
```

The app will start on `http://localhost:3000`

### Step 3: Test Ad Networks

1. **Log in** to the app
2. Navigate to **Rewards** page
3. You'll see mock implementations of:
   - **Video Ads**: AdMob, Unity, Facebook (30-second simulated videos)
   - **Surveys**: Pollfish, TapResearch (simulated survey questions)

### Step 4: Watch Console Logs

Open browser DevTools (F12) and check the Console tab. You'll see:

```
✅ AdMob provider initialized
⚠️ Unity provider failed to initialize, using mock
⚠️ Pollfish provider failed to initialize, using mock
⚠️ TapResearch provider failed to initialize, using mock
⚠️ Facebook provider failed to initialize, using mock
Ad Service initialized with 5 ad providers and 2 survey providers
```

This is **normal and expected** - the real SDKs aren't loading because we're using test credentials, so the mock implementations are being used instead.

### Step 5: Test Each Network

#### Test AdMob Video
1. Click "Watch" on any AdMob video in Rewards
2. See 30-second countdown
3. Earn 15 points
4. Check console for logs

#### Test Pollfish Survey
1. Click "Start" on any Pollfish survey
2. Answer 2 survey questions
3. Earn 50 points
4. Check console for logs

#### Test TapResearch Survey
1. Click "Start" on any TapResearch survey
2. Answer 3 survey questions
3. Earn 75 points
4. Check console for logs

#### Test Unity Ads
1. Click "Watch" on any Unity video
2. See 25-second countdown with interactive styling
3. Earn 20 points
4. Check console for logs

#### Test Facebook Ads
1. Click "Watch" on any Facebook video
2. See 20-second countdown
3. Earn 18 points
4. Check console for logs

---

## Upgrading to Real Credentials

When you're ready to use real ad networks, follow these steps:

### 1. Google AdMob (Video Ads)

#### Create Account
1. Go to [AdMob Console](https://admob.google.com)
2. Sign in with Google account
3. Click "Get Started"

#### Create App & Ad Unit
1. Click "Apps" → "Add App"
2. Select platform (Android/iOS/Web)
3. Name: "Forever Us Dating App"
4. Click "Create"
5. Go to "Ad Units" → "Create Ad Unit"
6. Select "Rewarded"
7. Name: "Video Reward Ad"
8. Copy the **Ad Unit ID** (format: `ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy`)

#### Get Test Device ID
1. Go to "Settings" → "Test Devices"
2. Add your device ID
3. Copy the ID

#### Update .env
```bash
REACT_APP_ADMOB_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
REACT_APP_ADMOB_TEST_DEVICE_ID=your-test-device-id
```

### 2. Pollfish (Surveys)

#### Create Account
1. Go to [Pollfish Dashboard](https://www.pollfish.com/dashboard)
2. Click "Sign Up"
3. Verify email

#### Create App
1. Go to "Apps" → "Add New App"
2. Name: "Forever Us Dating App"
3. Platform: "Web"
4. Click "Create"

#### Get API Key
1. Click on your app
2. Go to "Settings"
3. Copy the **API Key**

#### Enable Test Mode
1. Toggle "Test Mode" ON in app settings

#### Update .env
```bash
REACT_APP_POLLFISH_API_KEY=your-api-key
REACT_APP_POLLFISH_TEST_MODE=true
```

### 3. TapResearch (Surveys)

#### Create Account
1. Go to [TapResearch Publisher Dashboard](https://publisher.tapresearch.com)
2. Click "Sign Up"
3. Verify email

#### Create App
1. Go to "Apps" → "Create New App"
2. Name: "Forever Us Dating App"
3. Platform: "Web"
4. Click "Create"

#### Get API Token
1. Click on your app
2. Go to "Settings" or "API"
3. Copy the **API Token** (format: `pub_xxxxxxxxxxxxxxxxxxxxxxxx`)

#### Enable Sandbox Mode
1. Toggle "Sandbox Mode" ON in app settings

#### Update .env
```bash
REACT_APP_TAPRESEARCH_TOKEN=pub_xxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_TAPRESEARCH_SANDBOX=true
```

### 4. Unity Ads (Video Ads)

#### Create Account
1. Go to [Unity Dashboard](https://dashboard.unity3d.com)
2. Sign in or create account

#### Create Organization & Project
1. Create an organization
2. Create a project
3. Name: "Forever Us Dating App"

#### Get Game ID
1. Go to "Monetization" → "Unity Ads"
2. Enable "Unity Ads"
3. Copy your **Game ID**

#### Create Ad Placement
1. Go to "Monetization" → "Ad Placements"
2. Click "Create Placement"
3. Name: "RewardedVideo"
4. Type: "Rewarded"
5. Copy the **Placement ID**

#### Update .env
```bash
REACT_APP_UNITY_GAME_ID=your-game-id
REACT_APP_UNITY_PLACEMENT_ID=RewardedVideo
REACT_APP_UNITY_TEST_MODE=true
```

### 5. Restart Frontend

After updating .env:

```bash
# Kill the running frontend (Ctrl+C)
# Then restart:
cd client-new
npm start
```

Hard refresh browser: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

---

## How It Works

### Mock Implementation Flow

1. **AdService initializes** all providers
2. **Each provider tries to load** its real SDK
3. **If SDK fails to load**, provider falls back to mock implementation
4. **Mock implementation shows** simulated UI (countdown, survey questions, etc.)
5. **User completes mock ad/survey** and earns points
6. **Points are awarded** via backend API

### Real Implementation Flow

1. **AdService initializes** all providers
2. **Each provider loads** its real SDK
3. **Real SDK is ready** and provider is marked as ready
4. **User clicks ad/survey** and real SDK shows real ad/survey
5. **User completes real ad/survey** and earns points
6. **Points are awarded** via backend API

### Key Difference

- **Mock**: Shows simulated UI, no real ads/surveys, instant completion
- **Real**: Shows real ads/surveys from ad networks, real completion times, real revenue

---

## Testing Checklist

### Local Testing (Mock)
- [ ] AdMob video shows 30-second countdown
- [ ] Pollfish survey shows 2 questions
- [ ] TapResearch survey shows 3 questions
- [ ] Unity video shows 25-second countdown
- [ ] Facebook video shows 20-second countdown
- [ ] Points are awarded after completion
- [ ] Console shows provider initialization logs
- [ ] No errors in browser console

### Real Credentials Testing
- [ ] Created accounts on all 4 networks
- [ ] Got API keys/tokens for each network
- [ ] Updated .env with real credentials
- [ ] Restarted frontend
- [ ] Hard refreshed browser
- [ ] AdMob shows real test ads
- [ ] Pollfish shows real test surveys
- [ ] TapResearch shows real test surveys
- [ ] Unity shows real test ads
- [ ] Points are awarded correctly
- [ ] No errors in browser console

---

## Troubleshooting

### "Provider not available" Error
- Check that environment variables are set in `client-new/.env`
- Restart frontend after changing .env
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for specific errors

### Ads/Surveys Not Showing
- Verify test mode is enabled in each network's dashboard
- Check that API keys/tokens are correct
- Ensure you're using a test device (for AdMob)
- Check network tab in browser dev tools for failed requests

### Points Not Awarding
- Check backend logs for errors
- Verify user has enough daily earning limit
- Check that reward completion is being sent to backend
- Verify database is recording rewards

### Console Shows "Failed to Initialize"
- This is normal with test credentials
- Mock implementation will be used instead
- Real ads/surveys will still work with real credentials

---

## Production Deployment

When ready to deploy to production:

1. **Get Production Credentials**
   - AdMob: Real Ad Unit IDs from production app
   - Pollfish: Production API key
   - TapResearch: Production token
   - Unity: Production Game ID

2. **Update .env**
   - Replace test credentials with production ones
   - Set test mode flags to `false`

3. **Deploy**
   - Push to production server
   - Monitor ad performance and revenue

4. **Monitor**
   - Track ad impressions and clicks
   - Monitor user earnings
   - Check revenue reports in each network's dashboard

---

## Free Tier Limits

Each network has free tier limits:

- **AdMob**: Free, limited impressions until revenue threshold
- **Pollfish**: Free surveys available, limited inventory
- **TapResearch**: Free surveys available, limited inventory
- **Unity Ads**: Free, limited impressions

For a dating app with moderate traffic, free tiers should be sufficient initially.

---

## Support Resources

- [AdMob Help](https://support.google.com/admob)
- [Pollfish Documentation](https://www.pollfish.com/docs)
- [TapResearch Documentation](https://docs.tapresearch.com)
- [Unity Ads Documentation](https://docs.unity.com/ads)

---

## Summary

**Current State**: All ad networks are working with mock implementations. You can test everything locally without real credentials.

**Next Steps**:
1. Test the Rewards page locally to verify mock implementations work
2. When ready, create accounts on each ad network
3. Get test credentials from each network
4. Update `.env` file with real credentials
5. Restart frontend and test with real ads/surveys
6. Monitor console logs and user feedback
7. Adjust point values as needed

