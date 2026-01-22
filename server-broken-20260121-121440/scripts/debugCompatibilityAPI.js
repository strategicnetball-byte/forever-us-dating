const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const debugAPI = async () => {
  try {
    console.log('🔍 Debugging compatibility API response...\n');
    
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
    console.log('   Questionnaire completed:', !!testUser.compatibility.questionnaire.completedAt);
    console.log('   Total scores:', testUser.compatibility.scores.length);
    
    // Simulate API response
    if (!testUser.compatibility.questionnaire.completedAt) {
      console.log('\n❌ Questionnaire not completed - API would return empty matches');
      return;
    }
    
    // Get scores sorted by compatibility (60%+)
    const matches = testUser.compatibility.scores
      .filter(score => score.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    
    console.log('   Matches (60%+):', matches.length);
    
    // Check if dummy is in matches
    const dummyInMatches = matches.find(m => m.userId.toString() === dummyUser._id.toString());
    
    if (dummyInMatches) {
      console.log('   ✅ Dummy user found in matches:', dummyInMatches.score + '%');
    } else {
      console.log('   ❌ Dummy user NOT in matches');
    }
    
    // Populate and check what would be returned
    console.log('\n📋 Simulating API response...');
    
    const populatedMatches = await User.populate(matches, {
      path: 'userId',
      select: 'profile.name profile.age profile.photos profile.bio profile.interests membership.tier'
    });
    
    console.log('   Populated matches count:', populatedMatches.length);
    
    if (populatedMatches.length > 0) {
      console.log('\n   Top 3 matches:');
      populatedMatches.slice(0, 3).forEach((m, i) => {
        console.log(`   ${i + 1}. ${m.userId.profile.name} (${m.score}%)`);
        console.log(`      Photos: ${m.userId.profile.photos.length}`);
        console.log(`      Bio: ${m.userId.profile.bio?.substring(0, 50)}...`);
      });
    }
    
    // Check dummy user details
    console.log('\n👤 Dummy User Details:');
    console.log('   Name:', dummyUser.profile.name);
    console.log('   Age:', dummyUser.profile.age);
    console.log('   Photos:', dummyUser.profile.photos.length);
    console.log('   Bio:', dummyUser.profile.bio?.substring(0, 50));
    console.log('   Interests:', dummyUser.profile.interests.length);
    console.log('   Tier:', dummyUser.membership.tier);
    
    if (dummyInMatches) {
      console.log('\n✅ Everything looks good! Dummy user should appear on compatibility page.');
    } else {
      console.log('\n❌ Issue: Dummy user not in matches. Check score calculation.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

debugAPI();
