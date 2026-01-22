const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateQuestionnaire = async () => {
  try {
    console.log('📝 Updating test account questionnaire...\n');

    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      mongoose.connection.close();
      return;
    }

    // Set a questionnaire that will match well with many profiles
    testUser.compatibility.questionnaire = {
      values: ['Family', 'Career', 'Health', 'Adventure'],
      lifestyle: ['Active', 'Social', 'Balanced'],
      relationshipGoal: 'Long-term',
      dealBreakers: ['Dishonesty'],
      interests: ['Travel', 'Sports', 'Arts', 'Food', 'Music'],
      communication: 'Direct',
      finances: 'Balanced',
      health: 'Very important',
      personality: ['Optimistic', 'Empathetic'],
      expectations: ['Honesty & trust', 'Emotional support', 'Mutual respect'],
      completedAt: new Date()
    };

    await testUser.save();
    console.log('✅ Test account questionnaire updated!\n');

    // Now calculate compatibility scores
    console.log('🔄 Calculating compatibility scores...');
    
    const allUsers = await User.find({ _id: { $ne: testUser._id } });
    console.log(`📊 Found ${allUsers.length} other users to compare with\n`);

    let compatibleCount = 0;
    const scores = [];

    for (const otherUser of allUsers) {
      if (!otherUser.compatibility.questionnaire.completedAt) continue;

      const score = calculateCompatibility(testUser, otherUser);
      scores.push({ score, email: otherUser.email });

      if (score >= 70) {
        compatibleCount++;
      }
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    console.log(`✅ Compatibility calculation complete!`);
    console.log(`🎯 Found ${compatibleCount} users with 70%+ compatibility\n`);

    console.log('🏆 Top 10 matches:');
    scores.slice(0, 10).forEach((s, idx) => {
      console.log(`  ${idx + 1}. ${s.email}: ${s.score}%`);
    });

    console.log('\n💡 Now when you visit the Compatibility page, you should see matches!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

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

updateQuestionnaire();
