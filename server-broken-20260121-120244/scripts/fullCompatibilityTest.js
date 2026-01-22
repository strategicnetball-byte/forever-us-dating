const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fullTest = async () => {
  try {
    console.log('🔍 FULL COMPATIBILITY TEST\n');
    console.log('=' .repeat(60));
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!testUser || !dummyUser) {
      console.log('❌ Users not found');
      return;
    }
    
    // 1. Check questionnaire
    console.log('\n1️⃣  QUESTIONNAIRE CHECK');
    console.log('-'.repeat(60));
    console.log('Test user questionnaire completed:', !!testUser.compatibility.questionnaire.completedAt);
    console.log('Dummy user questionnaire completed:', !!dummyUser.compatibility.questionnaire.completedAt);
    
    if (!testUser.compatibility.questionnaire.completedAt) {
      console.log('❌ Test user questionnaire not completed!');
      return;
    }
    
    // 2. Check preferences
    console.log('\n2️⃣  PREFERENCES CHECK');
    console.log('-'.repeat(60));
    console.log('Test user looking for:', testUser.profile.lookingFor);
    console.log('Dummy user gender:', dummyUser.profile.gender);
    console.log('Gender match:', testUser.profile.lookingFor.includes(dummyUser.profile.gender) ? '✅' : '❌');
    
    // 3. Check compatibility scores
    console.log('\n3️⃣  COMPATIBILITY SCORES CHECK');
    console.log('-'.repeat(60));
    console.log('Test user total scores:', testUser.compatibility.scores.length);
    
    const dummyScore = testUser.compatibility.scores.find(s => 
      s.userId.toString() === dummyUser._id.toString()
    );
    
    if (dummyScore) {
      console.log('Dummy user score:', dummyScore.score + '%');
      console.log('Score >= 60:', dummyScore.score >= 60 ? '✅' : '❌');
    } else {
      console.log('❌ Dummy user score not found!');
    }
    
    // 4. Check if in 60%+ matches
    console.log('\n4️⃣  MATCHES (60%+) CHECK');
    console.log('-'.repeat(60));
    const matches60 = testUser.compatibility.scores.filter(s => s.score >= 60);
    console.log('Total matches (60%+):', matches60.length);
    
    const dummyIn60 = matches60.find(s => s.userId.toString() === dummyUser._id.toString());
    console.log('Dummy in 60%+ matches:', dummyIn60 ? '✅' : '❌');
    
    // 5. Check API response
    console.log('\n5️⃣  API RESPONSE CHECK');
    console.log('-'.repeat(60));
    
    const apiMatches = testUser.compatibility.scores
      .filter(score => score.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    
    const populatedMatches = await User.populate(apiMatches, {
      path: 'userId',
      select: 'profile.name profile.age profile.photos profile.bio profile.interests membership.tier'
    });
    
    console.log('API would return:', populatedMatches.length, 'matches');
    
    const dummyInAPI = populatedMatches.find(m => 
      m.userId._id.toString() === dummyUser._id.toString()
    );
    
    if (dummyInAPI) {
      console.log('Dummy in API response: ✅');
      console.log('  - Name:', dummyInAPI.userId.profile.name);
      console.log('  - Score:', dummyInAPI.score + '%');
      console.log('  - Photos:', dummyInAPI.userId.profile.photos.length);
      console.log('  - Bio:', dummyInAPI.userId.profile.bio?.substring(0, 40) + '...');
    } else {
      console.log('Dummy in API response: ❌');
    }
    
    // 6. Final verdict
    console.log('\n' + '='.repeat(60));
    console.log('FINAL VERDICT:');
    console.log('='.repeat(60));
    
    if (dummyInAPI) {
      console.log('✅ EVERYTHING LOOKS GOOD!');
      console.log('\nDummy user should appear on compatibility page.');
      console.log('If not showing in browser:');
      console.log('  1. Hard refresh (Ctrl+Shift+R)');
      console.log('  2. Clear browser cache');
      console.log('  3. Log out and log back in');
      console.log('  4. Check browser console for errors');
    } else {
      console.log('❌ ISSUE FOUND - Dummy user not in API response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

fullTest();
