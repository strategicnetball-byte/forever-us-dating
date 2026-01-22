const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const findAll = async () => {
  try {
    const users = await User.find({ email: 'test@example.com' });
    
    console.log('Found', users.length, 'users with email test@example.com\n');
    
    users.forEach((user, i) => {
      console.log(`User ${i + 1}:`);
      console.log('  ID:', user._id.toString());
      console.log('  Email:', user.email);
      console.log('  Name:', user.profile.name);
      console.log('  Questionnaire completed:', !!user.compatibility.questionnaire.completedAt);
      console.log('  Compatibility scores:', user.compatibility.scores.length);
      const matches60 = user.compatibility.scores.filter(s => s.score >= 60);
      console.log('  Matches (60%+):', matches60.length);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

findAll();
