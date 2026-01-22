const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us';

async function migrateUsers() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const users = await User.find();
    
    console.log(`Found ${users.length} users to migrate\n`);

    for (const user of users) {
      // Initialize earnedPoints if not already set
      if (!user.membership.earnedPoints) {
        user.membership.earnedPoints = 0;
      }

      // For VIP members, set action points to unlimited (999999)
      if (user.membership.tier === 'vip') {
        user.membership.points = 999999;
        console.log(`✓ ${user.profile.name} (VIP): Action points set to unlimited (999999)`);
      } 
      // For Premium members, ensure they have enough action points
      else if (user.membership.tier === 'premium') {
        if (user.membership.points < 500) {
          user.membership.points = 500;
          console.log(`✓ ${user.profile.name} (Premium): Action points set to 500`);
        }
      }
      // For Free members, ensure they have starting points
      else {
        if (user.membership.points < 100) {
          user.membership.points = 100;
          console.log(`✓ ${user.profile.name} (Free): Action points set to 100`);
        }
      }

      await user.save();
    }

    console.log('\n=== MIGRATION COMPLETE ===');
    console.log('All users have been updated with the new points system:');
    console.log('- Action Points: For likes, messages, etc.');
    console.log('- Earned Points: For giveaways, bonuses, contests');
    console.log('\nVIP members now have unlimited action points (999999)');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

migrateUsers();
