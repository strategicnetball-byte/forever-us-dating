const fs = require('fs');
const path = require('path');

// Check if uploads directory exists and has photos
const uploadsPath = path.join(__dirname, 'uploads', 'photos');

if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath);
  console.log('📸 Photos in uploads/photos:');
  files.forEach(file => {
    const filePath = path.join(uploadsPath, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
} else {
  console.log('❌ uploads/photos directory does not exist');
}

// Check test user's photos in database
const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('\n✅ Connected to MongoDB');
  
  const testUser = await User.findOne({ email: 'test@example.com' });
  if (testUser) {
    console.log('\n👤 Test user photos:');
    if (testUser.profile.photos && testUser.profile.photos.length > 0) {
      testUser.profile.photos.forEach((photo, index) => {
        console.log(`  [${index}] ${photo}`);
      });
    } else {
      console.log('  No photos stored in database');
    }
  } else {
    console.log('❌ Test user not found');
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB error:', err.message);
  process.exit(1);
});
