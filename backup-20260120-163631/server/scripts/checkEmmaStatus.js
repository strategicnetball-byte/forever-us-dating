const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const check = async () => {
  try {
    console.log('🔍 Checking Emma status...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!testUser || !dummyUser) {
      console.log('❌ Users not found');
      return;
    }
    
    console.log('👤 Test User: test@example.com');
    console.log('   ID:', testUser._id.toString());
    console.log('   Likes count:', testUser.likes.length);
    console.log('   Passes count:', testUser.passes.length);
    
    console.log('\n👤 Emma: dummy@example.com');
    console.log('   ID:', dummyUser._id.toString());
    
    // Check likes
    console.log('\n📋 Checking likes array:');
    const likeIds = testUser.likes.map(l => l.userId.toString());
    console.log('   Like IDs:', likeIds.slice(0, 3).join(', '), '...');
    console.log('   Emma in likes:', likeIds.includes(dummyUser._id.toString()) ? '✅' : '❌');
    
    // Check passes
    console.log('\n📋 Checking passes array:');
    const passIds = testUser.passes.map(p => p.toString());
    console.log('   Pass IDs:', passIds.slice(0, 3).join(', '), '...');
    console.log('   Emma in passes:', passIds.includes(dummyUser._id.toString()) ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

check();
