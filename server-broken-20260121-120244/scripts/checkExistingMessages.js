const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

async function checkMessages() {
  try {
    await mongoose.connect('mongodb://localhost:27017/forever-us');
    console.log('✅ Connected to MongoDB');

    // Count all messages
    const totalMessages = await Message.countDocuments();
    console.log('📨 Total messages in database:', totalMessages);

    if (totalMessages > 0) {
      // Get all messages with user details
      const messages = await Message.find().populate('sender', 'email profile.name').populate('recipient', 'email profile.name').limit(10);
      console.log('\n📨 Sample messages:');
      messages.forEach((msg, idx) => {
        console.log(`\nMessage ${idx + 1}:`);
        console.log('  From:', msg.sender?.profile?.name || msg.sender?.email);
        console.log('  To:', msg.recipient?.profile?.name || msg.recipient?.email);
        console.log('  Content:', msg.content.substring(0, 50) + '...');
        console.log('  Created:', msg.createdAt);
      });
    } else {
      console.log('❌ No messages found in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMessages();
