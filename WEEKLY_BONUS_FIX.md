# Weekly Bonus Points Fix

## Problem
When users claimed the weekly bonus on the Rewards page, the points were being added to the database correctly, but the UI was not updating to reflect the new point total.

## Root Cause
The Rewards component was calling the `/api/membership/weekly-bonus` endpoint successfully, but it wasn't refreshing the user data in the AuthContext after the bonus was claimed. The component was using `window.location.reload()` which is a hard page refresh and not ideal UX.

## Solution
Added a `refreshUser()` method to the AuthContext that allows components to refresh user data without a full page reload.

### Changes Made:

1. **AuthContext.tsx** - Added `refreshUser` method:
   - Added `refreshUser: () => Promise<void>` to the `AuthContextType` interface
   - Implemented `refreshUser` function that calls `fetchUser()` to get updated user data
   - Exported `refreshUser` in the context provider value

2. **Rewards.tsx** - Updated bonus claim handlers:
   - Updated `handleClaimDailyBonus()` to call `await refreshUser()` after claiming
   - Updated `handleClaimWeeklyBonus()` to call `await refreshUser()` instead of `window.location.reload()`
   - Updated `executeRewardActivity()` to call `await refreshUser()` after completing a reward
   - Destructured `refreshUser` from `useAuth()` hook

## How It Works
1. User claims weekly bonus
2. Backend adds points and updates `lastWeeklyBonus` timestamp
3. Frontend calls `refreshUser()` which fetches the updated user profile from `/api/auth/me`
4. AuthContext updates the user state with new points
5. UI automatically re-renders with updated point total
6. No page reload needed - smooth UX

## Testing
The backend logic was verified to work correctly with `server/scripts/testWeeklyBonus.js` which confirmed:
- Points are correctly added to the database
- `lastWeeklyBonus` timestamp is correctly updated
- The 7-day cooldown logic works as expected

## Result
Users will now see their points update immediately after claiming daily or weekly bonuses, and after completing reward activities.
