const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const debug = async () => {
  try {
    console.log('🔍 Debugging compatibility system...\n');

    // Find test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      mongoose.connection.close();
      return;
    }

    console.log('✅ Test user found:', testUser.email);
    console.log('📋 Questionnaire completed:', !!testUser.compatibility.questionnaire.completedAt);
    console.log('📊 Compatibility scores count:', testUser.compatibility.scores.length);

    // Count all users
    const totalUsers = await User.countDocuments();
    console.log('\n📈 Total users in database:', totalUsers);

    // Count users with completed questionnaires
    const usersWithQuestionnaire = await User.countDocuments({
      'compatibility.questionnaire.completedAt': { $exists: true, $ne: null }
    });
    console.log('📋 Users with completed questionnaires:', usersWithQuestionnaire);

    // Count dummy profiles
    const dummyProfiles = await User.countDocuments({
      email: { $regex: /@example\.com$/ }
    });
    console.log('🤖 Dummy profiles:', dummyProfiles);

    // Check if test user has any scores
    if (testUser.compatibility.scores.length > 0) {
      console.log('\n✅ Test user has compatibility scores!');
      const topScores = testUser.compatibility.scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      
      console.log('🏆 Top 5 scores:');
      topScores.forEach((score, idx) => {
        console.log(`  ${idx + 1}. Score: ${score.score}%`);
      });
    } else {
      console.log('\n⚠️  Test user has NO compatibility scores');
      console.log('💡 This means compatibility calculation hasn\'t run yet');
    }

    // Check a dummy profile
    const dummyUser = await User.findOne({ email: { $regex: /\..*\d+@example\.com$/ } });
    if (dummyUser) {
      console.log('\n🤖 Sample dummy profile:');
      console.log('   Email:', dummyUser.email);
      console.log('   Questionnaire completed:', !!dummyUser.compatibility.questionnaire.completedAt);
      console.log('   Compatibility scores:', dummyUser.compatibility.scores.length);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

debug();
