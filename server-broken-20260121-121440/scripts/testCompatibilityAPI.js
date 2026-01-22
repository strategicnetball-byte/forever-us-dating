const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testAPI = async () => {
  try {
    console.log('🧪 Testing compatibility API response...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('👤 Test User: test@example.com');
    console.log('   Questionnaire completed:', !!testUser.compatibility.questionnaire.completedAt);
    
    if (!testUser.compatibility.questionnaire.completedAt) {
      console.log('\n❌ Questionnaire not completed');
      return;
    }
    
    // Simulate the exact API call
    const matches = testUser.compatibility.scores
      .filter(score => score.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    
    console.log('   Total scores:', testUser.compatibility.scores.length);
    console.log('   Matches (60%+):', matches.length);
    
    // Populate user details (exact same as API)
    const populatedMatches = await User.populate(matches, {
      path: 'userId',
      select: 'profile.name profile.age profile.photos profile.bio profile.interests membership.tier'
    });
    
    console.log('   Populated matches:', populatedMatches.length);
    
    // Check if dummy is in response
    const dummyInResponse = populatedMatches.find(m => 
      m.userId._id.toString() === dummyUser._id.toString()
    );
    
    if (dummyInResponse) {
      console.log('\n✅ Dummy user IS in API response');
      console.log('   Name:', dummyInResponse.userId.profile.name);
      console.log('   Score:', dummyInResponse.score + '%');
      console.log('   Photos:', dummyInResponse.userId.profile.photos.length);
    } else {
      console.log('\n❌ Dummy user NOT in API response');
    }
    
    // Show what would be returned
    console.log('\n📋 API Response (first 3 matches):');
    const apiResponse = populatedMatches.map(m => ({
      ...m.toObject(),
      user: m.userId
    }));
    
    apiResponse.slice(0, 3).forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.userId.profile.name} (${m.score}%)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

testAPI();
