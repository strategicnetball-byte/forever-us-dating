# Ad Networks Architecture

This document explains how the ad network system is architected and how all components work together.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Forever Us Dating App                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Frontend (React)                         │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Rewards Component                             │  │   │
│  │  │  - Displays reward opportunities               │  │   │
│  │  │  - Handles user clicks                         │  │   │
│  │  │  - Shows toast notifications                   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                      ↓                                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  AdService (services/AdService.ts)            │  │   │
│  │  │  - Manages all ad providers                    │  │   │
│  │  │  - Initializes SDKs                           │  │   │
│  │  │  - Shows ads/surveys                          │  │   │
│  │  │  - Falls back to mock if SDK fails            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                      ↓                                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Ad Providers                                  │  │   │
│  │  │  - GoogleAdMobProvider                         │  │   │
│  │  │  - UnityAdsProvider                            │  │   │
│  │  │  - FacebookAudienceNetworkProvider             │  │   │
│  │  │  - PollfishProvider                            │  │   │
│  │  │  - TapResearchProvider                         │  │   │
│  │  │                                                │  │   │
│  │  │  Each provider has:                            │  │   │
│  │  │  - Real SDK implementation (if available)      │  │   │
│  │  │  - Mock implementation (fallback)              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                      ↓                                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  External Ad Network SDKs (Optional)           │  │   │
│  │  │  - Google AdMob SDK                            │  │   │
│  │  │  - Unity Ads SDK                               │  │   │
│  │  │  - Pollfish SDK                                │  │   │
│  │  │  - TapResearch SDK                             │  │   │
│  │  │                                                │  │   │
│  │  │  Only load if credentials are valid            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Backend (Node.js/Express)              │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Rewards Routes (/api/rewards/*)              │  │   │
│  │  │  - GET /opportunities - List reward options   │  │   │
│  │  │  - POST /start - Start reward activity        │  │   │
│  │  │  - POST /complete - Complete reward activity  │  │   │
│  │  │  - POST /daily-bonus - Claim daily bonus      │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                      ↓                                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Reward Model                                  │  │   │
│  │  │  - Tracks reward activities                    │  │   │
│  │  │  - Records completion status                   │  │   │
│  │  │  - Stores completion data                      │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                      ↓                                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  User Model                                    │  │   │
│  │  │  - Updates earnedPoints                        │  │   │
│  │  │  - Tracks daily earning limit                  │  │   │
│  │  │  - Records last reward time                    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                      ↓                                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  MongoDB Database                              │  │   │
│  │  │  - Stores rewards                              │  │   │
│  │  │  - Stores user points                          │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Rewards Component (`client-new/src/components/Rewards/Rewards.tsx`)

**Responsibilities:**
- Display reward opportunities (videos, surveys, offers)
- Handle user clicks on reward buttons
- Show loading states and toast notifications
- Filter and sort opportunities
- Display daily bonus and weekly bonus buttons

**Flow:**
1. User navigates to Rewards page
2. Component fetches opportunities from backend
3. Component initializes AdService
4. User clicks "Watch" or "Start" button
5. Component calls `handleStartReward()`
6. Component calls `executeRewardActivity()`
7. Component shows toast with result

### 2. AdService (`client-new/src/services/AdService.ts`)

**Responsibilities:**
- Manage all ad providers
- Initialize providers and their SDKs
- Show ads and surveys
- Handle provider fallbacks
- Track provider readiness

**Key Methods:**
```typescript
async initialize()                    // Initialize all providers
async showRewardedAd(provider)        // Show video ad
async showSurvey(provider)            // Show survey
getAvailableProviders()               // List available ad providers
getAvailableSurveyProviders()         // List available survey providers
isProviderReady(provider)             // Check if provider is ready
```

**Provider Map:**
```
providers: {
  'admob': GoogleAdMobProvider,
  'unity': UnityAdsProvider,
  'facebook': FacebookAudienceNetworkProvider
}

surveyProviders: {
  'pollfish': PollfishProvider,
  'tapresearch': TapResearchProvider
}
```

### 3. Ad Providers

Each provider implements either `AdProvider` or `SurveyProvider` interface:

```typescript
interface AdProvider {
  name: string;
  initialize(): Promise<boolean>;
  showRewardedAd(): Promise<AdResult>;
  isReady(): boolean;
}

interface SurveyProvider {
  name: string;
  initialize(): Promise<boolean>;
  showSurvey(): Promise<SurveyResult>;
  isReady(): boolean;
}
```

**Provider Types:**

#### Video Ad Providers
- **GoogleAdMobProvider**: Shows 30-second video ad
- **UnityAdsProvider**: Shows 25-second interactive video
- **FacebookAudienceNetworkProvider**: Shows 20-second video

#### Survey Providers
- **PollfishProvider**: Shows 2-question survey
- **TapResearchProvider**: Shows 3-question survey

**Initialization Flow:**
1. Provider constructor receives API key/ID from environment
2. `initialize()` tries to load real SDK
3. If SDK loads successfully, provider is marked as ready
4. If SDK fails to load, provider falls back to mock implementation
5. Mock implementation shows simulated UI

**Mock Implementation:**
- Creates overlay with simulated UI
- Shows countdown timer
- Simulates user interaction
- Returns success with reward amount
- No real ads/surveys shown

**Real Implementation:**
- Loads real SDK from CDN
- Shows real ads/surveys from ad network
- Tracks real completion
- Returns real reward data

### 4. Backend Rewards Routes (`server/routes/rewards.js`)

**Endpoints:**

#### GET /api/rewards/opportunities
Returns list of available reward opportunities:
```json
{
  "videoAds": [
    {
      "id": "admob_1",
      "provider": "admob",
      "type": "video_ad",
      "title": "Watch AdMob Video",
      "points": 15,
      "estimatedTime": "30s"
    }
  ],
  "surveys": [
    {
      "id": "pollfish_1",
      "provider": "pollfish",
      "type": "survey",
      "title": "Pollfish Survey",
      "points": 50,
      "estimatedTime": "2m"
    }
  ],
  "offers": [],
  "dailyBonus": {
    "id": "daily_bonus",
    "type": "daily_bonus",
    "points": 10,
    "available": true
  }
}
```

#### POST /api/rewards/start
Start a reward activity:
```json
Request: {
  "opportunityId": "admob_1",
  "provider": "admob",
  "type": "video_ad"
}

Response: {
  "rewardId": "reward_123",
  "message": "Reward activity started"
}
```

#### POST /api/rewards/complete
Complete a reward activity:
```json
Request: {
  "rewardId": "reward_123",
  "providerId": "admob_1",
  "completionData": {
    "adWatched": true,
    "watchTime": 30,
    "rewardAmount": 15
  }
}

Response: {
  "message": "Reward claimed successfully",
  "pointsAwarded": 15,
  "earnedPoints": 165
}
```

#### POST /api/rewards/daily-bonus
Claim daily bonus:
```json
Response: {
  "message": "Daily bonus claimed",
  "pointsAwarded": 10,
  "earnedPoints": 175
}
```

### 5. User Model (`server/models/User.js`)

**Reward-Related Fields:**
```javascript
{
  earnedPoints: Number,              // Points earned from rewards
  actionPoints: Number,              // Points for actions (likes, messages)
  lastDailyBonusAt: Date,           // Last time daily bonus was claimed
  lastRewardAt: Date,               // Last time any reward was claimed
  dailyEarningLimit: Number,        // Max points per day
  dailyEarningsToday: Number,       // Points earned today
  lastEarningResetAt: Date          // When daily earnings reset
}
```

---

## Data Flow

### Scenario 1: User Watches Video Ad

```
1. User clicks "Watch" on AdMob video
   ↓
2. Rewards component calls handleStartReward()
   ↓
3. Component sends POST /api/rewards/start
   ↓
4. Backend creates Reward record
   ↓
5. Backend returns rewardId
   ↓
6. Component calls executeRewardActivity()
   ↓
7. Component calls adService.showRewardedAd('admob')
   ↓
8. AdService gets GoogleAdMobProvider from map
   ↓
9. Provider tries to load real SDK
   ↓
10. If SDK loads: Show real ad
    If SDK fails: Show mock ad
   ↓
11. User watches ad (real or mock)
   ↓
12. Ad completes, returns AdResult with reward amount
   ↓
13. Component sends POST /api/rewards/complete
   ↓
14. Backend updates Reward record to 'completed'
   ↓
15. Backend adds points to user.earnedPoints
   ↓
16. Backend checks daily earning limit
   ↓
17. Backend returns success with new earnedPoints
   ↓
18. Component shows toast: "Earned 15 points!"
   ↓
19. Component removes opportunity from list
```

### Scenario 2: User Completes Survey

```
1. User clicks "Start" on Pollfish survey
   ↓
2. Rewards component calls handleStartReward()
   ↓
3. Component sends POST /api/rewards/start
   ↓
4. Backend creates Reward record
   ↓
5. Backend returns rewardId
   ↓
6. Component calls executeRewardActivity()
   ↓
7. Component calls adService.showSurvey('pollfish')
   ↓
8. AdService gets PollfishProvider from map
   ↓
9. Provider tries to load real SDK
   ↓
10. If SDK loads: Show real survey
    If SDK fails: Show mock survey
   ↓
11. User answers survey questions (real or mock)
   ↓
12. Survey completes, returns SurveyResult with reward amount
   ↓
13. Component sends POST /api/rewards/complete
   ↓
14. Backend updates Reward record to 'completed'
   ↓
15. Backend adds points to user.earnedPoints
   ↓
16. Backend checks daily earning limit
   ↓
17. Backend returns success with new earnedPoints
   ↓
18. Component shows toast: "Earned 50 points!"
   ↓
19. Component removes opportunity from list
```

---

## Environment Variables

**Location:** `client-new/.env`

**Variables:**
```bash
# AdMob (Google)
REACT_APP_ADMOB_AD_UNIT_ID=ca-app-pub-3940256099942544/5224354917
REACT_APP_ADMOB_TEST_DEVICE_ID=33BE2250B43518CCDA7DE426D04EE232

# Pollfish
REACT_APP_POLLFISH_API_KEY=test-pollfish-key-local-dev
REACT_APP_POLLFISH_TEST_MODE=true

# TapResearch
REACT_APP_TAPRESEARCH_TOKEN=pub_test_tapresearch_local_dev
REACT_APP_TAPRESEARCH_SANDBOX=true

# Unity Ads
REACT_APP_UNITY_GAME_ID=test-game-id-local
REACT_APP_UNITY_PLACEMENT_ID=RewardedVideo
REACT_APP_UNITY_TEST_MODE=true

# Facebook
REACT_APP_FB_PLACEMENT_ID=test-placement-local
```

**How They're Used:**
1. React loads `.env` file at build time
2. Variables are available as `process.env.REACT_APP_*`
3. AdService passes them to provider constructors
4. Providers use them to initialize SDKs

---

## Error Handling

### Provider Initialization Errors

**Scenario:** SDK fails to load

```
1. Provider.initialize() is called
2. Script tag is created for SDK
3. Script fails to load (network error, invalid URL, etc.)
4. Promise rejects
5. AdService catches error
6. AdService logs warning: "⚠️ Provider failed to initialize, using mock"
7. AdService still adds provider to map
8. Provider falls back to mock implementation
9. User sees mock UI instead of real ad
10. Points are still awarded
```

### Daily Earning Limit

**Scenario:** User reaches daily limit

```
1. User completes reward activity
2. Backend receives /api/rewards/complete
3. Backend checks user.dailyEarningsToday
4. If dailyEarningsToday + rewardAmount > dailyEarningLimit:
   - Return error: "Daily earning limit reached"
   - Don't award points
5. Component shows error toast
6. User can try again tomorrow
```

### Provider Not Available

**Scenario:** Provider not in map

```
1. Component calls adService.showRewardedAd('invalid_provider')
2. AdService looks up 'invalid_provider' in providers map
3. Provider not found
4. AdService returns: { success: false, error: "Provider invalid_provider not available" }
5. Component catches error
6. Component shows error toast
```

---

## Testing Strategy

### Unit Testing
- Test each provider independently
- Mock SDK loading
- Test mock implementations
- Test error handling

### Integration Testing
- Test AdService with all providers
- Test Rewards component with AdService
- Test backend reward endpoints
- Test point awarding

### End-to-End Testing
- Test full flow from click to point award
- Test with mock implementations
- Test with real SDKs (if credentials available)
- Test daily earning limits
- Test error scenarios

---

## Performance Considerations

### Lazy Loading
- AdService initializes on Rewards page load
- Providers load SDKs asynchronously
- Doesn't block page rendering

### Caching
- Provider instances are cached in AdService
- SDKs are loaded once and reused
- No repeated SDK loading

### Memory
- Mock implementations use minimal memory
- Real SDKs may use more memory
- Overlays are removed after completion

---

## Security Considerations

### API Keys
- Stored in `.env` file (not committed to git)
- Loaded at build time
- Sent to ad networks via SDK
- Never exposed in frontend code

### User Data
- Reward completion data is minimal
- No personal data sent to ad networks
- Backend validates all reward claims
- Points are awarded server-side

### CORS
- Backend allows requests from frontend
- Ad network SDKs handle their own CORS
- No sensitive data in requests

---

## Future Enhancements

### Additional Providers
- More video ad networks
- More survey platforms
- Offer networks (AdGate, etc.)

### Analytics
- Track ad impressions
- Track completion rates
- Track revenue per provider
- Track user engagement

### Optimization
- A/B test different point values
- Optimize provider mix
- Personalize opportunities by user
- Dynamic point allocation

### Monetization
- Track revenue per user
- Calculate ROI per provider
- Optimize for revenue vs user experience
- Implement revenue sharing

---

## Troubleshooting Guide

### Ads Not Showing
1. Check browser console for errors
2. Verify environment variables are set
3. Check that AdService initialized successfully
4. Verify provider is in map
5. Check that provider.isReady() returns true

### Points Not Awarded
1. Check backend logs
2. Verify reward completion was sent
3. Check user daily earning limit
4. Verify database update
5. Check user earnedPoints field

### SDK Loading Errors
1. Check network tab in DevTools
2. Verify SDK URLs are correct
3. Check for CORS errors
4. Verify credentials are valid
5. Check browser console for specific errors

### Mock Implementation Not Working
1. Verify provider constructor was called
2. Check that initialize() was called
3. Verify mock UI is being created
4. Check for JavaScript errors in console
5. Verify event listeners are attached

