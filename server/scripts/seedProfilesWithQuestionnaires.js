const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
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
  'Scarlett', 'Victoria', 'Madison', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn',
  'Sophia', 'Jackson', 'Aiden', 'Lucas', 'Mason', 'Logan', 'Elijah', 'James', 'Benjamin', 'Oliver',
  'Ava', 'Emma', 'Charlotte', 'Amelia', 'Mia', 'Isabella', 'Harper', 'Evelyn', 'Abigail', 'Emily'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Phillips', 'Evans', 'Edwards', 'Collins', 'Reeves', 'Morris', 'Murphy', 'Rogers', 'Morgan', 'Peterson'
];

const cities = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
  'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
  'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
  'Mesa, AZ', 'Kansas City, MO', 'Atlanta, GA', 'Long Beach, CA', 'Colorado Springs, CO',
  'Raleigh, NC', 'Miami, FL', 'Virginia Beach, VA', 'Omaha, NE', 'Oakland, CA',
  'Minneapolis, MN', 'Tulsa, OK', 'Arlington, TX', 'Tampa, FL', 'New Orleans, LA'
];

const interests = [
  'Travel', 'Photography', 'Cooking', 'Hiking', 'Reading', 'Music', 'Dancing', 'Yoga', 'Fitness', 'Art',
  'Movies', 'Gaming', 'Sports', 'Wine Tasting', 'Coffee', 'Beach', 'Mountains', 'Concerts', 'Theater', 'Museums',
  'Running', 'Cycling', 'Swimming', 'Rock Climbing', 'Skiing', 'Surfing', 'Camping', 'Gardening', 'Pets', 'Dogs',
  'Cats', 'Fashion', 'Shopping', 'Volunteering', 'Meditation', 'Writing', 'Blogging', 'Podcasts', 'Netflix', 'Books'
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

// Questionnaire data
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

// Function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Function to get random items from array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

// Function to generate random age between 18 and 65
const getRandomAge = () => Math.floor(Math.random() * (65 - 18 + 1)) + 18;

// Function to generate random points based on tier
const getRandomPoints = (tier) => {
  switch (tier) {
    case 'free': return Math.floor(Math.random() * 200) + 50;
    case 'premium': return Math.floor(Math.random() * 500) + 200;
    case 'vip': return Math.floor(Math.random() * 1000) + 500;
    default: return 100;
  }
};

// Function to generate completed questionnaire
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
    personality: getRandomItems(questionsData.personality, Math.floor(Math.random() * 2) + 1),
    expectations: getRandomItems(questionsData.personality, Math.floor(Math.random() * 2) + 1),
    completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Completed within last 30 days
  };
};

// Function to create a dummy user with questionnaire
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

// Main seeding function
const seedProfiles = async () => {
  try {
    console.log('🌱 Starting to seed dummy profiles with questionnaires...');
    
    // Clear existing dummy profiles
    await User.deleteMany({ email: { $regex: /@example\.com$/ } });
    console.log('🧹 Cleared existing dummy profiles');
    
    const users = [];
    const profileCount = 150; // Generate 150 profiles
    
    // Create dummy users
    for (let i = 1; i <= profileCount; i++) {
      const user = await createDummyUser(i);
      users.push(user);
      
      if (i % 25 === 0) {
        console.log(`📝 Created ${i} profiles...`);
      }
    }
    
    // Save all users to database
    await User.insertMany(users);
    
    console.log(`✅ Successfully created ${profileCount} dummy profiles with completed questionnaires!`);
    console.log('📊 Profile distribution:');
    
    const tierCounts = users.reduce((acc, user) => {
      acc[user.membership.tier] = (acc[user.membership.tier] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`   Free: ${tierCounts.free || 0} profiles`);
    console.log(`   Premium: ${tierCounts.premium || 0} profiles`);
    console.log(`   VIP: ${tierCounts.vip || 0} profiles`);
    
    console.log('\n📋 All profiles have completed questionnaires with:');
    console.log('   ✓ Values selected');
    console.log('   ✓ Lifestyle preferences');
    console.log('   ✓ Relationship goals');
    console.log('   ✓ Deal breakers');
    console.log('   ✓ Interests');
    console.log('   ✓ Communication style');
    console.log('   ✓ Financial preferences');
    console.log('   ✓ Health priorities');
    console.log('   ✓ Personality type');
    console.log('   ✓ Relationship expectations');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('💡 You can now test compatibility matching and filtering!');
    
  } catch (error) {
    console.error('❌ Error seeding profiles:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding script
seedProfiles();
