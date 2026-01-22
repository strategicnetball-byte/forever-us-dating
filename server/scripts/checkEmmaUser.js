const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

async function checkEmmaUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔍 Searching for Emma Davies...\n');

    // Search for Emma Davies
    const emmaUsers = await User.find({ 
      'profile.name': { $regex: 'Emma', $options: 'i' }
    }).select('email profile membership');

    if (emmaUsers.length === 0) {
      console.log('❌ No Emma found in database');
      process.exit(0);
    }

    console.log(`✅ Found ${emmaUsers.length} Emma(s):\n`);

    emmaUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.profile.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Tier: ${user.membership.tier.toUpperCase()}`);
      console.log(`   Points: ${user.membership.points}`);
      console.log(`   Earned Points: ${user.membership.earnedPoints || 0}`);
      console.log(`   Daily Earnings Today: ${user.dailyEarningsToday || 0}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkEmmaUser();
