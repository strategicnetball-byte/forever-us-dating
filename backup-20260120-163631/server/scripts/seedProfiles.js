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
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
  'Mesa, AZ', 'Kansas City, MO', 'Atlanta, GA', 'Long Beach, CA', 'Colorado Springs, CO',
  'Raleigh, NC', 'Miami, FL', 'Virginia Beach, VA', 'Omaha, NE', 'Oakland, CA',
  'Minneapolis, MN', 'Tulsa, OK', 'Arlington, TX', 'Tampa, FL', 'New Orleans, LA'
];

const interests = [
  'Travel', 'Photography', 'Cooking', 'Hiking', 'Reading', 'Music', 'Dancing', 'Yoga', 'Fitness', 'Art',
  'Movies', 'Gaming', 'Sports', 'Wine Tasting', 'Coffee', 'Beach', 'Mountains', 'Concerts', 'Theater', 'Museums',
  'Running', 'Cycling', 'Swimming', 'Rock Climbing', 'Skiing', 'Surfing', 'Camping', 'Gardening', 'Pets', 'Dogs',
  'Cats', 'Fashion', 'Shopping', 'Volunteering', 'Meditation', 'Writing', 'Blogging', 'Podcasts', 'Netflix', 'Books',
  'Food', 'Restaurants', 'Bars', 'Nightlife', 'Adventure', 'Nature', 'Technology', 'Science', 'History', 'Languages'
];

const genders = ['male', 'female', 'non-binary'];
const lookingFor = ['male', 'female', 'non-binary'];

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
  "Photographer capturing life's beautiful moments. Let's create memories together.",
  "Yoga teacher seeking inner peace and outer adventure. Namaste!",
  "Chef who believes the way to the heart is through the stomach. Let me cook for you!",
  "Music lover who goes to concerts every weekend. Looking for my concert buddy.",
  "Beach person who dreams of tropical getaways. Sun, sand, and good company!",
  "Mountain lover who finds peace in nature. Let's hike into the sunset together.",
  "Wine enthusiast exploring vineyards and tasting rooms. Care to join me?",
  "Dancer who believes life is better with rhythm. Let's dance through life together!",
  "Runner training for my next marathon. Looking for a running partner in life.",
  "Artist painting my way through life. Let's add some color to each other's world.",
  "Gardener growing my own happiness. Let's plant seeds of love together.",
  "Tech enthusiast who loves innovation and gadgets. Let's explore the future together.",
  "History buff who loves museums and historical sites. Let's explore the past together.",
  "Language learner currently mastering Spanish. ¿Quieres practicar conmigo?",
  "Volunteer who believes in making the world better. Let's change the world together.",
  "Meditation practitioner seeking mindful connections. Let's find peace together.",
  "Writer crafting stories and seeking inspiration. You could be my next chapter.",
  "Podcast addict always learning something new. What's your favorite show?",
  "Movie buff with strong opinions about film. Let's debate over popcorn!",
  "Gamer looking for player two in life. Ready for co-op mode?",
  "Coffee connoisseur exploring local roasters. Let's caffeinate together!",
  "Fashion enthusiast who loves expressing creativity through style. Let's look good together!",
  "Pet lover with a house full of furry friends. Animal lovers welcome!",
  "Cycling enthusiast exploring the city on two wheels. Let's ride into the sunset!",
  "Swimming coach who lives for the water. Let's make waves together!",
  "Rock climbing instructor seeking my climbing partner for life. Ready to reach new heights?",
  "Skiing enthusiast who lives for powder days. Let's hit the slopes together!",
  "Surfing instructor riding the waves of life. Hang ten with me!",
  "Camping enthusiast who loves sleeping under the stars. Let's explore the wilderness!",
  "Theater lover who never misses a show. Let's get front row seats to love!",
  "Museum regular who loves learning new things. Let's discover together!",
  "Nightlife enthusiast who knows all the best spots. Let's paint the town!",
  "Science nerd who finds wonder in everything. Let's explore the universe together!",
  "Blogger sharing life's adventures online. Want to be featured in my love story?",
  "Fitness enthusiast who believes in strong bodies and minds. Let's grow stronger together!",
  "Nature photographer capturing Earth's beauty. Let's explore and document our journey!",
  "Adventure seeker always planning the next trip. Where should we go first?",
  "Wellness coach helping others live their best life. Let's thrive together!",
  "Creative writer penning the next great romance. Want to be my co-author?",
  "Mindfulness teacher living in the present moment. Let's be present together!",
  "Entrepreneur building dreams into reality. Let's build something amazing together!"
];

const membershipTiers = ['free', 'premium', 'vip'];

// Function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Function to get random items from array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to generate random age between 18 and 65
const getRandomAge = () => Math.floor(Math.random() * (65 - 18 + 1)) + 18;

// Function to generate random points based on tier
const getRandomPoints = (tier) => {
  switch (tier) {
    case 'free': return Math.floor(Math.random() * 200) + 50; // 50-250 points
    case 'premium': return Math.floor(Math.random() * 500) + 200; // 200-700 points
    case 'vip': return Math.floor(Math.random() * 1000) + 500; // 500-1500 points
    default: return 100;
  }
};

// Function to create a dummy user
const createDummyUser = async (index) => {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;
  const tier = getRandomItem(membershipTiers);
  const gender = getRandomItem(genders);
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = new User({
    email: email,
    password: hashedPassword,
    profile: {
      name: `${firstName} ${lastName}`,
      age: getRandomAge(),
      gender: gender,
      lookingFor: getRandomItems(lookingFor, Math.floor(Math.random() * 2) + 1), // 1-2 genders
      bio: getRandomItem(bios),
      location: getRandomItem(cities),
      interests: getRandomItems(interests, Math.floor(Math.random() * 8) + 3), // 3-10 interests
      photos: [] // We'll keep photos empty for now
    },
    membership: {
      tier: tier,
      points: getRandomPoints(tier),
      isActive: true,
      subscriptionEnd: tier !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined // 30 days from now
    },
    preferences: {
      ageRange: {
        min: Math.max(18, getRandomAge() - 10),
        max: Math.min(65, getRandomAge() + 10)
      },
      maxDistance: [25, 50, 100][Math.floor(Math.random() * 3)]
    }
  });
  
  return user;
};

// Main seeding function
const seedProfiles = async () => {
  try {
    console.log('🌱 Starting to seed dummy profiles...');
    
    // Clear existing dummy profiles (keep real users)
    await User.deleteMany({ email: { $regex: /@example\.com$/ } });
    console.log('🧹 Cleared existing dummy profiles');
    
    const users = [];
    
    // Create 50 dummy users
    for (let i = 1; i <= 50; i++) {
      const user = await createDummyUser(i);
      users.push(user);
      
      if (i % 10 === 0) {
        console.log(`📝 Created ${i} profiles...`);
      }
    }
    
    // Save all users to database
    await User.insertMany(users);
    
    console.log('✅ Successfully created 50 dummy profiles!');
    console.log('📊 Profile distribution:');
    
    const tierCounts = users.reduce((acc, user) => {
      acc[user.membership.tier] = (acc[user.membership.tier] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`   Free: ${tierCounts.free || 0} profiles`);
    console.log(`   Premium: ${tierCounts.premium || 0} profiles`);
    console.log(`   VIP: ${tierCounts.vip || 0} profiles`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('💡 You can now test the app with realistic dummy data');
    
  } catch (error) {
    console.error('❌ Error seeding profiles:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding script
seedProfiles();