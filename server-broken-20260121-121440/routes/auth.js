const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, age, gender } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({
      email,
      password,
      profile: { name, age, gender }
    });
    
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        membership: user.membership
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('🔐 Login attempt:', req.body.email);
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('✅ Login successful for:', email);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        membership: user.membership
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    // Update lastSeen
    user.lastSeen = new Date();
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update lastSeen (for activity tracking)
router.post('/update-activity', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.lastSeen = new Date();
    await user.save();
    
    res.json({ message: 'Activity updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot Password - Send reset code
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({ message: 'If email exists, reset code will be sent' });
    }
    
    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    user.passwordReset = {
      code: resetCode,
      expiresAt
    };
    
    await user.save();
    
    // In production, send email with reset code
    // For now, log it to console for testing
    console.log(`🔐 Password reset code for ${email}: ${resetCode}`);
    
    res.json({ message: 'Reset code sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset Password - Verify code and reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Check if reset code exists and is valid
    if (!user.passwordReset || !user.passwordReset.code) {
      return res.status(400).json({ message: 'No reset code requested' });
    }
    
    // Check if code matches
    if (user.passwordReset.code !== resetCode) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }
    
    // Check if code has expired
    if (new Date() > user.passwordReset.expiresAt) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }
    
    // Update password
    user.password = newPassword;
    user.passwordReset = {
      code: null,
      expiresAt: null
    };
    
    await user.save();
    
    console.log(`✅ Password reset successful for ${email}`);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


// Send email verification code
router.post('/send-verification-code', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.emailVerification = {
      code: verificationCode,
      expiresAt
    };
    
    await user.save();
    
    // In production, send email with code
    console.log(`📧 Email verification code for ${email}: ${verificationCode}`);
    
    res.json({ message: 'Verification code sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    if (!user.emailVerification || !user.emailVerification.code) {
      return res.status(400).json({ message: 'No verification code requested' });
    }
    
    if (user.emailVerification.code !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    
    if (new Date() > user.emailVerification.expiresAt) {
      return res.status(400).json({ message: 'Verification code expired' });
    }
    
    user.emailVerified = true;
    user.emailVerification = {
      code: null,
      expiresAt: null
    };
    
    // Award points for email verification (30 points)
    user.membership.earnedPoints += 30;
    
    await user.save();
    
    res.json({ 
      message: 'Email verified successfully! You earned 30 points!',
      earnedPoints: user.membership.earnedPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
