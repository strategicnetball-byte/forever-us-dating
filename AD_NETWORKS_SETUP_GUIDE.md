# Ad Networks Setup Guide - Test Mode Integration

This guide walks you through setting up real ad networks in test/sandbox mode for local development.

## Overview

All four ad networks support test/sandbox modes, allowing you to develop and test without real ads or payments.

---

## 1. Google AdMob (Video Ads)

### What It Is
Google's mobile ad network. Provides rewarded video ads that users watch to earn points.

### Setup Steps

#### Step 1: Create Google AdMob Account
1. Go to [AdMob Console](https://admob.google.com)
2. Sign in with your Google account (create one if needed)
3. Click "Get Started"
4. Accept terms and create your AdMob account

#### Step 2: Create an App
1. In AdMob console, click "Apps" → "Add App"
2. Select "Android" or "iOS" (or Web for testing)
3. Enter app name: "Forever Us Dating App"
4. Click "Create"

#### Step 3: Create Ad Unit
1. Click "Ad Units" → "Create Ad Unit"
2. Select "Rewarded"
3. Name it: "Video Reward Ad"
4. Copy the **Ad Unit ID** (looks like: `ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy`)

#### Step 4: Get Test Device ID
1. In AdMob console, go to "Settings" → "Test Devices"
2. Add your device:
   - For web: Use `33BE2250B43518CCDA7DE426D04EE232` (test device ID)
3. Copy this ID

#### Step 5: Add to .env
```bash
REACT_APP_ADMOB_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
REACT_APP_ADMOB_TEST_DEVICE_ID=33BE2250B43518CCDA7DE426D04EE232
```

#### Step 6: Enable Test Mode in Code
The AdService already handles test mode. Just ensure you're using the test device ID.

### Testing
- Videos will show as test ads (marked with "Test Ad" label)
- No real revenue generated
- Rewards still work normally

---

## 2. Pollfish (Surveys)

### What It Is
Survey platform. Users complete surveys to earn points. Pollfish has many survey opportunities.

### Setup Steps

#### Step 1: Create Pollfish Account
1. Go to [Pollfish Dashboard](https://www.pollfish.com/dashboard)
2. Click "Sign Up"
3. Fill in details and verify email
4. Create account

#### Step 2: Create App
1. In Pollfish dashboard, go to "Apps"
2. Click "Add New App"
3. Name: "Forever Us Dating App"
4. Platform: "Web"
5. Click "Create"

#### Step 3: Get API Key
1. Click on your app
2. Go to "Settings"
3. Copy the **API Key** (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

#### Step 4: Enable Test Mode
1. In app settings, toggle "Test Mode" ON
2. This ensures you get test surveys, not real ones

#### Step 5: Add to .env
```bash
REACT_APP_POLLFISH_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REACT_APP_POLLFISH_TEST_MODE=true
```

#### Step 6: Update AdService
The AdService already supports Pollfish. Test surveys will appear in the Rewards page.

### Testing
- You'll see test surveys (marked as test)
- No real survey data collected
- Rewards work normally
- Surveys complete instantly in test mode

---

## 3. TapResearch (Surveys)

### What It Is
Another survey platform with different survey inventory. Good to have multiple sources.

### Setup Steps

#### Step 1: Create TapResearch Account
1. Go to [TapResearch Publisher Dashboard](https://publisher.tapresearch.com)
2. Click "Sign Up"
3. Fill in publisher details
4. Verify email

#### Step 2: Create App
1. In dashboard, go to "Apps"
2. Click "Create New App"
3. Name: "Forever Us Dating App"
4. Platform: "Web"
5. Click "Create"

#### Step 3: Get API Token
1. Click on your app
2. Go to "Settings" or "API"
3. Copy the **API Token** (looks like: `pub_xxxxxxxxxxxxxxxxxxxxxxxx`)

#### Step 4: Enable Sandbox Mode
1. In app settings, toggle "Sandbox Mode" ON
2. This uses test surveys

#### Step 5: Add to .env
```bash
REACT_APP_TAPRESEARCH_TOKEN=pub_xxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_TAPRESEARCH_SANDBOX=true
```

#### Step 6: Update AdService
The AdService already supports TapResearch. Test surveys will appear.

### Testing
- Sandbox surveys appear (test data)
- No real survey responses
- Rewards work normally

---

## 4. Unity Ads (Video Ads)

### What It Is
Unity's ad network. Provides interactive video ads and rewarded videos.

### Setup Steps

#### Step 1: Create Unity Account
1. Go to [Unity Dashboard](https://dashboard.unity3d.com)
2. Click "Sign Up" or sign in
3. Create/verify account

#### Step 2: Create Organization
1. In Unity Dashboard, create an organization
2. Name: "Forever Us"

#### Step 3: Create Project
1. Go to "Projects"
2. Click "Create Project"
3. Name: "Forever Us Dating App"
4. Select "2D" template (doesn't matter for web)
5. Create

#### Step 4: Get Game ID
1. In project settings, go to "Monetization"
2. Enable "Unity Ads"
3. Copy your **Game ID** (looks like: `1234567`)

#### Step 5: Create Ad Placement
1. Go to "Monetization" → "Ad Placements"
2. Click "Create Placement"
3. Name: "RewardedVideo"
4. Type: "Rewarded"
5. Copy the **Placement ID**

#### Step 6: Add to .env
```bash
REACT_APP_UNITY_GAME_ID=1234567
REACT_APP_UNITY_PLACEMENT_ID=RewardedVideo
REACT_APP_UNITY_TEST_MODE=true
```

#### Step 7: Update AdService
The AdService already supports Unity. Test ads will appear.

### Testing
- Test ads show (marked as test)
- No real revenue
- Rewards work normally

---

## Complete .env Configuration

Create or update your `.env` file in the `client-new` directory:

```bash
# AdMob Configuration
REACT_APP_ADMOB_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
REACT_APP_ADMOB_TEST_DEVICE_ID=33BE2250B43518CCDA7DE426D04EE232

# Pollfish Configuration
REACT_APP_POLLFISH_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REACT_APP_POLLFISH_TEST_MODE=true

# TapResearch Configuration
REACT_APP_TAPRESEARCH_TOKEN=pub_xxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_TAPRESEARCH_SANDBOX=true

# Unity Ads Configuration
REACT_APP_UNITY_GAME_ID=1234567
REACT_APP_UNITY_PLACEMENT_ID=RewardedVideo
REACT_APP_UNITY_TEST_MODE=true
```

---

## Testing Checklist

After setting up all networks:

### 1. Verify Environment Variables
```bash
# In client-new directory
echo $REACT_APP_ADMOB_AD_UNIT_ID
echo $REACT_APP_POLLFISH_API_KEY
echo $REACT_APP_TAPRESEARCH_TOKEN
echo $REACT_APP_UNITY_GAME_ID
```

### 2. Restart Frontend
```bash
# Kill the running frontend
# Then restart:
cd client-new
npm start
```

### 3. Test Each Network

#### Test AdMob Video
1. Go to Rewards page
2. Click "Watch" on any AdMob video
3. Should show 30-second test ad
4. Earn points

#### Test Pollfish Survey
1. Go to Rewards page
2. Click "Start" on any Pollfish survey
3. Should show test survey questions
4. Complete and earn points

#### Test TapResearch Survey
1. Go to Rewards page
2. Click "Start" on any TapResearch survey
3. Should show test survey questions
4. Complete and earn points

#### Test Unity Ads
1. Go to Rewards page
2. Click "Watch" on any Unity video
3. Should show interactive test ad
4. Earn points

---

## Troubleshooting

### "Provider not available" Error
- Check that environment variables are set correctly
- Restart the frontend after adding .env variables
- Check browser console for specific errors

### Ads Not Loading
- Verify test mode is enabled in each network's dashboard
- Check that API keys/IDs are correct
- Ensure you're on a test device (for AdMob)
- Check network tab in browser dev tools

### Surveys Not Appearing
- Verify sandbox/test mode is enabled
- Check that API tokens are correct
- Ensure you're in the correct region for surveys
- Some surveys may not be available in all regions

### Points Not Awarding
- Check backend logs for errors
- Verify user has enough daily earning limit
- Check that reward completion is being sent to backend
- Verify database is recording rewards

---

## Moving to Production

When ready to go live:

1. **Get Real Credentials**
   - AdMob: Real Ad Unit IDs from production app
   - Pollfish: Production API key
   - TapResearch: Production token
   - Unity: Production Game ID

2. **Update .env**
   - Replace test credentials with production ones
   - Remove test mode flags

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

- **AdMob**: Free, but limited impressions until you reach revenue threshold
- **Pollfish**: Free surveys available, but limited inventory
- **TapResearch**: Free surveys available, but limited inventory
- **Unity Ads**: Free, but limited impressions

For a dating app with moderate traffic, free tiers should be sufficient initially.

---

## Support Resources

- [AdMob Help](https://support.google.com/admob)
- [Pollfish Documentation](https://www.pollfish.com/docs)
- [TapResearch Documentation](https://docs.tapresearch.com)
- [Unity Ads Documentation](https://docs.unity.com/ads)

---

## Next Steps

1. Create accounts for each network
2. Get test credentials
3. Add to .env file
4. Restart frontend
5. Test each network on Rewards page
6. Monitor console for any errors
7. Adjust point values as needed based on user feedback
