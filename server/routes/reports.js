const express = require('express');
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const User = require('../models/User');

const router = express.Router();

// Submit a report
router.post('/submit', auth, async (req, res) => {
  try {
    const { reportedUserId, reportType, description, evidence } = req.body;

    // Validate required fields
    if (!reportedUserId || !reportType || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Prevent self-reporting
    if (req.userId === reportedUserId) {
      return res.status(400).json({ message: 'Cannot report yourself' });
    }

    // Check if user already reported this person
    const existingReport = await Report.findOne({
      reportedBy: req.userId,
      reportedUser: reportedUserId,
      status: { $in: ['pending', 'under-review'] }
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this user' });
    }

    // Create report
    const report = new Report({
      reportedBy: req.userId,
      reportedUser: reportedUserId,
      reportType,
      description,
      evidence: evidence || {}
    });

    await report.save();

    console.log(`📋 Report submitted: ${req.userId} reported ${reportedUserId} for ${reportType}`);

    res.status(201).json({
      message: 'Report submitted successfully',
      reportId: report._id
    });
  } catch (error) {
    console.error('❌ Report submission error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reports for admin (all pending/under-review)
router.get('/admin/pending', auth, async (req, res) => {
  try {
    // Check if user is admin (you can add admin role to User model)
    // For now, we'll allow any authenticated user to view
    
    const reports = await Report.find({
      status: { $in: ['pending', 'under-review'] }
    })
    .populate('reportedBy', 'email profile.name')
    .populate('reportedUser', 'email profile.name')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching reports:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get report details
router.get('/:reportId', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId)
      .populate('reportedBy', 'email profile.name')
      .populate('reportedUser', 'email profile.name')
      .populate('resolution.resolvedBy', 'email profile.name');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('❌ Error fetching report:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update report status (admin only)
router.put('/:reportId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'under-review', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    console.log(`📋 Report ${req.params.reportId} status updated to: ${status}`);

    res.json(report);
  } catch (error) {
    console.error('❌ Error updating report:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Resolve report with action
router.put('/:reportId/resolve', auth, async (req, res) => {
  try {
    const { action, notes } = req.body;

    if (!['warning', 'suspended', 'banned', 'no-action'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Update report
    report.status = 'resolved';
    report.resolution = {
      action,
      notes: notes || '',
      resolvedAt: new Date(),
      resolvedBy: req.userId
    };

    await report.save();

    // Apply action to reported user
    const reportedUser = await User.findById(report.reportedUser);
    if (reportedUser) {
      if (action === 'warning') {
        // Add warning flag
        reportedUser.settings = reportedUser.settings || {};
        reportedUser.settings.warnings = (reportedUser.settings.warnings || 0) + 1;
      } else if (action === 'suspended') {
        // Suspend account
        reportedUser.isActive = false;
        reportedUser.settings = reportedUser.settings || {};
        reportedUser.settings.suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      } else if (action === 'banned') {
        // Ban account
        reportedUser.isActive = false;
        reportedUser.settings = reportedUser.settings || {};
        reportedUser.settings.banned = true;
      }
      await reportedUser.save();
    }

    console.log(`✅ Report ${req.params.reportId} resolved with action: ${action}`);

    res.json({
      message: 'Report resolved',
      report
    });
  } catch (error) {
    console.error('❌ Error resolving report:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's report history
router.get('/user/:userId/history', auth, async (req, res) => {
  try {
    const reports = await Report.find({
      reportedUser: req.params.userId
    })
    .populate('reportedBy', 'email profile.name')
    .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching user report history:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get statistics
router.get('/admin/stats', auth, async (req, res) => {
  try {
    const stats = {
      total: await Report.countDocuments(),
      pending: await Report.countDocuments({ status: 'pending' }),
      underReview: await Report.countDocuments({ status: 'under-review' }),
      resolved: await Report.countDocuments({ status: 'resolved' }),
      dismissed: await Report.countDocuments({ status: 'dismissed' }),
      byType: await Report.aggregate([
        { $group: { _id: '$reportType', count: { $sum: 1 } } }
      ])
    };

    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
