# In-App Advertising Integration Guide

## Overview

This guide explains how to integrate the non-intrusive in-app advertising system into your Forever Us app.

## Components Created

### 1. AdNetworkService (`client-new/src/services/AdNetworkService.ts`)
- Manages ad network configuration
- Handles ad placement logic
- Loads AdMob scripts
- Enforces frequency caps

### 2. AdBanner Component (`client-new/src/components/AdBanner/AdBanner.tsx`)
- Displays banner ads at bottom/top of pages
- Only shows to free tier users
- Dismissible with close button
- Respects frequency limits

### 3. NativeAd Component (`client-new/src/components/NativeAd/NativeAd.tsx`)
- Displays contextual native ads
- Styled to match app design
- Includes sponsored label
- Dismissible

### 4. AdManager Component (`client-new/src/components/AdManager/AdManager.tsx`)
- Orchestrates ad placement
- Manages multiple ad types
- Handles tier-based logic

### 5. useAds Hook (`client-new/src/hooks/useAds.ts`)
- Fetches ad configuration
- Tracks impressions, clicks, dismissals
- Provides ad data to components

### 6. Backend Routes (`server/routes/ads.js`)
- `/api/ads/config` - Get ad configuration for user
- `/api/ads/native-ads` - Get available native ads
- `/api/ads/impression` - Track ad impression
- `/api/ads/click` - Track ad click
- `/api/ads/dismiss` - Track ad dismissal

---

## Integration Steps

### Step 1: Add AdBanner to Pages

Add the AdBanner component to the bottom of pages where you want banner ads:

```typescript
import AdBanner from '../AdBanner/AdBanner';

const BrowsePage: React.FC = () => {
  return (
    <div className="browse-page">
      {/* Page content */}
      <AdBanner pageId="browse" position="bottom" />
    </div>
  );
};
```

### Step 2: Add Native Ads to Pages

Use the useAds hook to fetch and display native ads:

```typescript
import { useAds } from '../../hooks/useAds';
import AdManager from '../AdManager/AdManager';

const BrowsePage: React.FC = () => {
  const { nativeAds, shouldShowNativeAds } = useAds('browse');

  return (
    <div className="browse-page">
      {/* Page content */}
      
      <AdManager
        pageId="browse"
        showBanner={true}
        showNativeAds={shouldShowNativeAds}
        nativeAds={nativeAds}
      />
    </div>
  );
};
```

### Step 3: Track Ad Interactions

Use the tracking functions from useAds hook:

```typescript
const { trackImpression, trackClick, trackDismissal } = useAds('browse');

// Track when ad is shown
useEffect(() => {
  trackImpression('ad-id', 'banner');
}, []);

// Track when user clicks ad
const handleAdClick = () => {
  trackClick('ad-id', 'banner');
};

// Track when user dismisses ad
const handleAdDismiss = () => {
  trackDismissal('ad-id', 'banner');
};
```

---

## Page-by-Page Integration

### Browse Page
```typescript
import AdBanner from '../AdBanner/AdBanner';
import AdManager from '../AdManager/AdManager';
import { useAds } from '../../hooks/useAds';

const Browse: React.FC = () => {
  const { nativeAds, shouldShowNativeAds } = useAds('browse');

  return (
    <div className="browse-page">
      {/* Existing browse content */}
      
      <AdManager
        pageId="browse"
        showBanner={true}
        showNativeAds={shouldShowNativeAds}
        nativeAds={nativeAds}
      />
    </div>
  );
};
```

### Dashboard Page
```typescript
import AdBanner from '../AdBanner/AdBanner';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      {/* Existing dashboard content */}
      
      <AdBanner pageId="dashboard" position="bottom" />
    </div>
  );
};
```

### Messages Page
```typescript
import AdBanner from '../AdBanner/AdBanner';

const Messages: React.FC = () => {
  return (
    <div className="messages-page">
      {/* Existing messages content */}
      
      <AdBanner pageId="messages" position="bottom" />
    </div>
  );
};
```

### Profile Page
```typescript
import AdBanner from '../AdBanner/AdBanner';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      {/* Existing profile content */}
      
      <AdBanner pageId="profile" position="bottom" />
    </div>
  );
};
```

### Rewards Page
```typescript
import AdBanner from '../AdBanner/AdBanner';

const Rewards: React.FC = () => {
  return (
    <div className="rewards-page">
      {/* Existing rewards content */}
      
      <AdBanner pageId="rewards" position="bottom" />
    </div>
  );
};
```

