const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkData = async () => {
  try {
    console.log('🔍 Checking database for browse data...\n');
    
    // Count all users
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);
    
    // Count dummy profiles
    const dummyProfiles = await User.countDocuments({ email: { $regex: /@example\.com$/ } });
    console.log(`👥 Dummy profiles: ${dummyProfiles}`);
    
    // Count real profiles
    const realProfiles = totalUsers - dummyProfiles;
    console.log(`👤 Real profiles: ${realProfiles}`);
    
    // Get first real user (your account)
    const realUser = await User.findOne({ email: { $not: { $regex: /@example\.com$/ } } });
    
    if (realUser) {
      console.log(`\n👤 Your account: ${realUser.email}`);
      console.log(`   Likes: ${realUser.likes.length}`);
      console.log(`   Passes: ${realUser.passes.length}`);
      console.log(`   Matches: ${realUser.matches.length}`);
      
      // Calculate available profiles
      const excludeIds = [
        realUser._id,
        ...realUser.likes,
        ...realUser.passes
      ];
      
      const availableProfiles = await User.countDocuments({
        _id: { $nin: excludeIds }
      });
      
      console.log(`\n📋 Available profiles to browse: ${availableProfiles}`);
      
      if (availableProfiles === 0) {
        console.log('\n⚠️  No profiles available! This means:');
        console.log('   1. You\'ve liked/passed all profiles, OR');
        console.log('   2. There are no dummy profiles in the database');
        console.log('\n💡 Solution: Run the seed script again:');
        console.log('   node server/scripts/seedProfilesWithQuestionnaires.js');
      }
    } else {
      console.log('\n⚠️  No real user found! Create an account first.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkData();
