const User = require('../models/User');
const Message = require('../models/Message');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function testMessageCount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Find Emma Davis specifically
    const emma = await User.findOne({ 'profile.name': 'Emma Davis' });
    if (!emma) {
      console.log('❌ Emma Davis not found');
      process.exit(1);
    }
    
    console.log('👤 Found Emma Davis:', emma._id);
    
    // Count messages
    const sentCount = await Message.countDocuments({ sender: emma._id });
    const receivedCount = await Message.countDocuments({ recipient: emma._id });
    const totalCount = sentCount + receivedCount;
    
    console.log('\n📊 Message counts for Emma Davis:');
    console.log('  Sent:', sentCount);
    console.log('  Received:', receivedCount);
    console.log('  Total:', totalCount);
    
    // Show sample messages
    const messages = await Message.find({
      $or: [
        { sender: emma._id },
        { recipient: emma._id }
      ]
    }).limit(10);
    
    if (messages.length > 0) {
      console.log('\n📨 Sample messages:');
      messages.forEach((msg, i) => {
        const senderName = msg.sender === emma._id ? 'Emma' : 'Other';
        const recipientName = msg.recipient === emma._id ? 'Emma' : 'Other';
        console.log(`  ${i + 1}. From: ${senderName} To: ${recipientName}`);
        console.log(`     Content: ${msg.content.substring(0, 50)}...`);
      });
    } else {
      console.log('\n❌ No messages found for Emma Davis');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testMessageCount();
