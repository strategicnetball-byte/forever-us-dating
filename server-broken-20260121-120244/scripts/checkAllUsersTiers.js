const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us';

async function checkAllUsersTiers() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const users = await User.find().select('email profile.name membership.tier membership.points dailyEarningsToday lastEarningsReset');
    
    console.log('=== ALL USERS ===\n');
    
    users.forEach((user, index) => {
      const dailyLimits = {
        free: 50,
        premium: 150,
        vip: null
      };
      
      const limit = dailyLimits[user.membership.tier];
      const today = new Date().toDateString();
      const lastReset = user.lastEarningsReset ? new Date(user.lastEarningsReset).toDateString() : 'Never';
      const isToday = lastReset === today;
      
      console.log(`${index + 1}. ${user.profile.name} (${user.email})`);
      console.log(`   Tier: ${user.membership.tier}`);
      console.log(`   Points: ${user.membership.points}`);
      console.log(`   Daily Limit: ${limit === null ? 'Unlimited' : limit + ' points'}`);
      console.log(`   Earned Today: ${user.dailyEarningsToday}`);
      console.log(`   Last Reset: ${lastReset} ${isToday ? '(TODAY)' : ''}`);
      
      if (limit && user.dailyEarningsToday >= limit) {
        console.log(`   ⚠️ Daily limit reached!`);
      }
      console.log();
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAllUsersTiers();
