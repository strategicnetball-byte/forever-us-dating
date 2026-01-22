const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const recalculateAll = async () => {
  try {
    console.log('🔄 Recalculating all compatibility scores...\n');

    // Get all users with completed questionnaires
    const users = await User.find({
      'compatibility.questionnaire.completedAt': { $exists: true, $ne: null }
    });

    console.log(`📊 Found ${users.length} users with completed questionnaires\n`);

    let totalScoresCreated = 0;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`[${i + 1}/${users.length}] Processing ${user.email}...`);

      // Clear existing scores
      user.compatibility.scores = [];

      // Calculate scores with all other users
      for (const otherUser of users) {
        if (user._id.toString() === otherUser._id.toString()) continue;

        const score = calculateCompatibility(user, otherUser);
        user.compatibility.scores.push({
          userId: otherUser._id,
          score,
          calculatedAt: new Date()
        });
        totalScoresCreated++;
      }

      await user.save();
      console.log(`  ✅ Saved ${user.compatibility.scores.length} scores`);
    }

    console.log(`\n✅ Recalculation complete!`);
    console.log(`📊 Total scores created: ${totalScoresCreated}`);

    // Show test user stats
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (testUser) {
      const highScores = testUser.compatibility.scores.filter(s => s.score >= 70);
      console.log(`\n🎯 Test user (test@example.com):`);
      console.log(`   Total scores: ${testUser.compatibility.scores.length}`);
      console.log(`   70%+ compatibility: ${highScores.length}`);
      
      if (highScores.length > 0) {
        console.log(`\n🏆 Top 5 matches:`);
        highScores
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .forEach((s, idx) => {
            console.log(`   ${idx + 1}. ${s.score}%`);
          });
      }
    }

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

recalculateAll();
