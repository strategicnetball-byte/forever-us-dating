const mongoose = require('mongoose');
const User = require('../models/User');

async function checkLikes() {
  try {
    await mongoose.connect('mongodb://localhost:27017/forever-us');
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'test@example.com' }).populate('likes', 'email profile.name').populate('matches', 'email profile.name');
    if (!testUser) {
      console.log('❌ Test user not found');
      process.exit(1);
    }
    console.log('✅ Found test user:', testUser.profile.name);
    console.log('   ID:', testUser._id);

    console.log('\n❤️ Likes:', testUser.likes.length);
    testUser.likes.slice(0, 5).forEach((like, idx) => {
      console.log(`  ${idx + 1}. ${like.profile.name} (${like._id})`);
    });

    console.log('\n📌 Matches:', testUser.matches.length);
    testUser.matches.forEach((match, idx) => {
      console.log(`  ${idx + 1}. ${match.profile.name} (${match._id})`);
    });

    // Check who has liked the test user back
    const usersWhoLikedTestUser = await User.find({ likes: testUser._id }).select('profile.name _id');
    console.log('\n💕 Users who liked test user:', usersWhoLikedTestUser.length);
    usersWhoLikedTestUser.slice(0, 5).forEach((user, idx) => {
      console.log(`  ${idx + 1}. ${user.profile.name} (${user._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkLikes();
