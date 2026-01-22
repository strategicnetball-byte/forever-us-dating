const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const verify = async () => {
  try {
    console.log('🔍 Verifying test account...\n');
    
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('❌ Test account not found in database');
      console.log('\n💡 Run this first:');
      console.log('   node server/scripts/createTestAccount.js');
      mongoose.connection.close();
      return;
    }
    
    console.log('✅ Test account found!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.profile.name}`);
    console.log(`   Tier: ${user.membership.tier}`);
    
    // Test password
    console.log('\n🔐 Testing password...');
    const isMatch = await user.comparePassword('password123');
    
    if (isMatch) {
      console.log('✅ Password is correct!');
    } else {
      console.log('❌ Password does not match');
      console.log('\n💡 Try creating a new account with:');
      console.log('   node server/scripts/createTestAccount.js');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

verify();
