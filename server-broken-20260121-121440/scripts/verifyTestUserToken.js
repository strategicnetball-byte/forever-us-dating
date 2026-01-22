const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const verifyToken = async () => {
  try {
    console.log('🔐 Verifying test user token...\n');
    
    const testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('👤 Test User: test@example.com');
    console.log('   ID:', testUser._id);
    console.log('   Email verified:', testUser.emailVerified);
    console.log('   Is active:', testUser.isActive);
    
    // Create a token like the auth system would
    const token = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('\n🔑 Generated token:');
    console.log('   ' + token.substring(0, 50) + '...');
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('\n✅ Token verified successfully');
    console.log('   Decoded userId:', decoded.userId);
    console.log('   Matches test user ID:', decoded.userId.toString() === testUser._id.toString());
    
    // Check if user can access compatibility endpoint
    console.log('\n📋 Compatibility check:');
    console.log('   Questionnaire completed:', !!testUser.compatibility.questionnaire.completedAt);
    console.log('   Compatibility scores:', testUser.compatibility.scores.length);
    
    const matches60 = testUser.compatibility.scores.filter(s => s.score >= 60);
    console.log('   Matches (60%+):', matches60.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

verifyToken();
