const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data arrays
const firstNames = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn',
  'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
  'Zoe', 'Grace', 'Chloe', 'Lily', 'Hannah', 'Ella', 'Aria', 'Luna', 'Layla', 'Mila',
  'Ethan', 'Mason', 'Michael', 'Logan', 'Jackson', 'Sebastian', 'Jack', 'Aiden', 'Owen', 'Samuel',
  'Scarlett', 'Victoria', 'Madison', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const cities = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
  'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
  'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA'
];

const interests = [
  'Travel', 'Photography', 'Cooking', 'Hiking', 'Reading', 'Music', 'Dancing', 'Yoga', 'Fitness', 'Art',
  'Movies', 'Gaming', 'Sports', 'Wine Tasting', 'Coffee', 'Beach', 'Mountains', 'Concerts', 'Theater', 'Museums',
  'Running', 'Cycling', 'Swimming', 'Rock Climbing', 'Skiing', 'Surfing', 'Camping', 'Gardening', 'Pets', 'Dogs'
];

const bios = [
  "Love exploring new places and trying different cuisines. Looking for someone to share adventures with!",
  "Passionate about fitness and healthy living. Seeking a partner who values wellness and positivity.",
  "Creative soul who loves art, music, and deep conversations. Let's create something beautiful together.",
  "Outdoor enthusiast who enjoys hiking, camping, and stargazing. Adventure awaits!",
  "Foodie and wine lover seeking someone to explore the culinary world with.",
  "Book lover and coffee addict. Perfect date involves a cozy café and great conversation.",
  "Travel enthusiast with a bucket list that keeps growing. Care to join me on my next adventure?",
  "Fitness instructor by day, Netflix binger by night. Balance is key!",
  "Dog lover and weekend warrior. My pup and I are looking for our perfect match.",
  "Photographer capturing life's beautiful moments. Let's create memories together."
];

const membershipTiers = ['free', 'premium', 'vip'];

const questionsData = {
  values: ['Family', 'Career', 'Health', 'Adventure', 'Spirituality', 'Education', 'Creativity', 'Community'],
  lifestyle: ['Active', 'Relaxed', 'Social', 'Homebody', 'Spontaneous', 'Planned', 'Minimalist', 'Luxury'],
  relationshipGoal: ['Long-term', 'Marriage', 'Casual', 'See where it goes'],
  dealBreakers: ['Smoking', 'Drinking', 'No ambition', 'Dishonesty', 'Disrespect', 'Infidelity'],
  interests: ['Travel', 'Sports', 'Arts', 'Technology', 'Nature', 'Food', 'Music', 'Books'],
  communication: ['Direct', 'Gentle', 'Humorous', 'Thoughtful', 'Spontaneous'],
  finances: ['Frugal', 'Balanced', 'Generous', 'Ambitious'],
  health: ['Very important', 'Important', 'Somewhat important'],
  personality: ['Introvert', 'Extrovert', 'Ambivert'],
  expectations: ['Equal partnership', 'Traditional roles', 'Flexible arrangement']
};

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};
const getRandomAge = () => Math.floor(Math.random() * (65 - 18 + 1)) + 18;
const getRandomPoints = (tier) => {
  switch (tier) {
    case 'free': return Math.floor(Math.random() * 200) + 50;
    case 'premium': return Math.floor(Math.random() * 500) + 200;
    case 'vip': return Math.floor(Math.random() * 1000) + 500;
    default: return 100;
  }
};

const generateQuestionnaire = () => {
  return {
    values: getRandomItems(questionsData.values, Math.floor(Math.random() * 3) + 2),
    lifestyle: getRandomItems(questionsData.lifestyle, Math.floor(Math.random() * 2) + 1),
    relationshipGoal: getRandomItem(questionsData.relationshipGoal),
    dealBreakers: getRandomItems(questionsData.dealBreakers, Math.floor(Math.random() * 3) + 1),
    interests: getRandomItems(questionsData.interests, Math.floor(Math.random() * 4) + 2),
    communication: getRandomItem(questionsData.communication),
    finances: getRandomItem(questionsData.finances),
    health: getRandomItem(questionsData.health),
    personality: getRandomItem(questionsData.personality),
    expectations: getRandomItem(questionsData.expectations),
    completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  };
};

const createDummyUser = async (index) => {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;
  const tier = getRandomItem(membershipTiers);
  const genders = ['male', 'female', 'non-binary'];
  const gender = getRandomItem(genders);
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = new User({
    email: email,
    password: hashedPassword,
    profile: {
      name: `${firstName} ${lastName}`,
      age: getRandomAge(),
      gender: gender,
      bio: getRandomItem(bios),
      location: getRandomItem(cities),
      interests: getRandomItems(interests, Math.floor(Math.random() * 8) + 3),
      photos: []
    },
    membership: {
      tier: tier,
      points: getRandomPoints(tier),
      isActive: true,
      subscriptionEnd: tier !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
    },
    preferences: {
      ageRange: {
        min: Math.max(18, getRandomAge() - 10),
        max: Math.min(65, getRandomAge() + 10)
      },
      maxDistance: [25, 50, 100][Math.floor(Math.random() * 3)]
    },
    compatibility: {
      questionnaire: generateQuestionnaire(),
      scores: []
    }
  });
  
  return user;
};

const setup = async () => {
  try {
    console.log('🚀 Setting up test environment...\n');
    
    // Clear all data
    await User.deleteMany({});
    console.log('🧹 Cleared all existing users');
    
    // Create test account
    console.log('\n👤 Creating test account...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword,
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
        questionnaire: generateQuestionnaire(),
        scores: []
      }
    });
    
    await testUser.save();
    console.log('✅ Test account created!');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   Tier: Premium');
    
    // Create dummy profiles
    console.log('\n👥 Creating 150 dummy profiles with questionnaires...');
    const users = [];
    
    for (let i = 1; i <= 150; i++) {
      const user = await createDummyUser(i);
      users.push(user);
      
      if (i % 30 === 0) {
        console.log(`   Created ${i} profiles...`);
      }
    }
    
    await User.insertMany(users);
    console.log('✅ All dummy profiles created!');
    
    // Summary
    console.log('\n📊 Setup Summary:');
    console.log('   Total users: 151 (1 test + 150 dummy)');
    console.log('   All profiles have completed questionnaires');
    console.log('   Ready to test browsing, matching, and compatibility!');
    
    console.log('\n🎉 Test environment ready!');
    console.log('\n💡 Next steps:');
    console.log('   1. Go to the app and sign up with: test@example.com / password123');
    console.log('   2. Complete the compatibility questionnaire');
    console.log('   3. Go to Browse to see all 150 dummy profiles');
    console.log('   4. Test liking, passing, and matching!');
    
  } catch (error) {
    console.error('❌ Error setting up test environment:', error);
  } finally {
    mongoose.connection.close();
  }
};

setup();