---

## Configuration

### Ad Placement Configuration

Edit `client-new/src/services/AdNetworkService.ts` to customize placements:

```typescript
private initializePlacements() {
  this.adPlacements.set('browse', {
    id: 'browse-banner',
    type: 'banner',
    location: 'bottom',
    frequency: 2,  // Max 2 ads per page
    enabled: true
  });
  
  // Add more placements as needed
}
```

### Tier-Based Ad Display

Ads are automatically hidden for premium/VIP users. To customize:

```typescript
// In AdBanner.tsx or NativeAd.tsx
if (!user || user.membership.tier !== 'free') {
  return null;  // Don't show ads
}
```

### Ad Network Configuration

Set environment variables in `.env`:

```
REACT_APP_ADMOB_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
REACT_APP_ADMOB_BANNER_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
REACT_APP_ADMOB_NATIVE_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
REACT_APP_ADMOB_INTERSTITIAL_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
```

---

## Native Ads Customization

Edit `server/routes/ads.js` to customize native ads:

```javascript
const nativeAds = [
  {
    id: 'native-premium-1',
    title: 'Upgrade to Premium',
    description: 'Get unlimited likes and advanced filters',
    icon: '⭐',
    cta: 'Learn More',
    ctaUrl: '/membership',
    category: 'Premium Features'
  },
  // Add more native ads
];
```

---

## Analytics & Tracking

### Tracked Metrics

The system tracks:
- **Impressions**: When an ad is displayed
- **Clicks**: When user clicks on an ad
- **Dismissals**: When user closes an ad

### Accessing Analytics

All tracking data is logged to console in development. In production, you would:

1. Save to database
2. Send to analytics service (Google Analytics, Mixpanel, etc.)
3. Create dashboard to view metrics

Example database schema:

```javascript
const adAnalyticsSchema = new Schema({
  userId: ObjectId,
  adId: String,
  pageId: String,
  adType: String,
  action: String, // 'impression', 'click', 'dismiss'
  timestamp: Date,
  userTier: String
});
```

---

## Best Practices

### 1. Placement Strategy
- ✅ Place banner ads at bottom of pages
- ✅ Place native ads between content sections
- ✅ Respect frequency caps (max 3 ads per page)
- ❌ Don't cover action buttons
- ❌ Don't auto-play videos

### 2. User Experience
- ✅ Make all ads dismissible
- ✅ Clearly label ads as "Sponsored"
- ✅ Use contextual ads
- ✅ Respect user preferences
- ❌ Don't show ads to premium/VIP users

### 3. Performance
- ✅ Lazy load ad scripts
- ✅ Cache ad configuration
- ✅ Limit ad requests
- ❌ Don't block page rendering
- ❌ Don't slow down app

### 4. Compliance
- ✅ Disclose ads clearly
- ✅ Respect user privacy
- ✅ Follow ad network policies
- ✅ Honor user preferences
- ❌ Don't use deceptive practices

---

## Troubleshooting

### Ads Not Showing

1. Check user tier (ads only show to free users)
2. Check browser console for errors
3. Verify AdMob script is loaded
4. Check ad unit IDs in environment variables
5. Verify ad placement is enabled

### Ads Showing to Premium Users

1. Check user.membership.tier is correct
2. Verify AdBanner/NativeAd tier check
3. Clear browser cache
4. Check AuthContext is providing correct tier

### Performance Issues

1. Reduce ad frequency
2. Lazy load ad scripts
3. Cache ad configuration
4. Limit number of native ads
5. Use smaller ad sizes

---

## Next Steps

1. **Set up AdMob account** - Get ad unit IDs
2. **Add environment variables** - Configure ad networks
3. **Integrate components** - Add to pages
4. **Test on free tier** - Verify ads display
5. **Monitor analytics** - Track performance
6. **Optimize placement** - Based on data
7. **A/B test** - Different ad formats/frequencies

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify environment variables
3. Check ad network documentation
4. Review component props
5. Test with different user tiers

---

## Summary

The in-app advertising system is now ready to integrate. Key points:

- ✅ Non-intrusive banner and native ads
- ✅ Tier-based display (free users only)
- ✅ Dismissible ads
- ✅ Analytics tracking
- ✅ Easy to customize
- ✅ Minimal performance impact

Expected revenue: $350-500/month (conservative) with 500 users.
