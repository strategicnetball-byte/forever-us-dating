const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');

async function testMessages() {
  try {
    await mongoose.connect('mongodb://localhost:27017/forever-us');
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      process.exit(1);
    }
    console.log('✅ Found test user:', testUser._id);

    // Find another user to message
    const otherUser = await User.findOne({ email: { $ne: 'test@example.com' } });
    if (!otherUser) {
      console.log('❌ No other user found');
      process.exit(1);
    }
    console.log('✅ Found other user:', otherUser._id);

    // Create a test message
    const testMessage = new Message({
      sender: testUser._id,
      recipient: otherUser._id,
      content: 'Test message from ' + testUser.profile.name
    });
    await testMessage.save();
    console.log('✅ Created test message:', testMessage._id);

    // Query messages as if we're the test user
    const messages = await Message.find({
      $or: [
        { sender: testUser._id, recipient: otherUser._id },
        { sender: otherUser._id, recipient: testUser._id }
      ]
    }).sort({ createdAt: 1 });

    console.log('📨 Found messages:', messages.length);
    messages.forEach((msg, idx) => {
      console.log(`Message ${idx + 1}:`, {
        _id: msg._id,
        sender: msg.sender,
        recipient: msg.recipient,
        content: msg.content,
        senderMatch: msg.sender.toString() === testUser._id.toString(),
        recipientMatch: msg.recipient.toString() === otherUser._id.toString()
      });
    });

    // Clean up
    await Message.deleteOne({ _id: testMessage._id });
    console.log('✅ Cleaned up test message');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testMessages();
