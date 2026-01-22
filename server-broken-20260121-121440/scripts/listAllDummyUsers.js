const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

async function listDummyUsers() {
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

    console.log(`\n📋 Found ${dummyUsers.length} dummy/test users:\n`);
    dummyUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.profile.name} (${user.email})`);
      console.log(`   Tier: ${user.membership.tier}`);
      console.log(`   Photos: ${user.profile.photos.length}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}

listDummyUsers();
