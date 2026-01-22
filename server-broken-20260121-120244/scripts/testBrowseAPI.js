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

const testBrowseAPI = async () => {
  try {
    console.log('🔍 Testing Browse API data structure...');
    
    // Simulate the browse API query
    const profiles = await User.find({})
      .select('profile membership')
      .limit(3);
    
    console.log('\n📋 API Response Structure:');
    profiles.forEach((profile, index) => {
      console.log(`\nProfile ${index + 1}:`);
      console.log('Full object keys:', Object.keys(profile.toObject()));
      console.log('Profile keys:', Object.keys(profile.profile));
      console.log('Membership keys:', Object.keys(profile.membership));
      
      console.log('\nActual data:');
      console.log('_id:', profile._id);
      console.log('profile.name:', profile.profile.name);
      console.log('profile.age:', profile.profile.age);
      console.log('profile.bio:', profile.profile.bio ? `"${profile.profile.bio.substring(0, 50)}..."` : 'null/undefined');
      console.log('profile.location:', profile.profile.location);
      console.log('profile.interests:', profile.profile.interests);
      console.log('profile.photos:', profile.profile.photos);
      console.log('membership.tier:', profile.membership.tier);
      
      console.log('\nJSON representation:');
      console.log(JSON.stringify(profile.toObject(), null, 2));
    });
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  } finally {
    mongoose.connection.close();
  }
};

testBrowseAPI();