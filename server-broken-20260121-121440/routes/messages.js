const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    const message = new Message({
      sender: req.userId,
      recipient: recipientId,
      content
    });
    
    await message.save();
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send a message (alternative endpoint)
router.post('/send', auth, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient ID and content are required' });
    }

    console.log('📤 Sending message:', { sender: req.userId, recipient: recipientId });

    const User = require('../models/User');
    
    // Get sender to check points
    const sender = await User.findById(req.userId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Cost per message
    const messageCost = sender.membership?.tier === 'premium' ? 5 : 
                        sender.membership?.tier === 'vip' ? 0 : 10;

    // Check if user has enough points (skip for VIP)
    if (sender.membership?.tier !== 'vip') {
      if (sender.membership.points < messageCost) {
        return res.status(400).json({ message: 'Insufficient points to send message' });
      }
      // Deduct points for non-VIP users
      sender.membership.points -= messageCost;
    }
    
    // Update lastMessageAt in sender's likes for this recipient
    const senderLike = sender.likes.find(like => like.userId.toString() === recipientId);
    if (senderLike) {
      senderLike.lastMessageAt = new Date();
    }
    
    await sender.save();
    
    const message = new Message({
      sender: req.userId,
      recipient: recipientId,
      content
    });
    
    await message.save();
    
    // Update lastMessageAt in recipient's likes for this sender
    const recipient = await User.findById(recipientId);
    if (recipient) {
      const recipientLike = recipient.likes.find(like => like.userId.toString() === req.userId);
      if (recipientLike) {
        recipientLike.lastMessageAt = new Date();
        await recipient.save();
      }
    }
    
    console.log('✅ Message saved:', { _id: message._id, sender: message.sender, recipient: message.recipient });
    
    res.status(201).json({ 
      message: 'Message sent successfully', 
      data: message,
      pointsRemaining: sender.membership.points
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      recipient: req.userId,
      read: false
    });
    
    res.json({ unreadCount });
  } catch (error) {
    console.error('❌ Error getting unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get total message count (sent + received)
router.get('/count', auth, async (req, res) => {
  try {
    const sentCount = await Message.countDocuments({ sender: req.userId });
    const receivedCount = await Message.countDocuments({ recipient: req.userId });
    const totalCount = sentCount + receivedCount;
    
    console.log('📊 Message count:', { sentCount, receivedCount, totalCount, userId: req.userId });
    
    res.json({ totalCount, sentCount, receivedCount });
  } catch (error) {
    console.error('❌ Error getting message count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all conversations (people you've messaged or received messages from)
router.get('/conversations', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Get all unique users you've messaged or received messages from
    const sentMessages = await Message.find({ sender: req.userId }).distinct('recipient');
    const receivedMessages = await Message.find({ recipient: req.userId }).distinct('sender');
    
    const conversationUserIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    // Fetch user details for all conversation partners
    const conversationUsers = await User.find({ _id: { $in: conversationUserIds } })
      .select('_id profile membership lastSeen');
    
    res.json(conversationUsers);
  } catch (error) {
    console.error('❌ Error getting conversations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark messages as read
router.put('/mark-read/:senderId', auth, async (req, res) => {
  try {
    const { senderId } = req.params;
    
    await Message.updateMany(
      {
        sender: senderId,
        recipient: req.userId,
        read: false
      },
      { read: true }
    );
    
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for a match (must be last to avoid catching other routes)
router.get('/:matchId', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    console.log('📨 Fetching messages:', { userId: req.userId, matchId });
    
    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: matchId },
        { sender: matchId, recipient: req.userId }
      ]
    }).sort({ createdAt: 1 });
    
    console.log('📨 Found messages:', messages.length);
    if (messages.length > 0) {
      console.log('📨 Sample message:', {
        sender: messages[0].sender,
        recipient: messages[0].recipient,
        content: messages[0].content
      });
    }
    
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;