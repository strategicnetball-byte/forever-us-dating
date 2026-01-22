const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkPrefs = async () => {
  try {
    console.log('🔍 Checking user preferences and gender compatibility...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!testUser || !dummyUser) {
      console.log('❌ Users not found');
      return;
    }
    
    console.log('👤 Test User: test@example.com');
    console.log('   Gender:', testUser.profile.gender);
    console.log('   Looking for:', testUser.profile.lookingFor);
    console.log('   Age range:', testUser.preferences.ageRange);
    console.log('   Max distance:', testUser.preferences.maxDistance);
    
    console.log('\n👤 Dummy User: dummy@example.com');
    console.log('   Gender:', dummyUser.profile.gender);
    console.log('   Age:', dummyUser.profile.age);
    console.log('   Location:', dummyUser.profile.location);
    
    // Check if dummy matches test user's preferences
    console.log('\n✅ Compatibility Check:');
    
    const genderMatch = testUser.profile.lookingFor.includes(dummyUser.profile.gender);
    console.log('   Gender match:', genderMatch ? '✅ YES' : '❌ NO');
    
    const ageMatch = dummyUser.profile.age >= testUser.preferences.ageRange.min && 
                     dummyUser.profile.age <= testUser.preferences.ageRange.max;
    console.log('   Age match:', ageMatch ? '✅ YES' : '❌ NO');
    
    if (!genderMatch) {
      console.log('\n⚠️  ISSUE: Test user is not looking for', dummyUser.profile.gender);
      console.log('   Test user looking for:', testUser.profile.lookingFor);
    }
    
    if (!ageMatch) {
      console.log('\n⚠️  ISSUE: Dummy user age outside range');
      console.log('   Dummy age:', dummyUser.profile.age);
      console.log('   Test user range:', testUser.preferences.ageRange);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

checkPrefs();
