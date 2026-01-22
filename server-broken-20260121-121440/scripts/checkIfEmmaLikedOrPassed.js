const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const check = async () => {
  try {
    console.log('🔍 Checking if Emma is in test user likes/passes...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!testUser || !dummyUser) {
      console.log('❌ Users not found');
      return;
    }
    
    console.log('👤 Test User: test@example.com');
    console.log('   Total likes:', testUser.likes.length);
    console.log('   Total passes:', testUser.passes.length);
    console.log('   Total matches:', testUser.matches.length);
    
    // Check if Emma is liked
    const emmaLiked = testUser.likes.find(like => 
      like.userId.toString() === dummyUser._id.toString()
    );
    
    console.log('\n👤 Emma (dummy@example.com):');
    console.log('   In likes:', emmaLiked ? '✅ YES' : '❌ NO');
    
    // Check if Emma is passed
    const emmaPassed = testUser.passes.find(pass => {
      if (!pass) return false;
      const passId = typeof pass === 'object' ? pass.toString() : pass;
      return passId === dummyUser._id.toString();
    });
    
    console.log('   In passes:', emmaPassed ? '✅ YES' : '❌ NO');
    
    // Check if Emma is in matches
    const emmaMatched = testUser.matches.find(match => {
      if (!match) return false;
      const matchId = typeof match === 'object' ? match.toString() : match;
      return matchId === dummyUser._id.toString();
    });
    
    console.log('   In matches:', emmaMatched ? '✅ YES' : '❌ NO');
    
    if (emmaLiked || emmaPassed || emmaMatched) {
      console.log('\n⚠️  Emma is in one of the exclusion lists!');
      console.log('   This would exclude her from browse, but NOT from compatibility matches');
    } else {
      console.log('\n✅ Emma is NOT in any exclusion lists');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

check();
