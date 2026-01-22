const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');

async function verifyMessages() {
  try {
    await mongoose.connect('mongodb://localhost:27017/forever-us');
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'test@example.com' }).populate('matches', 'profile.name');
    if (!testUser) {
      console.log('❌ Test user not found');
      process.exit(1);
    }
    console.log('✅ Found test user:', testUser.profile.name);
    console.log('   Matches:', testUser.matches.length);

    // Check messages for each match
    for (const match of testUser.matches) {
      const messages = await Message.find({
        $or: [
          { sender: testUser._id, recipient: match._id },
          { sender: match._id, recipient: testUser._id }
        ]
      });

      console.log(`\n📨 Messages with ${match.profile.name}:`, messages.length);
      messages.forEach((msg, idx) => {
        const isSent = msg.sender.toString() === testUser._id.toString();
        console.log(`  ${idx + 1}. [${isSent ? 'SENT' : 'RECEIVED'}] ${msg.content.substring(0, 40)}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyMessages();
