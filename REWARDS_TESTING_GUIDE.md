# Rewards System Testing Guide

## Overview
The Rewards system is fully functional with mock data for local testing. Users can earn points by:
- Watching video ads (simulated)
- Completing surveys (simulated)
- Completing offers (simulated)
- Daily login bonus
- Weekly loyalty bonus (Premium/VIP only)

## How to Test Locally

### 1. Start Your Servers
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client-new
npm start
```

### 2. Login to the App
- Navigate to http://localhost:3000
- Login with test account (e.g., Emma Davis)

### 3. Navigate to Rewards Page
- Click "Earn Points" button in the dashboard header
- Or navigate to http://localhost:3000/rewards

### 4. Test Different Activities

#### Watch Video Ads
1. Click "Watch" on any video ad card
2. The app will simulate a 2-second ad watch
3. You'll see a success toast notification
4. Points will be added to your "Earned Points"
5. The card will disappear from the list

#### Complete Surveys
1. Click "Start" on any survey card
2. The app will simulate a 3-second survey completion
3. You'll see a success toast notification
4. Points will be added
5. The card will disappear

#### Complete Offers
1. Click "Complete" on any offer card
2. The app will simulate a 2.5-second offer completion
3. You'll see a success toast notification
4. Points will be added
5. The card will disappear

#### Daily Bonus
1. Click "Claim" on the Daily Bonus card
2. You'll get +10 points
3. The button will be disabled (can only claim once per day)

#### Weekly Loyalty Bonus (Premium/VIP Only)
1. If logged in as Premium or VIP user
2. Click "Claim Weekly Bonus"
3. You'll get +25 (Premium) or +50 (VIP) points
4. Can only claim once per week

### 5. Test Filters and Sorting
- Use the filter buttons to show: All, Videos, Surveys, Offers
- Use the sort dropdown to sort by: Highest Points, Shortest Time, Newest First

### 6. Check Points Display
- Action Points: Shows in header (used for likes/messages)
- Earned Points: Shows in header (earned through activities)
- Daily Limit: Shows in stats (100 for Free, 200 for Premium, ∞ for VIP)

## What's Simulated vs Real

### Simulated (Local Testing)
- Video ad watching (2 second delay)
- Survey completion (3 second delay)
- Offer completion (2.5 second delay)
- All point calculations
- Daily/weekly bonus tracking

### Real (Connected to Backend)
- Point deductions/additions to database
- User tier checking
- Daily earning limit enforcement
- Reward history tracking
- Email verification points (+30)
- Photo upload points (+25 per photo)
- Profile completion points (+50)

## Testing Scenarios

### Scenario 1: Free User Daily Limit
1. Login as free tier user
2. Complete activities until you hit 100 points earned today
3. You should see an error: "Daily earning limit reached"
4. Upgrade to Premium to get 200 point limit

### Scenario 2: Premium User Benefits
1. Upgrade to Premium tier
2. Daily limit increases to 200 points
3. Weekly loyalty bonus becomes available (+25 pts)
4. Can claim weekly bonus once per week

### Scenario 3: VIP User Unlimited
1. Upgrade to VIP tier
2. No daily earning limit (shows ∞)
3. Weekly loyalty bonus available (+50 pts)
4. All action costs are 0 (likes/messages free)

## Troubleshooting

### Points Not Updating
- Check browser console for errors
- Verify backend is running on port 3001
- Try refreshing the page
- Check that you're logged in

### Activities Not Completing
- Make sure backend is running
- Check network tab in browser dev tools
- Look for 400/500 errors in console
- Verify user has enough points for the tier

### Daily Bonus Not Available
- Daily bonus can only be claimed once per day
- Check if you already claimed it today
- Try logging out and back in

## Next Steps: Real Ad Networks

When ready to integrate real ad networks:

1. **AdMob (Google)**
   - Get test app ID from Google AdMob console
   - Add to environment variables
   - Use test device ID for testing

2. **Pollfish (Surveys)**
   - Get API key from Pollfish dashboard
   - Add to environment variables
   - Use sandbox mode for testing

3. **TapResearch (Surveys)**
   - Get API token from TapResearch dashboard
   - Add to environment variables
   - Use test mode

4. **Unity Ads**
   - Get game ID from Unity dashboard
   - Add to environment variables
   - Use test mode

## File Locations

- Frontend: `client-new/src/components/Rewards/Rewards.tsx`
- Backend: `server/routes/rewards.js`
- Services: `client-new/src/services/AdService.ts`
- Styling: `client-new/src/components/Rewards/Rewards.css`

## API Endpoints

- `GET /api/rewards/opportunities` - Get available reward opportunities
- `POST /api/rewards/start` - Start a reward activity
- `POST /api/rewards/complete` - Complete a reward activity
- `POST /api/rewards/daily-bonus` - Claim daily bonus
- `POST /api/membership/weekly-bonus` - Claim weekly bonus
- `GET /api/rewards/history` - Get reward history
