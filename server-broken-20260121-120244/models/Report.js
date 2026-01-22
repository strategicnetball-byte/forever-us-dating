const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['profile', 'photo'],
    required: true
  },
  photoId: {
    type: String, // Only for photo reports
    default: null
  },
  reason: {
    type: String,
    enum: [
      'offensive_content',
      'obscene_content',
      'fake_profile',
      'harassment',
      'spam',
      'inappropriate_photos',
      'underage_content',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  action: {
    type: String,
    enum: ['none', 'warning', 'photo_removed', 'profile_suspended', 'profile_banned'],
    default: 'none'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

// Index for efficient querying
reportSchema.index({ reportedUser: 1, status: 1 });
reportSchema.index({ reportedBy: 1, createdAt: -1 });
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
