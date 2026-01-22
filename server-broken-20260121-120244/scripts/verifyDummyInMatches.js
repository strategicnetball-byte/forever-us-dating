const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const verifyMatches = async () => {
  try {
    console.log('🔍 Verifying dummy user in compatibility matches...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }
    
    if (!dummyUser) {
      console.log('❌ Dummy user not found');
      return;
    }
    
    console.log('👤 Test User: test@example.com');
    console.log('   Total compatibility scores:', testUser.compatibility.scores.length);
    
    // Get matches (60%+)
    const matches = testUser.compatibility.scores
      .filter(score => score.score >= 60)
      .sort((a, b) => b.score - a.score);
    
    console.log('   Matches (60%+):', matches.length);
    
    // Check if dummy user is in matches
    const dummyMatch = matches.find(m => m.userId.toString() === dummyUser._id.toString());
    
    if (dummyMatch) {
      console.log('\n✅ FOUND - Dummy user in compatibility matches!');
      console.log('   Score:', dummyMatch.score + '%');
      console.log('   Calculated at:', dummyMatch.calculatedAt);
    } else {
      console.log('\n❌ NOT FOUND - Dummy user not in compatibility matches');
      console.log('\n📊 Top 5 matches:');
      matches.slice(0, 5).forEach((m, i) => {
        console.log(`   ${i + 1}. Score: ${m.score}%`);
      });
    }
    
    console.log('\n👤 Dummy User: dummy@example.com');
    console.log('   Total compatibility scores:', dummyUser.compatibility.scores.length);
    
    // Check test user in dummy's matches
    const testUserMatch = dummyUser.compatibility.scores.find(m => 
      m.userId.toString() === testUser._id.toString()
    );
    
    if (testUserMatch) {
      console.log('   Test user score:', testUserMatch.score + '%');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

verifyMatches();
