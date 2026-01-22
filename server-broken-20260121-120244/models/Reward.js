const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['video_ad', 'survey', 'offer', 'daily_bonus', 'referral'],
    required: true
  },
  provider: {
    type: String, // 'admob', 'pollfish', 'tapresearch', etc.
    required: true
  },
  providerId: String, // External transaction ID
  pointsEarned: {
    type: Number,
    required: true
  },
  revenueEarned: {
    type: Number, // Your revenue from this action
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  metadata: {
    adType: String,
    surveyLength: Number,
    offerName: String,
    completionTime: Number
  }
}, {
  timestamps: true
});

// Index for efficient queries
rewardSchema.index({ userId: 1, createdAt: -1 });
rewardSchema.index({ provider: 1, providerId: 1 });

module.exports = mongoose.model('Reward', rewardSchema);