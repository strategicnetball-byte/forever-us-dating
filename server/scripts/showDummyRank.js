const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const showRank = async () => {
  try {
    console.log('🏆 Finding dummy user rank in compatibility matches...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!testUser || !dummyUser) {
      console.log('❌ Users not found');
      return;
    }
    
    // Get all scores sorted by compatibility
    const allMatches = testUser.compatibility.scores
      .sort((a, b) => b.score - a.score);
    
    // Find dummy user's position
    const dummyPosition = allMatches.findIndex(m => m.userId.toString() === dummyUser._id.toString());
    
    if (dummyPosition === -1) {
      console.log('❌ Dummy user not in scores');
      return;
    }
    
    const dummyScore = allMatches[dummyPosition];
    
    console.log('📊 All Compatibility Scores (sorted by score):');
    console.log('   Total scores:', allMatches.length);
    console.log('   Scores >= 60%:', allMatches.filter(s => s.score >= 60).length);
    
    console.log('\n🏆 Dummy User Rank:');
    console.log('   Position:', dummyPosition + 1);
    console.log('   Score:', dummyScore.score + '%');
    console.log('   Status:', dummyScore.score >= 60 ? '✅ VISIBLE (60%+)' : '❌ HIDDEN (<60%)');
    
    console.log('\n📈 Top 10 Matches:');
    allMatches.slice(0, 10).forEach((m, i) => {
      const isHighlight = m.userId.toString() === dummyUser._id.toString();
      const marker = isHighlight ? '👉' : '  ';
      console.log(`   ${marker} ${i + 1}. Score: ${m.score}%`);
    });
    
    if (dummyPosition >= 10) {
      console.log('\n📍 Dummy User Position:');
      const start = Math.max(0, dummyPosition - 2);
      const end = Math.min(allMatches.length, dummyPosition + 3);
      allMatches.slice(start, end).forEach((m, i) => {
        const isHighlight = m.userId.toString() === dummyUser._id.toString();
        const marker = isHighlight ? '👉' : '  ';
        console.log(`   ${marker} ${start + i + 1}. Score: ${m.score}%`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

showRank();
