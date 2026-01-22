const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixPrefs = async () => {
  try {
    console.log('🔧 Fixing test user preferences...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('👤 Test User: test@example.com');
    console.log('   Old looking for:', testUser.profile.lookingFor);
    
    // Update to look for female
    testUser.profile.lookingFor = ['female'];
    
    await testUser.save();
    
    console.log('   New looking for:', testUser.profile.lookingFor);
    console.log('\n✅ Test user preferences updated!');
    console.log('   Now looking for: female');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

fixPrefs();
