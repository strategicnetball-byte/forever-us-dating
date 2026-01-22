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
    enum: [
      'inappropriate-photos',
      'offensive-language',
      'harassment',
      'scam-fraud',
      'fake-profile',
      'underage',
      'explicit-content',
      'spam',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 1000,
    required: true
  },
  evidence: {
    messageId: mongoose.Schema.Types.ObjectId,
    photoUrl: String,
    timestamp: Date
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'resolved', 'dismissed'],
    default: 'pending'
  },
  resolution: {
    action: {
      type: String,
      enum: ['warning', 'suspended', 'banned', 'no-action']
    },
    notes: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
reportSchema.index({ reportedUser: 1, status: 1 });
reportSchema.index({ reportedBy: 1, createdAt: -1 });
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
