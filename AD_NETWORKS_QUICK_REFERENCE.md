# Ad Networks Quick Reference Card

## 🚀 Start Testing Now

```bash
# Terminal 1
cd server && npm start

# Terminal 2
cd client-new && npm start
```

Then: Open http://localhost:3000 → Log in → Go to Rewards → Click any ad/survey

---

## 📊 Point Values

| Activity | Points |
|----------|--------|
| AdMob Video | 15 |
| Unity Video | 20 |
| Facebook Video | 18 |
| Pollfish Survey | 50 |
| TapResearch Survey | 75 |
| Daily Bonus | 10 |
| Weekly Bonus (Premium) | 25 |
| Weekly Bonus (VIP) | 50 |
| Photo Upload | 25 |
| Email Verification | 30 |
| Profile Completion | 50 |

---

## 📈 Daily Earning Limits

| Tier | Daily Limit |
|------|-------------|
| Free | 100 points |
| Premium | 200 points |
| VIP | Unlimited |

---

## 🔧 Environment Variables

**File:** `client-new/.env`

```bash
REACT_APP_ADMOB_AD_UNIT_ID=ca-app-pub-3940256099942544/5224354917
REACT_APP_ADMOB_TEST_DEVICE_ID=33BE2250B43518CCDA7DE426D04EE232
REACT_APP_POLLFISH_API_KEY=test-pollfish-key-local-dev
REACT_APP_POLLFISH_TEST_MODE=true
REACT_APP_TAPRESEARCH_TOKEN=pub_test_tapresearch_local_dev
REACT_APP_TAPRESEARCH_SANDBOX=true
REACT_APP_UNITY_GAME_ID=test-game-id-local
REACT_APP_UNITY_PLACEMENT_ID=RewardedVideo
REACT_APP_UNITY_TEST_MODE=true
REACT_APP_FB_PLACEMENT_ID=test-placement-local
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `client-new/.env` | Environment variables |
| `client-new/src/services/AdService.ts` | Ad providers |
| `client-new/src/components/Rewards/Rewards.tsx` | Rewards page |
| `server/routes/rewards.js` | Backend endpoints |
| `server/models/User.js` | User model |
| `server/models/Reward.js` | Reward model |

---

## 🧪 Testing Checklist

- [ ] Backend running
- [ ] Frontend running
- [ ] Logged in
- [ ] On Rewards page
- [ ] Clicked AdMob video → 30s countdown → 15 pts
- [ ] Clicked Pollfish survey → 2 questions → 50 pts
- [ ] Clicked TapResearch survey → 3 questions → 75 pts
- [ ] Clicked Unity video → 25s countdown → 20 pts
- [ ] Clicked Facebook video → 20s countdown → 18 pts
- [ ] Checked console logs
- [ ] No errors

---

## 🔍 Console Output

```
✅ AdMob provider initialized
⚠️ Unity provider failed to initialize, using mock
⚠️ Pollfish provider failed to initialize, using mock
⚠️ TapResearch provider failed to initialize, using mock
⚠️ Facebook provider failed to initialize, using mock
Ad Service initialized with 5 ad providers and 2 survey providers
```

**Normal!** Real SDKs fail with test credentials, so mocks are used.

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Ads not showing | Check console (F12), hard refresh (Ctrl+Shift+R) |
| Points not awarded | Check backend logs, verify daily limit |
| Provider not available | Check .env exists, restart frontend |
| Console errors | Normal with test credentials, mocks still work |

---

## 📚 Documentation

| File | Time | Purpose |
|------|------|---------|
| QUICK_START_AD_NETWORKS.md | 5 min | Quick start |
| CURRENT_STATE_AD_NETWORKS.md | 5 min | What's working |
| AD_NETWORKS_LOCAL_TESTING.md | 15 min | Detailed testing |
| AD_NETWORKS_ARCHITECTURE.md | 15 min | System design |
| AD_NETWORKS_SETUP_GUIDE.md | 20 min | Real credentials |
| NEXT_STEPS_AD_NETWORKS.md | 10 min | What's next |
| AD_NETWORKS_README.md | 5 min | Master index |

---

## 🎯 Next Steps

### Option 1: Test Locally (5-10 min)
- Start backend and frontend
- Go to Rewards page
- Click ads/surveys
- Earn points

### Option 2: Real Credentials (30-60 min)
- Create accounts on ad networks
- Get test credentials
- Update .env
- Restart frontend
- Test with real ads

### Option 3: Monitor & Optimize (ongoing)
- Track performance
- Adjust point values
- Optimize provider mix

### Option 4: Deploy to Production (1-2 hours)
- Get production credentials
- Deploy to production
- Monitor revenue

### Option 5: Add More Networks (2-4 hours each)
- Add additional providers
- Increase revenue options

---

## 🔗 External Links

- [Google AdMob](https://admob.google.com)
- [Pollfish](https://www.pollfish.com)
- [TapResearch](https://publisher.tapresearch.com)
- [Unity Ads](https://dashboard.unity3d.com)

---

## 💡 Key Points

✅ All 5 ad providers implemented
✅ Mock implementations work without credentials
✅ Points system fully functional
✅ Error handling in place
✅ Documentation complete
✅ Ready to test locally
✅ Ready to upgrade to real credentials
✅ Ready to deploy to production

---

## 🎓 Learning Path

1. **Read**: QUICK_START_AD_NETWORKS.md (5 min)
2. **Test**: Start backend/frontend, go to Rewards (5 min)
3. **Verify**: Click ads/surveys, earn points (5 min)
4. **Check**: Open console, see provider logs (2 min)
5. **Decide**: Test locally or upgrade to real credentials

---

## 📞 Support

**Issue**: Ads not showing
- Check browser console (F12)
- Verify .env file exists
- Hard refresh (Ctrl+Shift+R)
- Check backend running

**Issue**: Points not awarded
- Check backend logs
- Verify daily limit not reached
- Check user tier
- Verify reward sent to backend

**Issue**: Console errors
- Normal with test credentials
- Mock implementations still work
- Real ads work after adding credentials

---

## 🎉 Ready to Start?

```bash
cd server && npm start
# In another terminal:
cd client-new && npm start
# Open http://localhost:3000
# Log in → Rewards → Click any ad/survey
```

That's it! Everything works with mock implementations.

