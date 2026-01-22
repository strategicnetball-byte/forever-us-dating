const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkProfiles = async () => {
  try {
    console.log('🔍 Checking profiles in database...');
    
    const totalUsers = await User.countDocuments();
    console.log(`Total users in database: ${totalUsers}`);
    
    const dummyUsers = await User.countDocuments({ email: { $regex: /@example\.com$/ } });
    console.log(`Dummy users: ${dummyUsers}`);
    
    // Get first few profiles to check structure
    const sampleProfiles = await User.find({ email: { $regex: /@example\.com$/ } })
      .select('profile membership')
      .limit(3);
    
    console.log('\n📋 Sample profile structures:');
    sampleProfiles.forEach((profile, index) => {
      console.log(`\nProfile ${index + 1}:`);
      console.log('Name:', profile.profile.name);
      console.log('Age:', profile.profile.age);
      console.log('Bio:', profile.profile.bio ? 'Present' : 'Missing');
      console.log('Location:', profile.profile.location ? 'Present' : 'Missing');
      console.log('Interests:', profile.profile.interests ? `${profile.profile.interests.length} items` : 'Missing');
      console.log('Photos:', profile.profile.photos ? `${profile.profile.photos.length} items` : 'Missing');
      console.log('Membership tier:', profile.membership.tier);
      
      if (profile.profile.bio) {
        console.log('Bio content:', profile.profile.bio.substring(0, 50) + '...');
      }
      if (profile.profile.interests && profile.profile.interests.length > 0) {
        console.log('Interests:', profile.profile.interests.slice(0, 3).join(', '));
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking profiles:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkProfiles();