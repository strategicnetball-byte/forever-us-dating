const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get ad configuration for a user
router.get('/config', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId).select('membership');

    // Determine which ads to show based on tier
    const adConfig = {
      showBannerAds: user.membership.tier === 'free',
      showNativeAds: user.membership.tier === 'free',
      showInterstitials: false, // Disabled for now
      tier: user.membership.tier,
      placements: {
        browse: {
          banner: user.membership.tier === 'free',
          native: user.membership.tier === 'free',
          frequency: 2
        },
        dashboard: {
          banner: user.membership.tier === 'free',
          native: false,
          frequency: 1
        },
        messages: {
          banner: user.membership.tier === 'free',
          native: false,
          frequency: 1
        },
        profile: {
          banner: user.membership.tier === 'free',
          native: false,
          frequency: 1
        },
        rewards: {
          banner: user.membership.tier === 'free',
          native: false,
          frequency: 1
        }
      }
    };

    res.json(adConfig);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available native ads
router.get('/native-ads', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId).select('membership');

    // Only show native ads to free tier users
    if (user.membership.tier !== 'free') {
      return res.json({ ads: [] });
    }

    // Sample native ads - in production, these would come from a database
    const nativeAds = [
      {
        id: 'native-premium-1',
        title: 'Upgrade to Premium',
        description: 'Get unlimited likes, advanced filters, and see who liked you',
        icon: '⭐',
        cta: 'Learn More',
        ctaUrl: '/membership',
        category: 'Premium Features'
      },
      {
        id: 'native-dating-1',
        title: 'Perfect Your Profile',
        description: 'Add more photos and interests to get more matches',
        icon: '📸',
        cta: 'Edit Profile',
        ctaUrl: '/profile',
        category: 'Profile Tips'
      },
      {
        id: 'native-rewards-1',
        title: 'Earn More Points',
        description: 'Watch videos and complete surveys to earn points for likes and messages',
        icon: '🎁',
        cta: 'Start Earning',
        ctaUrl: '/rewards',
        category: 'Earn Points'
      },
      {
        id: 'native-vip-1',
        title: 'Go VIP',
        description: 'Unlimited messaging, profile boost, and read receipts',
        icon: '👑',
        cta: 'Upgrade Now',
        ctaUrl: '/membership',
        category: 'VIP Features'
      }
    ];

    res.json({ ads: nativeAds });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Track ad impression
router.post('/impression', auth, async (req, res) => {
  try {
    const { adId, pageId, adType } = req.body;

    // In production, you would save this to a database for analytics
    console.log(`Ad impression tracked: ${adId} on ${pageId} (${adType})`);

    res.json({ message: 'Impression tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Track ad click
router.post('/click', auth, async (req, res) => {
  try {
    const { adId, pageId, adType } = req.body;

    // In production, you would save this to a database for analytics
    console.log(`Ad click tracked: ${adId} on ${pageId} (${adType})`);

    res.json({ message: 'Click tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Track ad dismissal
router.post('/dismiss', auth, async (req, res) => {
  try {
    const { adId, pageId, adType } = req.body;

    // In production, you would save this to a database for analytics
    console.log(`Ad dismissed: ${adId} on ${pageId} (${adType})`);

    res.json({ message: 'Dismissal tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
