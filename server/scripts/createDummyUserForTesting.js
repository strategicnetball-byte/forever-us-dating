const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createDummyUser = async () => {
  try {
    console.log('👤 Creating dummy user compatible with test user...\n');
    
    // Delete existing dummy user if it exists
    await User.deleteOne({ email: 'dummy@example.com' });
    console.log('🧹 Cleared old dummy user');
    
    // Create new dummy user with complementary profile
    const dummyUser = new User({
      email: 'dummy@example.com',
      password: 'password123', // Plain text - model will hash it
      profile: {
        name: 'Emma Wilson',
        age: 26,
        gender: 'female',
        lookingFor: ['male'],
        bio: 'Adventure seeker and coffee enthusiast. Love exploring new places and meeting interesting people!',
        location: 'New York, NY',
        interests: ['Travel', 'Photography', 'Cooking', 'Yoga', 'Music', 'Art'],
        photos: []
      },
      membership: {
        tier: 'premium',
        points: 500,
        earnedPoints: 150,
        isActive: true,
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      preferences: {
        ageRange: { min: 24, max: 35 },
        maxDistance: 50
      },
      compatibility: {
        questionnaire: {
          values: ['Family', 'Career', 'Adventure'],
          lifestyle: ['Active', 'Social', 'Spontaneous'],
          relationshipGoal: 'Long-term',
          dealBreakers: 'Dishonesty and lack of ambition - I need someone driven and truthful',
          interests: ['Travel', 'Sports', 'Arts', 'Cooking'],
          completedAt: new Date()
        },
        scores: []
      },
      emailVerified: true,
      lastSeen: new Date()
    });
    
    await dummyUser.save();
    
    console.log('✅ Dummy user created successfully!\n');
    console.log('📋 Dummy user credentials:');
    console.log('   Email: dummy@example.com');
    console.log('   Password: password123');
    console.log('   Name: Emma Wilson');
    console.log('   Age: 26');
    console.log('   Gender: Female');
    console.log('   Tier: Premium');
    console.log('   Points: 500');
    console.log('   Earned Points: 150');
    console.log('\n📋 Test user credentials (for reference):');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   Name: Test User');
    console.log('   Age: 28');
    console.log('   Gender: Male');
    console.log('\n✨ Compatible profiles:');
    console.log('   - Both in New York, NY');
    console.log('   - Shared interests: Travel, Photography, Cooking, Music');
    console.log('   - Both premium members');
    console.log('   - Both have completed compatibility questionnaire');
    console.log('\n🎉 Ready to test compatibility matching!');
    
  } catch (error) {
    console.error('❌ Error creating dummy user:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createDummyUser();
