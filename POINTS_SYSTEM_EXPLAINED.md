# Forever Us Points System - Dual Points Architecture

## Overview
The app now uses a **dual points system** to balance VIP benefits with fair competition in giveaways and contests.

## Two Types of Points

### 1. Action Points
**Purpose**: Used for likes, messages, and other in-app actions

**How it works**:
- **Free Users**: Start with 100 points, earn 10 daily, max 50/day
- **Premium Users**: Start with 500 points, earn 25 daily, max 150/day  
- **VIP Users**: Have unlimited action points (999,999)

**Cost per action**:
- Like: Free=5pts, Premium=2pts, VIP=0pts
- Message: Free=10pts, Premium=5pts, VIP=1pt
- Super Like: Free=20pts, Premium=10pts, VIP=5pts
- View Profile: Free=2pts, Premium=1pt, VIP=0pts

**Why VIP gets unlimited**: VIP members pay for the service, so they shouldn't be limited in basic actions.

---

### 2. Earned Points
**Purpose**: Earned through activities and used for giveaways, bonuses, and contests

**How it works**:
- Earned by completing rewards (watching videos, surveys, offers)
- Earned by claiming daily bonuses (10 pts)
- Earned by claiming weekly loyalty bonuses (Premium=25pts, VIP=50pts)
- Tracked separately from action points

**Why separate from action points**: 
- Ensures fair competition in giveaways - everyone must earn points through effort
- VIP members can't automatically win contests just by having unlimited action points
- Creates engagement incentive for all tiers

---

## User Display

### Rewards Page Header
Shows both point types:
- **Action Points**: Left display (shows ∞ for VIP)
- **Earned Points**: Right display (green highlight)

### Dashboard
Shows total action points available for likes/messages

---

## Future Giveaway System

When implementing giveaways/contests:
```javascript
// Giveaway entry requires earned points
if (user.membership.earnedPoints >= giveawayEntryFee) {
  // User can enter
  user.membership.earnedPoints -= giveawayEntryFee;
}
```

This ensures:
- Free users can compete by earning points through activities
- Premium users have higher earning limits
- VIP users can't bypass the system with unlimited action points
- Everyone has equal opportunity to win based on effort

---

## Migration Notes

All existing users have been migrated:
- VIP members: Action points set to 999,999
- Premium members: Action points set to 500
- Free members: Action points set to 100
- All users: Earned points initialized to 0

---

## API Endpoints

### Rewards Completion
```
POST /api/rewards/complete
Response: { pointsEarned, totalEarnedPoints, ... }
```

### Daily Bonus
```
POST /api/rewards/daily-bonus
Response: { pointsEarned, totalEarnedPoints, ... }
```

### Weekly Bonus
```
POST /api/membership/weekly-bonus
Response: { pointsEarned, totalEarnedPoints, ... }
```

All reward endpoints now add to `earnedPoints` instead of `points`.
