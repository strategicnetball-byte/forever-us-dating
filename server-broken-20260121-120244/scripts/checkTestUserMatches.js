const mongoose = require('mongoose');
const User = require('../models/User');

async function checkMatches() {
  try {
    await mongoose.connect('mongodb://localhost:27017/forever-us');
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'test@example.com' }).populate('matches', 'email profile.name');
    if (!testUser) {
      console.log('❌ Test user not found');
      process.exit(1);
    }
    console.log('✅ Found test user:', testUser.profile.name);
    console.log('   ID:', testUser._id);

    console.log('\n📌 Matches found:', testUser.matches.length);
    testUser.matches.forEach((match, idx) => {
      console.log(`\nMatch ${idx + 1}:`);
      console.log('  Name:', match.profile.name);
      console.log('  ID:', match._id);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMatches();
