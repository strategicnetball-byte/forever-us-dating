const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us';

async function upgradeTestUser() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Find the test user
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('Test user not found');
      return;
    }

    console.log('=== BEFORE UPGRADE ===');
    console.log('Email:', user.email);
    console.log('Name:', user.profile.name);
    console.log('Tier:', user.membership.tier);
    console.log('Points:', user.membership.points);

    // Upgrade to VIP
    user.membership.tier = 'vip';
    user.membership.subscriptionEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    user.membership.isActive = true;
    
    // Give bonus points for upgrading
    user.membership.points += 200;
    
    await user.save();

    console.log('\n=== AFTER UPGRADE ===');
    console.log('Tier:', user.membership.tier);
    console.log('Points:', user.membership.points);
    console.log('Subscription End:', user.membership.subscriptionEnd);
    console.log('\n✅ Test user upgraded to VIP!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

upgradeTestUser();
