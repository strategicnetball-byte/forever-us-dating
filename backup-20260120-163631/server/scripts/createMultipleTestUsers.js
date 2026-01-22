const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

const testUsers = [
  {
    email: 'alice@example.com',
    password: 'password123',
    name: 'Alice Johnson',
    age: 28,
    gender: 'female'
  },
  {
    email: 'bob@example.com',
    password: 'password123',
    name: 'Bob Smith',
    age: 32,
    gender: 'male'
  },
  {
    email: 'carol@example.com',
    password: 'password123',
    name: 'Carol Williams',
    age: 26,
    gender: 'female'
  },
  {
    email: 'david@example.com',
    password: 'password123',
    name: 'David Brown',
    age: 35,
    gender: 'male'
  },
  {
    email: 'emma@example.com',
    password: 'password123',
    name: 'Emma Davis',
    age: 29,
    gender: 'female'
  }
];

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📝 Creating test users...\n');

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⏭️  User already exists: ${userData.email}`);
        continue;
      }

      const user = new User({
        email: userData.email,
        password: userData.password,
        profile: {
          name: userData.name,
          age: userData.age,
          gender: userData.gender
        },
        membership: {
          tier: 'premium',
          points: 500
        }
      });

      await user.save();
      console.log(`✅ Created: ${userData.email} (Password: ${userData.password})`);
    }

    console.log('\n✨ Test users created successfully!');
    console.log('\n📋 Available test accounts:');
    testUsers.forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name: ${user.name}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUsers();
