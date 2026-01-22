const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Like a user
router.post('/like', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already liked
    const alreadyLiked = currentUser.likes.some(like => like.userId.toString() === targetUserId);
    if (alreadyLiked) {
      return res.status(400).json({ message: 'You already liked this user' });
    }
    
    // Determine points cost based on membership tier
    let pointsCost = 5; // Default for free tier
    if (currentUser.membership?.tier === 'premium') {
      pointsCost = 2;
    } else if (currentUser.membership?.tier === 'vip') {
      pointsCost = 0; // VIP has unlimited likes
    }
    
    // Check if user has enough points (skip for VIP)
    if (currentUser.membership?.tier !== 'vip') {
      const currentPoints = currentUser.membership?.points || 0;
      if (currentPoints < pointsCost) {
        return res.status(400).json({ 
          message: `Insufficient points. You need ${pointsCost} points to like this user.` 
        });
      }
      // Deduct points for non-VIP users
      currentUser.membership.points -= pointsCost;
    }
    
    // Add to likes with timestamp
    currentUser.likes.push({ userId: targetUserId, likedAt: new Date() });
    await currentUser.save();
    
    // Check if it's a match (target user also liked current user)
    const isMatch = targetUser.likes.some(like => like.userId.toString() === req.userId);
    
    if (isMatch) {
      // Add to matches for both users
      if (!currentUser.matches.includes(targetUserId)) {
        currentUser.matches.push(targetUserId);
        await currentUser.save();
      }
      
      if (!targetUser.matches.includes(req.userId)) {
        targetUser.matches.push(req.userId);
        await targetUser.save();
      }
      
      res.json({ 
        match: true, 
        message: "It's a match!",
        pointsDeducted: pointsCost,
        pointsRemaining: currentUser.membership.points
      });
    } else {
      res.json({ 
        match: false, 
        message: 'Like sent',
        pointsDeducted: pointsCost,
        pointsRemaining: currentUser.membership.points
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Pass on a user
router.post('/pass', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUser = await User.findById(req.userId);
    
    if (!currentUser.passes.includes(targetUserId)) {
      currentUser.passes.push(targetUserId);
      await currentUser.save();
    }
    
    res.json({ message: 'Pass recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's matches
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('matches', '-password')
      .select('matches');
    
    res.json(user.matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


// Unlike a user
router.post('/unlike', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove from likes
    currentUser.likes = currentUser.likes.filter(like => like.userId.toString() !== targetUserId);
    
    // If they were matched, remove from matches too
    if (currentUser.matches.includes(targetUserId)) {
      currentUser.matches = currentUser.matches.filter(id => id.toString() !== targetUserId);
      targetUser.matches = targetUser.matches.filter(id => id.toString() !== req.userId);
      await targetUser.save();
    }
    
    await currentUser.save();
    
    res.json({ message: 'Like removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unmatch a user
router.post('/unmatch', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove from matches for both users
    currentUser.matches = currentUser.matches.filter(id => id.toString() !== targetUserId);
    targetUser.matches = targetUser.matches.filter(id => id.toString() !== req.userId);
    
    await currentUser.save();
    await targetUser.save();
    
    res.json({ message: 'Match removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
