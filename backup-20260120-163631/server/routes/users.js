const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'photos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// IMPORTANT: Specific routes MUST come before generic /:userId route

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's last seen status
router.get('/last-seen/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('lastSeen');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ lastSeen: user.lastSeen });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Browse profiles endpoint
router.get('/browse', auth, async (req, res) => {
  try {
    console.log('📖 Browse request from user:', req.userId);
    
    const currentUser = await User.findById(req.userId);
    console.log('👤 Current user found:', currentUser.email);
    console.log('   Likes:', currentUser.likes.length);
    console.log('   Passes:', currentUser.passes.length);
    
    // Extract user IDs from likes (which now have userId property)
    const likedUserIds = currentUser.likes.map(like => like.userId);
    
    // Get users that haven't been liked or passed by current user
    const excludeIds = [
      req.userId, // Exclude self
      ...likedUserIds,
      ...currentUser.passes
    ];
    
    console.log('🚫 Excluding IDs:', excludeIds.length);
    
    const profiles = await User.find({
      _id: { $nin: excludeIds }
    })
    .select('profile membership')
    .limit(50);
    
    console.log('✅ Found profiles:', profiles.length);
    
    res.json(profiles);
  } catch (error) {
    console.error('❌ Browse error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get liked profiles
router.get('/likes', auth, async (req, res) => {
  try {
    console.log('❤️  Fetching likes for user:', req.userId);
    
    const currentUser = await User.findById(req.userId);
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Define expiration times
    const LIKE_EXPIRATION_DAYS = 30;
    const MESSAGE_INACTIVITY_DAYS = 10;
    const likeExpirationTime = new Date(Date.now() - LIKE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
    const messageInactivityTime = new Date(Date.now() - MESSAGE_INACTIVITY_DAYS * 24 * 60 * 60 * 1000);
    
    // Filter likes based on:
    // 1. Not expired (older than 30 days)
    // 2. Either have recent message activity OR were just liked (no message yet)
    const activeLikes = currentUser.likes.filter(like => {
      const likedAt = new Date(like.likedAt);
      
      // Remove if like itself is expired
      if (likedAt < likeExpirationTime) {
        return false;
      }
      
      // If there's message activity, check if it's recent
      if (like.lastMessageAt) {
        const lastMessageAt = new Date(like.lastMessageAt);
        return lastMessageAt > messageInactivityTime;
      }
      
      // If no message activity yet, keep it (they just liked)
      return true;
    });
    
    // If there are expired/inactive likes, remove them from the database
    if (activeLikes.length < currentUser.likes.length) {
      const removedCount = currentUser.likes.length - activeLikes.length;
      currentUser.likes = activeLikes;
      await currentUser.save();
      console.log('🗑️  Removed', removedCount, 'expired or inactive likes');
    }
    
    // Populate user details for active likes
    const likedUserIds = activeLikes.map(like => like.userId);
    const likedProfiles = await User.find({ _id: { $in: likedUserIds } })
      .select('profile membership');
    
    console.log('✅ Found', activeLikes.length, 'active liked profiles');
    res.json(likedProfiles);
  } catch (error) {
    console.error('❌ Error fetching likes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user settings
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('settings');
    res.json(user?.settings || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { notifications, privacy } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { settings: { notifications, privacy } } },
      { new: true }
    ).select('settings');
    
    res.json(user?.settings || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('📝 Profile update attempt for user:', req.userId);
    console.log('📋 Update data:', req.body);
    
    const user = await User.findById(req.userId);
    const updates = req.body;
    
    // Check if this is the first time completing the profile
    const isFirstCompletion = !user.profile.bio && updates.bio;
    
    // Apply updates
    Object.assign(user.profile, updates);
    
    // Award points for first profile completion (50 points)
    if (isFirstCompletion) {
      user.membership.earnedPoints += 50;
      console.log('🎉 First profile completion! Awarded 50 points');
    }
    
    await user.save();
    
    console.log('✅ Profile updated successfully for user:', req.userId);
    res.json({
      ...user.toObject(),
      message: isFirstCompletion ? 'Profile completed! You earned 50 points!' : 'Profile updated successfully',
      earnedPoints: user.membership.earnedPoints
    });
  } catch (error) {
    console.error('❌ Profile update error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload photo
router.post('/upload-photo', auth, upload.single('photo'), async (req, res) => {
  try {
    console.log('📸 Photo upload attempt for user:', req.userId);
    console.log('📁 File received:', req.file ? `${req.file.filename} (${req.file.size} bytes)` : 'No file');
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    const photoUrl = `/uploads/photos/${req.file.filename}`;
    
    // Add photo to user's photos array
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('❌ User not found:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.profile.photos) {
      user.profile.photos = [];
    }
    
    user.profile.photos.push(photoUrl);
    
    // Award points for uploading a photo (25 points per photo)
    user.membership.earnedPoints += 25;
    
    await user.save();
    
    console.log('✅ Photo uploaded successfully for user:', req.userId);
    res.json({ 
      message: 'Photo uploaded successfully! You earned 25 points!',
      photoUrl: photoUrl,
      photos: user.profile.photos,
      earnedPoints: user.membership.earnedPoints
    });
  } catch (error) {
    console.error('❌ Photo upload error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete photo
router.delete('/photo/:photoIndex', auth, async (req, res) => {
  try {
    const photoIndex = parseInt(req.params.photoIndex);
    const user = await User.findById(req.userId);
    
    if (!user.profile.photos || photoIndex >= user.profile.photos.length) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Remove photo from filesystem
    const photoPath = user.profile.photos[photoIndex];
    const fullPath = path.join(__dirname, '..', '..', photoPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Remove from user's photos array
    user.profile.photos.splice(photoIndex, 1);
    await user.save();

    res.json({ 
      message: 'Photo deleted successfully',
      photos: user.profile.photos
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get potential matches
router.get('/discover', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const { preferences } = currentUser;
    
    // Extract user IDs from likes (which now have userId property)
    const likedUserIds = currentUser.likes.map(like => like.userId);
    
    // Find users that haven't been liked or passed
    const excludedIds = [
      ...likedUserIds,
      ...currentUser.passes,
      ...currentUser.matches,
      req.userId
    ];
    
    const potentialMatches = await User.find({
      _id: { $nin: excludedIds },
      'profile.age': {
        $gte: preferences.ageRange.min,
        $lte: preferences.ageRange.max
      },
      isActive: true
    }).select('-password').limit(10);
    
    res.json(potentialMatches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Handle like/pass actions
router.post('/action', auth, async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    
    console.log('👆 Action:', action, 'from user:', req.userId, 'to user:', targetUserId);
    
    if (!['like', 'pass'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      console.log('❌ Target user not found:', targetUserId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add to appropriate array
    if (action === 'like') {
      const alreadyLiked = currentUser.likes.some(like => like.userId.toString() === targetUserId);
      if (!alreadyLiked) {
        currentUser.likes.push({ userId: targetUserId, likedAt: new Date() });
        console.log('❤️  Added like. Total likes:', currentUser.likes.length);
        
        // Check if it's a mutual like (match)
        const targetLikedBack = targetUser.likes.some(like => like.userId.toString() === req.userId);
        if (targetLikedBack) {
          // It's a match! Add to both users' matches
          if (!currentUser.matches.includes(targetUserId)) {
            currentUser.matches.push(targetUserId);
          }
          if (!targetUser.matches.includes(req.userId)) {
            targetUser.matches.push(req.userId);
          }
          await targetUser.save();
          console.log('💕 Match found!');
          
          return res.json({ 
            message: 'It\'s a match!', 
            match: true,
            user: targetUser.profile 
          });
        }
      }
    } else if (action === 'pass') {
      if (!currentUser.passes.includes(targetUserId)) {
        currentUser.passes.push(targetUserId);
        console.log('👋 Added pass. Total passes:', currentUser.passes.length);
      }
    }
    
    await currentUser.save();
    console.log('✅ Action saved');
    res.json({ message: 'Action recorded', match: false });
    
  } catch (error) {
    console.error('❌ Action error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user details by ID (MUST be last to avoid matching other routes)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('👤 Fetching user details for:', userId);
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User found:', user.profile.name);
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
