const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us';

async function checkUserTier() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Find the first user (test user)
    const user = await User.findOne();
    
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('=== TEST USER INFO ===');
    console.log('Email:', user.email);
    console.log('Name:', user.profile.name);
    console.log('Current Tier:', user.membership.tier);
    console.log('Current Points:', user.membership.points);
    console.log('Daily Earnings Today:', user.dailyEarningsToday);
    console.log('Last Earnings Reset:', user.lastEarningsReset);
    
    const dailyLimits = {
      free: 50,
      premium: 150,
      vip: null
    };
    
    const limit = dailyLimits[user.membership.tier];
    console.log('\nDaily Limit for', user.membership.tier + ':', limit === null ? 'Unlimited' : limit + ' points');
    console.log('Earned Today:', user.dailyEarningsToday);
    
    if (limit && user.dailyEarningsToday >= limit) {
      console.log('⚠️ Daily limit reached!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkUserTier();
