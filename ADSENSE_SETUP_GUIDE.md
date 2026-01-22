# AdSense/AdMob Setup Guide for Forever Us

## Your Account Information

✅ **Publisher ID**: pub-1497360981430251
✅ **AdSense Customer ID**: 363-006-2612
✅ **Status**: Ready to configure

---

## Next Steps: Get Your Ad Unit IDs

Your publisher ID and customer ID are now configured in the `.env` file. Now you need to get your **Ad Unit IDs** from the AdMob dashboard.

### Step 1: Go to AdMob Dashboard
```
1. Open browser
2. Go to admob.google.com
3. Sign in with your Google account
4. You should see your account with publisher ID: pub-1497360981430251
```

### Step 2: Create Ad Units

#### Banner Ad Unit
```
1. Click "Ad units" in left menu
2. Click "Create ad unit"
3. Choose format: "Banner"
4. Name: "Browse Banner" (or any name)
5. Click "Create"
6. Copy the ad unit ID (looks like: ca-app-pub-1497360981430251~1234567890)
7. Paste into .env as REACT_APP_ADMOB_BANNER_AD_UNIT_ID
```

#### Native Ad Unit
```
1. Click "Create ad unit" again
2. Choose format: "Native"
3. Name: "Browse Native"
4. Click "Create"
5. Copy the ad unit ID
6. Paste into .env as REACT_APP_ADMOB_NATIVE_AD_UNIT_ID
```

#### Interstitial Ad Unit (Optional)
```
1. Click "Create ad unit" again
2. Choose format: "Interstitial"
3. Name: "Interstitial"
4. Click "Create"
5. Copy the ad unit ID
6. Paste into .env as REACT_APP_ADMOB_INTERSTITIAL_AD_UNIT_ID
```

---

## Update .env File

After getting your ad unit IDs, update `.env`:

```
REACT_APP_ADMOB_CLIENT_ID=pub-1497360981430251
REACT_APP_ADSENSE_CUSTOMER_ID=363-006-2612
REACT_APP_ADMOB_BANNER_AD_UNIT_ID=ca-app-pub-1497360981430251~YOUR_BANNER_ID
REACT_APP_ADMOB_NATIVE_AD_UNIT_ID=ca-app-pub-1497360981430251~YOUR_NATIVE_ID
REACT_APP_ADMOB_INTERSTITIAL_AD_UNIT_ID=ca-app-pub-1497360981430251~YOUR_INTERSTITIAL_ID
```

---

## Current Status

✅ **Configured in Code**:
- Publisher ID: pub-1497360981430251
- AdSense Customer ID: 363-006-2612
- Ad network service updated
- Components ready to use

⏳ **Still Needed**:
- Ad Unit IDs from AdMob dashboard
- Update .env with ad unit IDs
- Test ads display

---

## Testing

### Test Mode (Before Going Live)

Use these test ad unit IDs while developing:

```
REACT_APP_ADMOB_BANNER_AD_UNIT_ID=ca-app-pub-3940256099942544~6300978111
REACT_APP_ADMOB_NATIVE_AD_UNIT_ID=ca-app-pub-3940256099942544~7563493193
REACT_APP_ADMOB_INTERSTITIAL_AD_UNIT_ID=ca-app-pub-3940256099942544~1033173712
```

These are Google's test ad unit IDs - they won't earn money but will show test ads.

### Production Mode (When Ready)

Replace test IDs with your real ad unit IDs from AdMob dashboard.

---

## Integration Steps

### 1. Get Ad Unit IDs (15 min)
- [ ] Go to admob.google.com
- [ ] Create banner ad unit
- [ ] Create native ad unit
- [ ] Copy ad unit IDs

### 2. Update .env (5 min)
- [ ] Add ad unit IDs to .env
- [ ] Save file

### 3. Add to Pages (1-2 hours)
- [ ] Add AdBanner to Browse page
- [ ] Add AdBanner to Dashboard page
- [ ] Add AdBanner to Messages page
- [ ] Add AdBanner to Profile page
- [ ] Add AdBanner to Rewards page

### 4. Test (30 min)
- [ ] Run app
- [ ] Log in as free tier user
- [ ] Verify ads display
- [ ] Test dismiss button
- [ ] Check console for errors

### 5. Deploy (30 min)
- [ ] Deploy to production
- [ ] Monitor ads
- [ ] Check analytics

---

## Quick Reference

### Your IDs
```
Publisher ID: pub-1497360981430251
Customer ID: 363-006-2612
```

### Ad Unit ID Format
```
ca-app-pub-1497360981430251~XXXXXXXXXX
```

### Environment Variables
```
REACT_APP_ADMOB_CLIENT_ID
REACT_APP_ADSENSE_CUSTOMER_ID
REACT_APP_ADMOB_BANNER_AD_UNIT_ID
REACT_APP_ADMOB_NATIVE_AD_UNIT_ID
REACT_APP_ADMOB_INTERSTITIAL_AD_UNIT_ID
```

---

## Troubleshooting

### Ads Not Showing
1. Check ad unit IDs are correct
2. Verify .env file is saved
3. Restart development server
4. Check browser console for errors
5. Verify user is free tier

### Wrong Publisher ID
- Don't worry, it's already configured
- Just need to add ad unit IDs

### Ad Unit IDs Not Found
1. Go to admob.google.com
2. Make sure you're logged in
3. Check "Ad units" section
4. Create new ad units if needed

---

## Next: Add to Pages

Once you have your ad unit IDs in .env, follow the integration guide:

**See**: COMPLETE_IMPLEMENTATION_GUIDE.md

Quick example:
```typescript
import AdBanner from '../AdBanner/AdBanner';

// Add at end of component:
<AdBanner pageId="browse" position="bottom" />
```

---

## Support

Questions? Check:
1. COMPLETE_IMPLEMENTATION_GUIDE.md
2. AD_INTEGRATION_GUIDE.md
3. EXAMPLE_BROWSE_INTEGRATION.tsx

---

## Summary

✅ **Your account is configured**
- Publisher ID: pub-1497360981430251
- Customer ID: 363-006-2612
- Code updated with your IDs

⏳ **Next step**: Get ad unit IDs from AdMob dashboard and add to .env

**Time to complete**: 15 minutes to get ad unit IDs, then 2-3 hours to integrate into app.
