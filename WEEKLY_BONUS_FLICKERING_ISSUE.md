# Weekly Bonus Flickering Issue - Troubleshooting Log

## Issue Description
When user clicks "Claim Weekly Bonus" button on the Rewards page, the screen flickers/blinks.

## Severity
Medium - UX issue, functionality works but visual experience is poor

## Date Reported
January 15, 2026

## Attempts to Fix

### Attempt 1: Remove Full Page Refetch
**Theory:** `fetchOpportunities()` was reloading all data causing full re-render
**Changes Made:**
- Removed `fetchOpportunities()` call from `handleClaimWeeklyBonus()`
- Removed `fetchOpportunities()` call from `handleClaimDailyBonus()`
- Removed `fetchOpportunities()` call from `executeRewardActivity()`
**Result:** ❌ No change - flickering persisted

### Attempt 2: Remove refreshUser() Call
**Theory:** `refreshUser()` updates auth context causing component tree re-render
**Changes Made:**
- Removed `await refreshUser()` from `handleClaimWeeklyBonus()`
- Removed `await refreshUser()` from `handleClaimDailyBonus()`
- Removed `await refreshUser()` from `executeRewardActivity()`
- Only updated local state instead
**Result:** ❌ No change - flickering persisted

### Attempt 3: Disable Button Shimmer Animation
**Theory:** CSS shimmer effect on buttons (::before pseudo-element) causing flicker
**Changes Made:**
- Set `display: none` on `.claim-btn::before` and `.start-btn::before`
- Removed hover animation for shimmer effect
**Result:** ❌ No change - flickering persisted

### Attempt 4: Add Delay to State Update
**Theory:** Rapid state changes causing visual flicker
**Changes Made:**
- Added 500ms delay before setting `setClaimingWeekly(false)`
**Result:** ❌ No change - flickering persisted

## Affected Files
- `client-new/src/components/Rewards/Rewards.tsx`
- `client-new/src/components/Rewards/Rewards.css`
- `client-new/src/contexts/AuthContext.tsx`

## Possible Root Causes (Not Yet Confirmed)

1. **Backend API Response Time**
   - API call to `/api/membership/weekly-bonus` might be slow
   - Could be causing network delay that triggers visual flicker
   - **Investigation Needed:** Check backend response time and network tab

2. **Toast Component Re-render**
   - Toast component appears after claim
   - Might be causing layout shift or re-render
   - **Investigation Needed:** Check if Toast is causing DOM changes

3. **Browser Paint/Reflow Issue**
   - Could be a browser rendering issue
   - Might be related to CSS transitions or animations elsewhere
   - **Investigation Needed:** Check browser DevTools Performance tab

4. **Ad Banner Component**
   - AdBanner component at bottom of page might be re-rendering
   - Could be triggering full page re-render
   - **Investigation Needed:** Check if AdBanner is causing issue

5. **Header Points Display Update**
   - Points display in header might be updating and causing flicker
   - Could be from context update or state change
   - **Investigation Needed:** Check if header is re-rendering

## Current Code State

### handleClaimWeeklyBonus (Current)
```typescript
const handleClaimWeeklyBonus = async () => {
  setClaimingWeekly(true);
  
  try {
    const response = await axios.post('/api/membership/weekly-bonus');
    setToast({ message: response.data.message, type: 'success' });
    
    // Delay state update to prevent flickering
    setTimeout(() => {
      setClaimingWeekly(false);
    }, 500);
  } catch (error: any) {
    setToast({ message: error.response?.data?.message || 'Failed to claim weekly bonus', type: 'error' });
    setClaimingWeekly(false);
  }
};
```

## Debugging Steps for Next Session

1. **Check Network Performance**
   - Open DevTools → Network tab
   - Click "Claim Weekly Bonus"
   - Check API response time
   - If > 500ms, backend might be slow

2. **Check Browser Performance**
   - Open DevTools → Performance tab
   - Record while clicking button
   - Look for unexpected re-renders or layout shifts
   - Check for long tasks

3. **Isolate Components**
   - Temporarily hide Toast component
   - Temporarily hide AdBanner component
   - See if flickering stops

4. **Check CSS Animations**
   - Search for all `transition` and `animation` properties
   - Look for any that might trigger on state change
   - Check for `transform` properties that cause repaints

5. **Monitor State Changes**
   - Add console.log to track all state updates
   - Check if multiple re-renders happening
   - Look for unexpected state changes

6. **Test with Different Browsers**
   - Try Chrome, Firefox, Safari
   - See if issue is browser-specific
   - Could indicate rendering engine issue

## Browser/Environment Info
- OS: Windows
- Browser: (Unknown - check with user)
- Frontend: React with TypeScript
- Backend: Node.js/Express

## Related Files to Review
- `client-new/src/components/Toast/Toast.tsx` - Toast component
- `client-new/src/components/AdBanner/AdBanner.tsx` - Ad banner component
- `client-new/src/components/Rewards/Rewards.css` - All CSS animations
- `server/routes/membership.js` - Backend weekly bonus endpoint

## Notes
- Functionality works correctly (bonus is claimed)
- Only visual flicker is the issue
- Issue is consistent and reproducible
- Affects both daily and weekly bonus claims

## Status
🔴 **UNRESOLVED** - Needs deeper investigation with DevTools

## Next Steps
1. Use browser DevTools to identify exact cause
2. Check if issue is frontend or backend related
3. Monitor network and performance metrics
4. Consider if issue is specific to this component or app-wide
5. May need to review entire Rewards component architecture
