const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const findUser = async () => {
  try {
    const userId = '696bb672a9edf8bb813694ff';
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.profile.name);
    console.log('  Questionnaire completed:', !!user.compatibility.questionnaire.completedAt);
    console.log('  Compatibility scores:', user.compatibility.scores.length);
    
    const matches60 = user.compatibility.scores.filter(s => s.score >= 60);
    console.log('  Matches (60%+):', matches60.length);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

findUser();
