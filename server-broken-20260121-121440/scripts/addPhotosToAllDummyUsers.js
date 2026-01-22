const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

// Sample photo URLs (using placeholder images)
const photoUrls = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507009335872-a72e6b9f5eb2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1519085360771-9852ef158dba?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf0?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1516214104703-3e8c82f1a9a7?w=400&h=500&fit=crop'
];

async function addPhotosToAllDummyUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find all dummy users (those with isDummy flag or dummy in email)
    const dummyUsers = await User.find({
      $or: [
        { isDummy: true },
        { email: { $regex: 'dummy|test' } }
      ]
    });

    console.log(`\n📋 Found ${dummyUsers.length} dummy/test users\n`);

    if (dummyUsers.length === 0) {
      console.log('❌ No dummy users found');
      mongoose.connection.close();
      return;
    }

    let updated = 0;

    for (let i = 0; i < dummyUsers.length; i++) {
      const user = dummyUsers[i];
      
      // Assign 2-3 photos to each user
      const photoCount = Math.floor(Math.random() * 2) + 2; // 2-3 photos
      const userPhotos = [];
      
      for (let j = 0; j < photoCount; j++) {
        const photoUrl = photoUrls[(i * 3 + j) % photoUrls.length];
        userPhotos.push(photoUrl);
      }

      user.profile.photos = userPhotos;
      await user.save();
      
      console.log(`✅ ${user.profile.name} (${user.email})`);
      console.log(`   Added ${photoCount} photos`);
      updated++;
    }

    console.log(`\n✅ Successfully added photos to ${updated} dummy users`);
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

addPhotosToAllDummyUsers();
