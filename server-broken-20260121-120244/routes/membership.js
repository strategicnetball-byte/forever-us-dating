const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get membership info
router.get('/info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('membership');
    res.json(user.membership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get membership tiers and pricing
router.get('/tiers', (req, res) => {
  const tiers = {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Earn points through daily activities',
        'Basic profile creation',
        'Limited likes per day (points required)',
        'Limited messaging (points required)',
        'View limited profiles',
        'Daily earning limit: 100 points'
      ],
      pointCosts: {
        like: 5,
        message: 10,
        superLike: 20,
        viewProfile: 2
      },
      dailyPointsEarned: 10,
      dailyEarningLimit: 100
    },
    premium: {
      name: 'Premium',
      price: 7.99,
      features: [
        'Reduced point costs for all actions',
        'Daily bonus points (25 pts)',
        'See who liked you',
        'Advanced filters',
        'Priority in discovery',
        'Weekly loyalty bonus (25 pts)',
        'Daily earning limit: 200 points'
      ],
      pointCosts: {
        like: 2,
        message: 5,
        superLike: 10,
        viewProfile: 1
      },
      dailyPointsEarned: 25,
      dailyEarningLimit: 200,
      weeklyBonus: 25
    },
    vip: {
      name: 'VIP',
      price: 12.99,
      features: [
        'Minimal point costs',
        'Unlimited likes',
        'Unlimited messaging',
        'Boost your profile',
        'Read receipts',
        'Advanced analytics',
        'Weekly loyalty bonus (50 pts)',
        'No daily earning limit',
        '2x points on all activities'
      ],
      pointCosts: {
        like: 0,
        message: 1,
        superLike: 5,
        viewProfile: 0
      },
      dailyPointsEarned: 50,
      dailyEarningLimit: null,
      weeklyBonus: 50,
      pointMultiplier: 2
    }
  };
  
  res.json(tiers);
});

// Upgrade membership (simplified - in production you'd integrate with Stripe/PayPal)
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { tier } = req.body;
    
    if (!['premium', 'vip'].includes(tier)) {
      return res.status(400).json({ message: 'Invalid tier' });
    }
    
    const user = await User.findById(req.userId);
    
    // In production, you'd process payment here
    user.membership.tier = tier;
    user.membership.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    user.membership.isActive = true;
    
    // Give bonus action points for upgrading (VIP gets unlimited, so this is just a courtesy)
    const bonusPoints = tier === 'premium' ? 100 : 500;
    user.membership.points += bonusPoints;
    
    // Track last weekly bonus claim
    user.lastWeeklyBonus = new Date();
    
    await user.save();
    
    res.json({ 
      message: `Successfully upgraded to ${tier}!`,
      membership: user.membership,
      bonusPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add points (for daily activities, watching ads, etc.)
router.post('/add-points', auth, async (req, res) => {
  try {
    const { points, reason } = req.body;
    const user = await User.findById(req.userId);
    
    user.membership.points += points;
    await user.save();
    
    res.json({ 
      message: `Earned ${points} points for ${reason}!`,
      totalPoints: user.membership.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if user can perform action
router.post('/check-action', auth, async (req, res) => {
  try {
    const { action } = req.body;
    const user = await User.findById(req.userId);
    
    const canPerform = user.canPerformAction(action);
    const costs = {
      like: { free: 5, premium: 2, vip: 0 },
      message: { free: 10, premium: 5, vip: 1 },
      superLike: { free: 20, premium: 10, vip: 5 },
      viewProfile: { free: 2, premium: 1, vip: 0 }
    };
    
    const cost = costs[action]?.[user.membership.tier] || 0;
    
    res.json({
      canPerform,
      cost,
      currentPoints: user.membership.points,
      tier: user.membership.tier
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Claim weekly loyalty bonus
router.post('/weekly-bonus', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Check if user has premium or vip tier
    if (user.membership.tier === 'free') {
      return res.status(400).json({ message: 'Weekly bonus only available for Premium and VIP members' });
    }
    
    // Check if already claimed this week
    const lastBonus = user.lastWeeklyBonus ? new Date(user.lastWeeklyBonus) : null;
    const now = new Date();
    const daysSinceBonus = lastBonus ? Math.floor((now - lastBonus) / (1000 * 60 * 60 * 24)) : 999;
    
    if (daysSinceBonus < 7) {
      const daysUntilNext = 7 - daysSinceBonus;
      return res.status(400).json({ 
        message: `Weekly bonus already claimed. Available again in ${daysUntilNext} days` 
      });
    }
    
    // Determine bonus amount based on tier
    const bonusAmount = user.membership.tier === 'premium' ? 25 : 50;
    
    // Add bonus points
    user.membership.earnedPoints += bonusAmount;
    user.lastWeeklyBonus = now;
    await user.save();
    
    res.json({
      message: `Weekly loyalty bonus claimed! You earned ${bonusAmount} points!`,
      pointsEarned: bonusAmount,
      totalEarnedPoints: user.membership.earnedPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;