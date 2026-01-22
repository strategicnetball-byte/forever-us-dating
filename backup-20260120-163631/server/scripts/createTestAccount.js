const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createTestAccount = async () => {
  try {
    console.log('👤 Creating test account...\n');
    
    // Delete existing test account if it exists
    await User.deleteOne({ email: 'test@example.com' });
    console.log('🧹 Cleared old test account');
    
    // Create new test account - DO NOT hash password, let the model do it
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123', // Plain text - model will hash it
      profile: {
        name: 'Test User',
        age: 28,
        gender: 'male',
        bio: 'I am a test user. Let\'s connect and see where this goes!',
        location: 'New York, NY',
        interests: ['Travel', 'Photography', 'Cooking', 'Hiking', 'Music'],
        photos: []
      },
      membership: {
        tier: 'premium',
        points: 500,
        isActive: true,
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      preferences: {
        ageRange: { min: 20, max: 40 },
        maxDistance: 50
      },
      compatibility: {
        questionnaire: {
          values: ['Family', 'Career', 'Health'],
          lifestyle: ['Active', 'Social'],
          relationshipGoal: 'Long-term',
          dealBreakers: 'Smoking and dishonesty - I value health and honesty',
          interests: ['Travel', 'Sports', 'Arts'],
          communication: 'Direct',
          finances: 'Balanced',
          health: 'Very important',
          personality: 'Extrovert',
          expectations: 'Equal partnership',
          completedAt: new Date()
        },
        scores: []
      }
    });
    
    await testUser.save();
    
    console.log('✅ Test account created successfully!\n');
    console.log('📋 Login credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   Tier: Premium');
    console.log('\n🎉 Ready to test!');
    
  } catch (error) {
    console.error('❌ Error creating test account:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createTestAccount();
