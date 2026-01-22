const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Placeholder photo URLs from various services
const malePhotos = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/men/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
  'https://randomuser.me/api/portraits/men/4.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/men/6.jpg',
  'https://randomuser.me/api/portraits/men/7.jpg',
  'https://randomuser.me/api/portraits/men/8.jpg',
  'https://randomuser.me/api/portraits/men/9.jpg',
  'https://randomuser.me/api/portraits/men/10.jpg',
  'https://randomuser.me/api/portraits/men/11.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/men/13.jpg',
  'https://randomuser.me/api/portraits/men/14.jpg',
  'https://randomuser.me/api/portraits/men/15.jpg',
  'https://randomuser.me/api/portraits/men/16.jpg',
  'https://randomuser.me/api/portraits/men/17.jpg',
  'https://randomuser.me/api/portraits/men/18.jpg',
  'https://randomuser.me/api/portraits/men/19.jpg',
  'https://randomuser.me/api/portraits/men/20.jpg',
  'https://randomuser.me/api/portraits/men/21.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/men/23.jpg',
  'https://randomuser.me/api/portraits/men/24.jpg',
  'https://randomuser.me/api/portraits/men/25.jpg'
];

const femalePhotos = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/women/6.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg',
  'https://randomuser.me/api/portraits/women/8.jpg',
  'https://randomuser.me/api/portraits/women/9.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/women/13.jpg',
  'https://randomuser.me/api/portraits/women/14.jpg',
  'https://randomuser.me/api/portraits/women/15.jpg',
  'https://randomuser.me/api/portraits/women/16.jpg',
  'https://randomuser.me/api/portraits/women/17.jpg',
  'https://randomuser.me/api/portraits/women/18.jpg',
  'https://randomuser.me/api/portraits/women/19.jpg',
  'https://randomuser.me/api/portraits/women/20.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/women/22.jpg',
  'https://randomuser.me/api/portraits/women/23.jpg',
  'https://randomuser.me/api/portraits/women/24.jpg',
  'https://randomuser.me/api/portraits/women/25.jpg'
];

// Function to determine gender from name (simple heuristic)
const getGenderFromName = (name) => {
  const femaleNames = [
    'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn',
    'Zoe', 'Grace', 'Chloe', 'Lily', 'Hannah', 'Ella', 'Aria', 'Luna', 'Layla', 'Mila',
    'Scarlett', 'Victoria', 'Madison', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn'
  ];
  
  const firstName = name.split(' ')[0];
  return femaleNames.includes(firstName) ? 'female' : 'male';
};

// Function to get random photos for a user
const getRandomPhotos = (gender, count = 3) => {
  const photoPool = gender === 'female' ? femalePhotos : malePhotos;
  const shuffled = [...photoPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Main function to add photos to dummy profiles
const addDummyPhotos = async () => {
  try {
    console.log('🖼️  Starting to add dummy photos to profiles...');
    
    // Get all dummy profiles (those with @example.com emails)
    const dummyUsers = await User.find({ 
      email: { $regex: /@example\.com$/ },
      'profile.photos': { $size: 0 } // Only users without photos
    });
    
    console.log(`📸 Found ${dummyUsers.length} profiles without photos`);
    
    let updatedCount = 0;
    
    for (const user of dummyUsers) {
      const gender = getGenderFromName(user.profile.name);
      const photoCount = Math.floor(Math.random() * 3) + 1; // 1-3 photos per user
      const photos = getRandomPhotos(gender, photoCount);
      
      // Update user with photos
      user.profile.photos = photos;
      await user.save();
      
      updatedCount++;
      
      if (updatedCount % 10 === 0) {
        console.log(`📷 Updated ${updatedCount} profiles with photos...`);
      }
    }
    
    console.log('✅ Successfully added photos to dummy profiles!');
    console.log(`📊 Photo distribution:`);
    console.log(`   Total profiles updated: ${updatedCount}`);
    console.log(`   Photos per profile: 1-3 random photos`);
    console.log(`   Photo sources: RandomUser.me API`);
    
    // Show some statistics
    const maleCount = dummyUsers.filter(user => getGenderFromName(user.profile.name) === 'male').length;
    const femaleCount = dummyUsers.filter(user => getGenderFromName(user.profile.name) === 'female').length;
    
    console.log(`   Male profiles: ${maleCount}`);
    console.log(`   Female profiles: ${femaleCount}`);
    
    console.log('\n🎉 Dummy photos added successfully!');
    console.log('💡 Browse page will now show realistic profile photos');
    
  } catch (error) {
    console.error('❌ Error adding dummy photos:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
addDummyPhotos();