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

const calculateAndStore = async () => {
  try {
    console.log('🔄 Calculating and storing compatibility scores...\n');
    
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
    
    if (!testUser.compatibility.questionnaire.completedAt || !dummyUser.compatibility.questionnaire.completedAt) {
      console.log('❌ One or both users have not completed the questionnaire');
      return;
    }
    
    const compatibilityScore = calculateCompatibility(testUser, dummyUser);
    
    console.log('📊 Calculated compatibility score:', compatibilityScore + '%');
    
    // Update test user's scores
    const testUserScoreIndex = testUser.compatibility.scores.findIndex(s => 
      s.userId.toString() === dummyUser._id.toString()
    );
    
    if (testUserScoreIndex >= 0) {
      testUser.compatibility.scores[testUserScoreIndex].score = compatibilityScore;
      testUser.compatibility.scores[testUserScoreIndex].calculatedAt = new Date();
      console.log('✏️  Updated existing score for test user');
    } else {
      testUser.compatibility.scores.push({
        userId: dummyUser._id,
        score: compatibilityScore,
        calculatedAt: new Date()
      });
      console.log('➕ Added new score for test user');
    }
    
    // Update dummy user's scores
    const dummyUserScoreIndex = dummyUser.compatibility.scores.findIndex(s => 
      s.userId.toString() === testUser._id.toString()
    );
    
    if (dummyUserScoreIndex >= 0) {
      dummyUser.compatibility.scores[dummyUserScoreIndex].score = compatibilityScore;
      dummyUser.compatibility.scores[dummyUserScoreIndex].calculatedAt = new Date();
      console.log('✏️  Updated existing score for dummy user');
    } else {
      dummyUser.compatibility.scores.push({
        userId: testUser._id,
        score: compatibilityScore,
        calculatedAt: new Date()
      });
      console.log('➕ Added new score for dummy user');
    }
    
    // Save both users
    await testUser.save();
    await dummyUser.save();
    
    console.log('\n✅ Compatibility scores saved successfully!');
    console.log('\n📋 Summary:');
    console.log('   Test User scores count:', testUser.compatibility.scores.length);
    console.log('   Dummy User scores count:', dummyUser.compatibility.scores.length);
    console.log('   Compatibility between them:', compatibilityScore + '%');
    console.log('\n🎉 Dummy user should now appear on compatibility page!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

calculateAndStore();
