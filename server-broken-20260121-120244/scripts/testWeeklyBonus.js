const mongoose = require('mongoose');
const User = require('../models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us';

async function testWeeklyBonus() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find a premium or VIP user
    const user = await User.findOne({ 'membership.tier': { $in: ['premium', 'vip'] } });
    
    if (!user) {
      console.log('No premium/VIP user found. Creating test user...');
      const newUser = new User({
        email: `test-weekly-${Date.now()}@test.com`,
        password: 'password123',
        profile: {
          name: 'Test User',
          age: 25,
          gender: 'male',
          lookingFor: ['female']
        },
        membership: {
          tier: 'premium',
          points: 100
        }
      });
      await newUser.save();
      console.log('Created test user:', newUser._id);
      console.log('Initial points:', newUser.membership.points);
      console.log('Last weekly bonus:', newUser.lastWeeklyBonus);
      return;
    }

    console.log('\n=== BEFORE WEEKLY BONUS ===');
    console.log('User ID:', user._id);
    console.log('Tier:', user.membership.tier);
    console.log('Points:', user.membership.points);
    console.log('Last Weekly Bonus:', user.lastWeeklyBonus);

    // Simulate the weekly bonus logic
    const lastBonus = user.lastWeeklyBonus ? new Date(user.lastWeeklyBonus) : null;
    const now = new Date();
    const daysSinceBonus = lastBonus ? Math.floor((now - lastBonus) / (1000 * 60 * 60 * 24)) : 999;

    console.log('\nDays since last bonus:', daysSinceBonus);

    if (daysSinceBonus < 7) {
      console.log('ERROR: Weekly bonus already claimed. Available again in', 7 - daysSinceBonus, 'days');
      return;
    }

    // Add bonus points
    const bonusAmount = user.membership.tier === 'premium' ? 25 : 50;
    console.log('\nBonus amount to add:', bonusAmount);

    user.membership.points += bonusAmount;
    user.lastWeeklyBonus = now;
    
    console.log('\n=== AFTER CALCULATION (before save) ===');
    console.log('Points:', user.membership.points);
    console.log('Last Weekly Bonus:', user.lastWeeklyBonus);

    await user.save();

    console.log('\n=== AFTER SAVE ===');
    const updatedUser = await User.findById(user._id);
    console.log('Points:', updatedUser.membership.points);
    console.log('Last Weekly Bonus:', updatedUser.lastWeeklyBonus);

    console.log('\n✅ Weekly bonus test completed successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testWeeklyBonus();
