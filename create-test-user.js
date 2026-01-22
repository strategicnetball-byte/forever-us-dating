const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({
      email: 'test@example.com',
      password: hashedPassword,
      profile: {
        name: 'Test User',
        age: 25,
        gender: 'male',
        lookingFor: ['female'],
        bio: 'Test bio',
        location: 'Test City'
      }
    });
    await user.save();
    console.log('✅ Test user created: test@example.com / test123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Database error:', err.message);
  process.exit(1);
});
