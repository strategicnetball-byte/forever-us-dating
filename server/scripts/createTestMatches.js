const mongoose = require('mongoose');
const User = require('../models/User');

async function createMatches() {
  try {
    await mongoose.connect('mongodb://localhost:27017/forever-us');
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      process.exit(1);
    }
    console.log('✅ Found test user:', testUser.profile.name);

    // Get the first 3 people the test user has liked
    const peopleToMatch = testUser.likes.slice(0, 3);
    console.log('\n📌 Creating matches with:', peopleToMatch.length, 'users');

    for (const userId of peopleToMatch) {
      const otherUser = await User.findById(userId);
      if (!otherUser) continue;

      // Add test user to other user's likes (if not already there)
      if (!otherUser.likes.includes(testUser._id)) {
        otherUser.likes.push(testUser._id);
      }

      // Add to matches for both users
      if (!otherUser.matches.includes(testUser._id)) {
        otherUser.matches.push(testUser._id);
      }
      if (!testUser.matches.includes(userId)) {
        testUser.matches.push(userId);
      }

      await otherUser.save();
      console.log(`✅ Matched with ${otherUser.profile.name}`);
    }

    await testUser.save();
    console.log('\n✅ Test user now has', testUser.matches.length, 'matches');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createMatches();
