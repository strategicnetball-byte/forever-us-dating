const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Delete existing test users
    await User.deleteMany({ email: { $in: ['test@example.com', 'dummy@example.com'] } });
    console.log('Deleted old test users');
    
    // Create test user
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      profile: {
        name: 'Test User',
        age: 28,
        gender: 'male',
        lookingFor: ['female'],
        location: 'New York, NY',
        bio: 'Looking for someone special',
        interests: ['Travel', 'Photography', 'Cooking', 'Music']
      },
      membership: {
        tier: 'premium',
        points: 1000,
        earnedPoints: 0,
        isActive: true
      }
    });
    
    testUser.compatibility.questionnaire = {
      values: ['Family & Tradition', 'Adventure & Travel', 'Health & Wellness'],
      lifestyle: ['Adventurous', 'Balanced', 'Active & outdoorsy'],
      relationshipGoal: 'Serious relationship',
      dealBreakers: 'Dishonesty and lack of respect',
      interests: ['Travel', 'Photography', 'Cooking', 'Music'],
      communication: 'Deep conversations',
      finances: 'Balanced approach',
      health: 'Important - regular exercise',
      personality: ['Optimistic', 'Adventurous', 'Empathetic', 'Humorous'],
      expectations: ['Honesty & trust', 'Sense of humor', 'Shared values'],
      completedAt: new Date()
    };
    
    await testUser.save();
    console.log('Created test user:', testUser._id);
    
    // Create Emma
    const emmaUser = new User({
      email: 'dummy@example.com',
      password: 'password123',
      profile: {
        name: 'Emma Wilson',
        age: 26,
        gender: 'female',
        lookingFor: ['male'],
        location: 'New York, NY',
        bio: 'Adventure seeker and coffee enthusiast.',
        interests: ['Travel', 'Photography', 'Cooking', 'Music']
      },
      membership: {
        tier: 'premium',
        points: 500,
        earnedPoints: 0,
        isActive: true
      }
    });
    
    emmaUser.compatibility.questionnaire = {
      values: ['Family & Tradition', 'Adventure & Travel', 'Health & Wellness'],
      lifestyle: ['Adventurous', 'Balanced', 'Active & outdoorsy'],
      relationshipGoal: 'Serious relationship',
      dealBreakers: 'Dishonesty and lack of respect',
      interests: ['Travel', 'Photography', 'Cooking', 'Music'],
      communication: 'Deep conversations',
      finances: 'Balanced approach',
      health: 'Important - regular exercise',
      personality: ['Optimistic', 'Adventurous', 'Empathetic', 'Humorous'],
      expectations: ['Honesty & trust', 'Sense of humor', 'Shared values'],
      completedAt: new Date()
    };
    
    await emmaUser.save();
    console.log('Created Emma user:', emmaUser._id);
    
    // Add compatibility scores
    const testUserRefresh = await User.findById(testUser._id);
    const emmaUserRefresh = await User.findById(emmaUser._id);
    
    testUserRefresh.compatibility.scores.push({
      userId: emmaUser._id,
      score: 75,
      calculatedAt: new Date()
    });
    
    emmaUserRefresh.compatibility.scores.push({
      userId: testUser._id,
      score: 75,
      calculatedAt: new Date()
    });
    
    await testUserRefresh.save();
    await emmaUserRefresh.save();
    
    console.log('✅ Fresh test environment ready!');
    console.log('   Test user: test@example.com (Premium)');
    console.log('   Emma: dummy@example.com (Premium)');
    console.log('   Compatibility: 75%');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
})();
