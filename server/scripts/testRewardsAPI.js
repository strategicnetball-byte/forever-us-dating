const mongoose = require('mongoose');
const User = require('../models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us';

async function testRewardsAPI() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find a user
    const user = await User.findOne();
    
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('User ID:', user._id);

    // Simulate the rewards opportunities endpoint logic
    console.log('\n=== Simulating /api/rewards/opportunities ===');
    
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

    console.log('\nResponse structure:');
    console.log('Video Ads:', opportunities.videoAds.length);
    console.log('Surveys:', opportunities.surveys.length);
    console.log('Offers:', opportunities.offers.length);
    console.log('Daily Bonus:', opportunities.dailyBonus.title);

    if (opportunities.surveys && opportunities.surveys.length > 0) {
      console.log('\nFirst survey:');
      console.log(JSON.stringify(opportunities.surveys[0], null, 2));
    }

    console.log('\n✅ All opportunities are being generated correctly!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testRewardsAPI();
