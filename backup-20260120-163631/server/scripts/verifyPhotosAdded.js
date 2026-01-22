const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

async function verifyPhotos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const dummyUsers = await User.find({
      $or: [
        { isDummy: true },
        { email: { $regex: 'dummy|test' } }
      ]
    });

    console.log('\n📸 DUMMY USER PHOTOS:\n');
    dummyUsers.forEach(user => {
      console.log(`${user.profile.name} (${user.email})`);
      console.log(`  Photos: ${user.profile.photos.length}`);
      user.profile.photos.forEach((photo, idx) => {
        console.log(`    ${idx + 1}. ${photo.substring(0, 60)}...`);
      });
      console.log('');
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}

verifyPhotos();
