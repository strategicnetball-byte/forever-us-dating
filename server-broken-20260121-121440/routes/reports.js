const express = require('express');
const Report = require('../models/Report');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit a report
router.post('/submit', auth, async (req, res) => {
  try {
    const { reportedUserId, reportType, photoId, reason, description } = req.body;

    // Validate input
    if (!reportedUserId || !reportType || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['profile', 'photo'].includes(reportType)) {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    // Can't report yourself
    if (req.userId === reportedUserId) {
      return res.status(400).json({ message: 'You cannot report yourself' });
    }

    // Check if user already reported this profile/photo
    const existingReport = await Report.findOne({
      reportedBy: req.userId,
      reportedUser: reportedUserId,
      reportType,
      photoId: photoId || null,
      status: { $in: ['pending', 'reviewed'] }
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this' });
    }

    // Create report
    const report = new Report({
      reportedBy: req.userId,
      reportedUser: reportedUserId,
      reportType,
      photoId: photoId || null,
      reason,
      description: description || ''
    });

    await report.save();

    res.json({
      message: 'Report submitted successfully',
      reportId: report._id
    });
  } catch (error) {
    console.error('Report submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reports (admin only)
router.get('/admin/list', auth, async (req, res) => {
  try {
    // Check if user is admin (you can add admin role to User model)
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const reports = await Report.find({ status })
      .populate('reportedBy', 'profile.name email')
      .populate('reportedUser', 'profile.name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments({ status });

    res.json({
      reports,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get report details (admin only)
router.get('/admin/:reportId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const report = await Report.findById(req.params.reportId)
      .populate('reportedBy', 'profile.name email')
      .populate('reportedUser', 'profile.name email profile.photos')
      .populate('reviewedBy', 'profile.name');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Review report (admin only)
router.post('/admin/:reportId/review', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { action, adminNotes } = req.body;

    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = 'reviewed';
    report.action = action || 'none';
    report.adminNotes = adminNotes || '';
    report.reviewedAt = new Date();
    report.reviewedBy = req.userId;

    await report.save();

    // Take action if needed
    if (action === 'photo_removed' && report.photoId) {
      const reportedUser = await User.findById(report.reportedUser);
      reportedUser.profile.photos = reportedUser.profile.photos.filter(p => p !== report.photoId);
      await reportedUser.save();
    } else if (action === 'profile_suspended') {
      const reportedUser = await User.findById(report.reportedUser);
      reportedUser.accountStatus = 'suspended';
      reportedUser.suspendedAt = new Date();
      reportedUser.suspensionReason = `Report ID: ${report._id}`;
      await reportedUser.save();
    } else if (action === 'profile_banned') {
      const reportedUser = await User.findById(report.reportedUser);
      reportedUser.accountStatus = 'banned';
      reportedUser.bannedAt = new Date();
      reportedUser.banReason = `Report ID: ${report._id}`;
      await reportedUser.save();
    }

    res.json({
      message: 'Report reviewed',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's own reports
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.userId })
      .populate('reportedUser', 'profile.name')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
