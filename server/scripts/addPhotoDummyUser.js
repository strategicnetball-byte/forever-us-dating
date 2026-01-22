const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const addPhotos = async () => {
  try {
    console.log('📸 Adding photos to dummy user...\n');
    
    const dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!dummyUser) {
      console.log('❌ Dummy user not found');
      return;
    }
    
    console.log('👤 Dummy User: dummy@example.com');
    console.log('   Current photos:', dummyUser.profile.photos.length);
    
    // Add placeholder photos (same format as test user)
    dummyUser.profile.photos = [
      '/uploads/photos/dummy-photo-1.jpg',
      '/uploads/photos/dummy-photo-2.jpg'
    ];
    
    await dummyUser.save();
    
    console.log('\n✅ Photos added successfully!');
    console.log('   New photos count:', dummyUser.profile.photos.length);
    console.log('   Photos:', dummyUser.profile.photos);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

addPhotos();
