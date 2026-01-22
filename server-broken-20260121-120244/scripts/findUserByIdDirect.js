const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const find = async () => {
  try {
    // Try to find the user with that ID
    const userId = '696bb672a9edf8bb813694ff';
    
    console.log('Searching for user ID:', userId);
    
    const user = await User.findById(userId);
    
    if (user) {
      console.log('Found user:');
      console.log('  Email:', user.email);
      console.log('  Name:', user.profile.name);
      console.log('  Questionnaire completed:', !!user.compatibility.questionnaire.completedAt);
      console.log('  Compatibility scores:', user.compatibility.scores.length);
    } else {
      console.log('User NOT found with that ID');
      
      // Try to find all users and see what IDs exist
      console.log('\nSearching for all users with "test" in email:');
      const testUsers = await User.find({ email: /test/i });
      testUsers.forEach(u => {
        console.log('  -', u._id.toString(), ':', u.email);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

find();
