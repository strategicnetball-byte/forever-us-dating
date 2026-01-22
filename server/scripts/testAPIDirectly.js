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
    console.log('🧪 Testing API endpoint directly...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!testUser || !dummyUser) {
      console.log('❌ Users not found');
      return;
    }
    
    console.log('Simulating: GET /api/compatibility/matches');
    console.log('User ID:', testUser._id);
    console.log('');
    
    // Simulate the exact API call
    if (!testUser.compatibility.questionnaire.completedAt) {
      console.log('Response: { matches: [], questionnaireCompleted: false }');
      return;
    }

    const matches = testUser.compatibility.scores
      .filter(score => score.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);

    console.log('Scores >= 60:', matches.length);
    console.log('');

    const populatedMatches = await User.populate(matches, {
      path: 'userId',
      select: 'profile.name profile.age profile.photos profile.bio profile.interests membership.tier'
    });

    const response = {
      matches: populatedMatches.map(m => ({
        ...m.toObject(),
        user: m.userId
      })),
      questionnaireCompleted: true
    };

    console.log('Response matches count:', response.matches.length);
    console.log('');
    
    // Check if Emma is in response
    const emmaInResponse = response.matches.find(m => 
      m.userId._id.toString() === dummyUser._id.toString()
    );
    
    if (emmaInResponse) {
      console.log('✅ Emma IS in response');
      console.log('   Name:', emmaInResponse.userId.profile.name);
      console.log('   Score:', emmaInResponse.score + '%');
      console.log('   Photos:', emmaInResponse.userId.profile.photos.length);
      console.log('   Bio:', emmaInResponse.userId.profile.bio);
    } else {
      console.log('❌ Emma NOT in response');
      console.log('');
      console.log('First 5 matches in response:');
      response.matches.slice(0, 5).forEach((m, i) => {
        console.log(`  ${i + 1}. ${m.userId.profile.name} (${m.score}%)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

testAPI();
