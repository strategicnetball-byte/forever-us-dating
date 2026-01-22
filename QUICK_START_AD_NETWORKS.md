# Quick Start: Testing Ad Networks Locally

## TL;DR

Everything is already set up! You can test ad networks right now without creating any accounts.

### Start Testing Now

```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
cd client-new
npm start
```

Then:
1. Open http://localhost:3000
2. Log in to your account
3. Go to **Rewards** page
4. Click any "Watch" or "Start" button
5. See mock ads/surveys in action
6. Earn points

---

## What You'll See

### Video Ads (Mock)
- **AdMob**: 30-second countdown → +15 points
- **Unity**: 25-second countdown → +20 points
- **Facebook**: 20-second countdown → +18 points

### Surveys (Mock)
- **Pollfish**: 2 questions → +50 points
- **TapResearch**: 3 questions → +75 points

All mock implementations show realistic UI and countdown timers.

---

## Console Logs

Open DevTools (F12) → Console tab. You'll see:

```
✅ AdMob provider initialized
⚠️ Unity provider failed to initialize, using mock
⚠️ Pollfish provider failed to initialize, using mock
⚠️ TapResearch provider failed to initialize, using mock
⚠️ Facebook provider failed to initialize, using mock
Ad Service initialized with 5 ad providers and 2 survey providers
```

**This is normal!** The real SDKs aren't loading because we're using test credentials, so mock implementations are used instead.

---

## Upgrade to Real Credentials (Optional)

When you want real ads/surveys instead of mocks:

### 1. Create Accounts (Free)
- [Google AdMob](https://admob.google.com) - Video ads
- [Pollfish](https://www.pollfish.com) - Surveys
- [TapResearch](https://publisher.tapresearch.com) - Surveys
- [Unity Ads](https://dashboard.unity3d.com) - Video ads

### 2. Get Test Credentials
Each network provides test/sandbox credentials for development.

### 3. Update `.env` in `client-new` directory

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

### 4. Restart Frontend

```bash
# Kill frontend (Ctrl+C)
cd client-new
npm start
```

Hard refresh browser: **Ctrl+Shift+R**

---

## How It Works

### Mock Mode (Current)
- Real SDKs fail to load (expected with test credentials)
- Mock implementations show simulated UI
- Countdown timers and survey questions are realistic
- Points are awarded normally
- Perfect for testing without real ads

### Real Mode (After Adding Credentials)
- Real SDKs load successfully
- Real ads/surveys from ad networks appear
- Real completion times
- Real revenue generated
- Same point system works

---

## File Structure

```
client-new/
├── .env                          ← Environment variables (already configured)
├── src/
│   ├── services/
│   │   └── AdService.ts          ← All ad provider implementations
│   └── components/
│       └── Rewards/
│           └── Rewards.tsx       ← Rewards page (uses AdService)
```

---

## Testing Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Logged in to app
- [ ] Navigated to Rewards page
- [ ] Clicked "Watch" on a video ad
- [ ] Saw countdown timer
- [ ] Earned points
- [ ] Clicked "Start" on a survey
- [ ] Answered survey questions
- [ ] Earned points
- [ ] Checked console logs for provider initialization

---

## Troubleshooting

### Ads/Surveys Not Showing
1. Check browser console (F12)
2. Verify you're on Rewards page
3. Hard refresh (Ctrl+Shift+R)
4. Check that backend is running

### Points Not Awarded
1. Check backend logs
2. Verify user has daily earning limit remaining
3. Check that reward completion was sent to backend

### Console Shows Errors
1. This is normal with test credentials
2. Mock implementations will still work
3. Real ads will work after adding real credentials

---

## Next Steps

1. **Test locally** with mock implementations (right now!)
2. **Create accounts** on ad networks when ready
3. **Get test credentials** from each network
4. **Update .env** with real credentials
5. **Restart frontend** and test with real ads
6. **Monitor performance** and adjust point values

---

## Documentation

For detailed setup instructions, see:
- `AD_NETWORKS_LOCAL_TESTING.md` - Complete guide with all details
- `AD_NETWORKS_SETUP_GUIDE.md` - Original setup guide
- `REWARDS_TESTING_GUIDE.md` - How to test rewards system

---

## Support

All ad networks have free tiers:
- **AdMob**: Free with limited impressions
- **Pollfish**: Free surveys available
- **TapResearch**: Free surveys available
- **Unity Ads**: Free with limited impressions

Perfect for testing and small-scale deployments!

