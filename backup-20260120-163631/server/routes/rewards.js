const express = require('express');
const User = require('../models/User');
const Reward = require('../models/Reward');
const auth = require('../middleware/auth');

const router = express.Router();

// Get available reward opportunities
router.get('/opportunities', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const opportunities = {
      videoAds: [
        {
          id: 'admob_video_1',
          provider: 'admob',
          type: 'video_ad',
          title: 'Watch Video Ad',
          description: 'Watch a 30-second video to earn points',
          points: 30,
          estimatedTime: '30 seconds',
          icon: '📺',
          available: true
        },
        {
          id: 'unity_rewarded_1',
          provider: 'unity',
          type: 'video_ad',
          title: 'Rewarded Video',
          description: 'Watch a short video advertisement',
          points: 30,
          estimatedTime: '15-30 seconds',
          icon: '🎬',
          available: true
        },
        {
          id: 'admob_video_2',
          provider: 'admob',
          type: 'video_ad',
          title: 'Product Demo Video',
          description: 'Watch a product demonstration video',
          points: 25,
          estimatedTime: '20 seconds',
          icon: '📹',
          available: true
        },
        {
          id: 'unity_rewarded_2',
          provider: 'unity',
          type: 'video_ad',
          title: 'Brand Story Video',
          description: 'Learn about a brand\'s story',
          points: 35,
          estimatedTime: '45 seconds',
          icon: '🎥',
          available: true
        },
        {
          id: 'admob_video_3',
          provider: 'admob',
          type: 'video_ad',
          title: 'Quick Promo Video',
          description: 'Watch a promotional video',
          points: 28,
          estimatedTime: '25 seconds',
          icon: '📺',
          available: true
        }
      ],
      surveys: [
        {
          id: 'pollfish_survey_1',
          provider: 'pollfish',
          type: 'survey',
          title: 'Quick Survey',
          description: 'Share your opinion and earn points',
          points: 40,
          estimatedTime: '3-5 minutes',
          icon: '📋',
          available: true,
          category: 'Lifestyle'
        },
        {
          id: 'tapresearch_survey_1',
          provider: 'tapresearch',
          type: 'survey',
          title: 'Consumer Survey',
          description: 'Help brands understand consumer preferences',
          points: 60,
          estimatedTime: '5-8 minutes',
          icon: '📊',
          available: true,
          category: 'Shopping'
        },
        {
          id: 'pollfish_survey_2',
          provider: 'pollfish',
          type: 'survey',
          title: 'Dating Preferences Survey',
          description: 'Tell us about your dating preferences',
          points: 50,
          estimatedTime: '4-6 minutes',
          icon: '💕',
          available: true,
          category: 'Dating'
        },
        {
          id: 'tapresearch_survey_2',
          provider: 'tapresearch',
          type: 'survey',
          title: 'Tech & Gadgets Survey',
          description: 'Share your thoughts on technology',
          points: 55,
          estimatedTime: '5-7 minutes',
          icon: '📱',
          available: true,
          category: 'Technology'
        },
        {
          id: 'pollfish_survey_3',
          provider: 'pollfish',
          type: 'survey',
          title: 'Entertainment Survey',
          description: 'What\'s your favorite entertainment?',
          points: 45,
          estimatedTime: '3-5 minutes',
          icon: '🎬',
          available: true,
          category: 'Entertainment'
        }
      ],
      offers: [
        {
          id: 'adgate_offer_1',
          provider: 'adgate',
          type: 'offer',
          title: 'Try New App',
          description: 'Download and try a new mobile app',
          points: 80,
          estimatedTime: '2-3 minutes',
          icon: '📱',
          available: true
        },
        {
          id: 'adgate_offer_2',
          provider: 'adgate',
          type: 'offer',
          title: 'Sign Up Bonus',
          description: 'Sign up for a free service',
          points: 65,
          estimatedTime: '1-2 minutes',
          icon: '✍️',
          available: true
        },
        {
          id: 'adgate_offer_3',
          provider: 'adgate',
          type: 'offer',
          title: 'Install Game',
          description: 'Download and install a mobile game',
          points: 100,
          estimatedTime: '3-5 minutes',
          icon: '🎮',
          available: true
        },
        {
          id: 'adgate_offer_4',
          provider: 'adgate',
          type: 'offer',
          title: 'Free Trial Subscription',
          description: 'Start a free trial of a premium service',
          points: 90,
          estimatedTime: '2-3 minutes',
          icon: '🎁',
          available: true
        },
        {
          id: 'adgate_offer_5',
          provider: 'adgate',
          type: 'offer',
          title: 'Complete Profile',
          description: 'Complete your profile on a partner site',
          points: 75,
          estimatedTime: '2-4 minutes',
          icon: '👤',
          available: true
        }
      ],
      dailyBonus: {
        id: 'daily_login',
        provider: 'internal',
        type: 'daily_bonus',
        title: 'Daily Login Bonus',
        description: 'Come back tomorrow for your daily points',
        points: 10,
        available: !user.lastDailyBonus || 
          new Date().toDateString() !== new Date(user.lastDailyBonus).toDateString(),
        icon: '🎁'
      }
    };
    
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start reward activity (video ad, survey, etc.)
router.post('/start', auth, async (req, res) => {
  try {
    const { opportunityId, provider, type } = req.body;
    
    // Create pending reward record
    const reward = new Reward({
      userId: req.userId,
      type,
      provider,
      providerId: opportunityId,
      pointsEarned: 0, // Will be updated on completion
      status: 'pending'
    });
    
    await reward.save();
    
    // Return configuration for the specific provider
    const config = getProviderConfig(provider, opportunityId);
    
    res.json({
      rewardId: reward._id,
      config,
      opportunityId, // Include opportunityId in response for point calculation
      message: 'Reward activity started'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Complete reward activity
router.post('/complete', auth, async (req, res) => {
  try {
    const { rewardId, providerId, completionData } = req.body;
    
    const reward = await Reward.findOne({
      _id: rewardId,
      userId: req.userId,
      status: 'pending'
    });
    
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found or already completed' });
    }
    
    // Validate completion based on provider
    const validation = await validateCompletion(reward.provider, providerId, completionData);
    
    if (!validation.valid) {
      reward.status = 'failed';
      await reward.save();
      return res.status(400).json({ message: 'Reward completion validation failed' });
    }
    
    // Calculate points using providerId (opportunityId)
    const pointsEarned = calculatePoints(reward.type, reward.provider, providerId);
    const revenueEarned = calculateRevenue(reward.type, reward.provider, completionData);
    
    // Get user and check daily earning limit
    const user = await User.findById(req.userId);
    
    // Reset daily earnings if it's a new day
    const today = new Date().toDateString();
    const lastReset = user.lastEarningsReset ? new Date(user.lastEarningsReset).toDateString() : null;
    
    if (today !== lastReset) {
      user.dailyEarningsToday = 0;
      user.lastEarningsReset = new Date();
    }
    
    // Check daily earning limit based on tier
    const dailyLimits = {
      free: 50,
      premium: 150,
      vip: null // No limit for VIP
    };
    
    const dailyLimit = dailyLimits[user.membership.tier];
    const totalEarningsAfter = user.dailyEarningsToday + pointsEarned;
    
    if (dailyLimit && totalEarningsAfter > dailyLimit) {
      const remainingToday = Math.max(0, dailyLimit - user.dailyEarningsToday);
      return res.status(400).json({ 
        message: `Daily earning limit reached. You can earn ${remainingToday} more points today. Upgrade to Premium or VIP for higher limits!`,
        dailyLimit,
        earnedToday: user.dailyEarningsToday,
        remainingToday
      });
    }
    
    // Update reward record
    reward.pointsEarned = pointsEarned;
    reward.revenueEarned = revenueEarned;
    reward.status = 'completed';
    reward.metadata = completionData;
    await reward.save();
    
    // Add earned points to user (for giveaways, bonuses, etc.)
    user.membership.earnedPoints += pointsEarned;
    user.membership.points += pointsEarned;  // Also update action points
    user.dailyEarningsToday += pointsEarned;
    await user.save();
    
    res.json({
      message: `Congratulations! You earned ${pointsEarned} points!`,
      pointsEarned,
      totalEarnedPoints: user.membership.earnedPoints,
      dailyEarningsToday: user.dailyEarningsToday,
      dailyLimit: dailyLimit,
      rewardId: reward._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's reward history
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const rewards = await Reward.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Reward.countDocuments({ userId: req.userId });
    
    res.json({
      rewards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Claim daily bonus
router.post('/daily-bonus', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Check if already claimed today
    if (user.lastDailyBonus && 
        new Date().toDateString() === new Date(user.lastDailyBonus).toDateString()) {
      return res.status(400).json({ message: 'Daily bonus already claimed today' });
    }
    
    const bonusPoints = 10;
    
    // Create reward record
    const reward = new Reward({
      userId: req.userId,
      type: 'daily_bonus',
      provider: 'internal',
      providerId: 'daily_login',
      pointsEarned: bonusPoints,
      status: 'completed'
    });
    
    await reward.save();
    
    // Update user
    user.membership.earnedPoints += bonusPoints;
    user.membership.points += bonusPoints;  // Also update action points
    user.lastDailyBonus = new Date();
    await user.save();
    
    res.json({
      message: `Daily bonus claimed! You earned ${bonusPoints} points!`,
      pointsEarned: bonusPoints,
      totalEarnedPoints: user.membership.earnedPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper functions
function getProviderConfig(provider, opportunityId) {
  const configs = {
    admob: {
      adUnitId: process.env.ADMOB_REWARDED_AD_UNIT_ID || 'ca-app-pub-test-rewarded',
      testMode: process.env.NODE_ENV !== 'production'
    },
    pollfish: {
      apiKey: process.env.POLLFISH_API_KEY || 'test-api-key',
      surveyId: opportunityId
    },
    tapresearch: {
      apiToken: process.env.TAPRESEARCH_API_TOKEN || 'test-token',
      surveyId: opportunityId
    },
    unity: {
      gameId: process.env.UNITY_GAME_ID || 'test-game-id',
      placementId: 'rewardedVideo'
    }
  };
  
  return configs[provider] || {};
}

async function validateCompletion(provider, providerId, completionData) {
  // In production, you'd validate with the actual provider APIs
  // For now, we'll simulate validation
  
  switch (provider) {
    case 'admob':
      return { valid: completionData.adWatched === true };
    case 'pollfish':
      return { valid: completionData.surveyCompleted === true };
    case 'tapresearch':
      return { valid: completionData.surveyCompleted === true };
    case 'unity':
      return { valid: completionData.adWatched === true };
    default:
      return { valid: true };
  }
}

function calculatePoints(type, provider, opportunityId) {
  // Map opportunity IDs to their point values
  const pointMap = {
    // Video Ads
    'admob_video_1': 30,
    'unity_rewarded_1': 30,
    'admob_video_2': 25,
    'unity_rewarded_2': 35,
    'admob_video_3': 28,
    // Surveys
    'pollfish_survey_1': 40,
    'tapresearch_survey_1': 60,
    'pollfish_survey_2': 50,
    'tapresearch_survey_2': 55,
    'pollfish_survey_3': 45,
    // Offers
    'adgate_offer_1': 80,
    'adgate_offer_2': 65,
    'adgate_offer_3': 100,
    'adgate_offer_4': 90,
    'adgate_offer_5': 75,
    // Daily bonus
    'daily_login': 10
  };
  
  return pointMap[opportunityId] || 10;
}

function calculateRevenue(type, provider, completionData) {
  // Your revenue rates (these would be based on your actual contracts)
  const revenueRates = {
    video_ad: { admob: 0.02, unity: 0.015 }, // $0.02 per video ad view
    survey: { pollfish: 0.50, tapresearch: 0.75 }, // $0.50-0.75 per survey
    offer: { adgate: 1.00 }, // $1.00 per offer completion
    daily_bonus: { internal: 0 }
  };
  
  return revenueRates[type]?.[provider] || 0;
}

module.exports = router;