const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us';

async function downgradeTestUser() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Find the test user
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('Test user not found');
      return;
    }

    console.log('=== BEFORE DOWNGRADE ===');
    console.log('Email:', user.email);
    console.log('Name:', user.profile.name);
    console.log('Tier:', user.membership.tier);
    console.log('Action Points:', user.membership.points);
    console.log('Earned Points:', user.membership.earnedPoints);

    // Downgrade to Premium
    user.membership.tier = 'premium';
    user.membership.points = 500; // Premium action points
    user.membership.earnedPoints = 0; // Reset earned points for testing
    user.membership.subscriptionEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    user.membership.isActive = true;
    
    // Reset daily earnings for testing
    user.dailyEarningsToday = 0;
    user.lastEarningsReset = new Date();
    
    await user.save();

    console.log('\n=== AFTER DOWNGRADE ===');
    console.log('Tier:', user.membership.tier);
    console.log('Action Points:', user.membership.points);
    console.log('Earned Points:', user.membership.earnedPoints);
    console.log('Daily Earnings Today:', user.dailyEarningsToday);
    console.log('\n✅ Test user downgraded to Premium!');
    console.log('\nPremium tier benefits:');
    console.log('- Action Points: 500 (for likes, messages, etc.)');
    console.log('- Daily Earning Limit: 150 points');
    console.log('- Like Cost: 2 points');
    console.log('- Message Cost: 5 points');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

downgradeTestUser();
