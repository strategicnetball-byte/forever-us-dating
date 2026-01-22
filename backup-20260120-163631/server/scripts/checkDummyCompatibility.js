const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Calculate compatibility score between two users (0-100)
function calculateCompatibility(user1, user2) {
  let score = 0;
  let factors = 0;

  const q1 = user1.compatibility.questionnaire;
  const q2 = user2.compatibility.questionnaire;

  // Helper to compare values (handles both strings and arrays)
  const compareValues = (val1, val2) => {
    if (Array.isArray(val1) && Array.isArray(val2)) {
      const shared = val1.filter(v => val2.includes(v)).length;
      return shared / Math.max(val1.length, val2.length, 1);
    }
    return val1 === val2 ? 1 : 0;
  };

  // Values match (20 points)
  const valuesMatch = compareValues(q1.values, q2.values);
  score += valuesMatch * 20;
  factors += 20;

  // Lifestyle match (20 points)
  const lifestyleMatch = compareValues(q1.lifestyle, q2.lifestyle);
  score += lifestyleMatch * 20;
  factors += 20;

  // Relationship goal match (25 points) - most important
  if (q1.relationshipGoal === q2.relationshipGoal) {
    score += 25;
  } else {
    score += 5;
  }
  factors += 25;

  // Deal-breakers check (15 points)
  const hasConflictingDealBreaker = q1.dealBreakers.some(db => 
    q2.dealBreakers.includes(db)
  );
  if (!hasConflictingDealBreaker) {
    score += 15;
  }
  factors += 15;

  // Shared interests (20 points)
  const interestsMatch = compareValues(q1.interests, q2.interests);
  score += interestsMatch * 20;
  factors += 20;

  return Math.round((score / factors) * 100);
}

const checkCompatibility = async () => {
  try {
    console.log('🔍 Checking compatibility between test user and dummy user...\n');
    
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
    console.log('   Values:', testUser.compatibility.questionnaire.values);
    console.log('   Lifestyle:', testUser.compatibility.questionnaire.lifestyle);
    console.log('   Relationship Goal:', testUser.compatibility.questionnaire.relationshipGoal);
    console.log('   Deal-breakers:', testUser.compatibility.questionnaire.dealBreakers);
    console.log('   Interests:', testUser.compatibility.questionnaire.interests);
    
    console.log('\n👤 Dummy User: dummy@example.com');
    console.log('   Questionnaire completed:', !!dummyUser.compatibility.questionnaire.completedAt);
    console.log('   Values:', dummyUser.compatibility.questionnaire.values);
    console.log('   Lifestyle:', dummyUser.compatibility.questionnaire.lifestyle);
    console.log('   Relationship Goal:', dummyUser.compatibility.questionnaire.relationshipGoal);
    console.log('   Deal-breakers:', dummyUser.compatibility.questionnaire.dealBreakers);
    console.log('   Interests:', dummyUser.compatibility.questionnaire.interests);
    
    if (!testUser.compatibility.questionnaire.completedAt || !dummyUser.compatibility.questionnaire.completedAt) {
      console.log('\n❌ One or both users have not completed the questionnaire');
      return;
    }
    
    const compatibilityScore = calculateCompatibility(testUser, dummyUser);
    
    console.log('\n📊 Compatibility Score:', compatibilityScore + '%');
    
    if (compatibilityScore >= 60) {
      console.log('✅ PASS - Users meet the 60% minimum compatibility requirement');
    } else {
      console.log('❌ FAIL - Users do NOT meet the 60% minimum compatibility requirement');
      console.log('\n💡 Recommendations to improve compatibility:');
      
      // Analyze what's missing
      const testValues = testUser.compatibility.questionnaire.values;
      const dummyValues = dummyUser.compatibility.questionnaire.values;
      const sharedValues = testValues.filter(v => dummyValues.includes(v));
      console.log(`   - Shared values: ${sharedValues.length}/${Math.max(testValues.length, dummyValues.length)}`);
      
      const testLifestyle = testUser.compatibility.questionnaire.lifestyle;
      const dummyLifestyle = dummyUser.compatibility.questionnaire.lifestyle;
      const sharedLifestyle = testLifestyle.filter(l => dummyLifestyle.includes(l));
      console.log(`   - Shared lifestyle: ${sharedLifestyle.length}/${Math.max(testLifestyle.length, dummyLifestyle.length)}`);
      
      console.log(`   - Relationship goal match: ${testUser.compatibility.questionnaire.relationshipGoal === dummyUser.compatibility.questionnaire.relationshipGoal ? 'YES' : 'NO'}`);
      
      const testInterests = testUser.compatibility.questionnaire.interests;
      const dummyInterests = dummyUser.compatibility.questionnaire.interests;
      const sharedInterests = testInterests.filter(i => dummyInterests.includes(i));
      console.log(`   - Shared interests: ${sharedInterests.length}/${Math.max(testInterests.length, dummyInterests.length)}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

checkCompatibility();
