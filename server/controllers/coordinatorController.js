const Application = require('../models/Application');
const OJTProgress = require('../models/OJTProgress');
const Opportunity = require('../models/Opportunity');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const AuditLog = require('../models/AuditLog');

// @desc    Get all shortlisted applications
// @route   GET /api/coordinator/applications
exports.getApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['shortlisted', 'approved', 'rejected'] };
    }

    const applications = await Application.find(query)
      .populate('studentId', 'fullName email')
      .populate({
        path: 'opportunityId',
        populate: { path: 'companyId', select: 'companyName location' }
      })
      .sort({ updatedAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject application
// @route   PUT /api/coordinator/approve/:applicationId
exports.approveApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, remarks } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use approved or rejected.' });
    }

    const application = await Application.findById(applicationId).populate('opportunityId');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    if (remarks) application.remarks = remarks;
    await application.save();

    // If approved, create OJT Progress record and update student status
    if (status === 'approved') {
      const existingProgress = await OJTProgress.findOne({
        studentId: application.studentId,
        companyId: application.opportunityId.companyId
      });

      if (!existingProgress) {
        await OJTProgress.create({
          studentId: application.studentId,
          companyId: application.opportunityId.companyId,
          startDate: new Date()
        });
      }

      await StudentProfile.findOneAndUpdate(
        { userId: application.studentId },
        { ojtStatus: 'in-progress' }
      );
    }

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'UPDATE',
      module: 'Application',
      details: `Coordinator ${status} application ${applicationId}`,
      ip: req.ip
    });

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all OJT progress records
// @route   GET /api/coordinator/progress
exports.getProgress = async (req, res, next) => {
  try {
    const progress = await OJTProgress.find()
      .populate('studentId', 'fullName email')
      .populate('companyId', 'companyName location')
      .sort({ createdAt: -1 });

    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Update OJT progress
// @route   PUT /api/coordinator/progress/:progressId
exports.updateProgress = async (req, res, next) => {
  try {
    const { progressId } = req.params;
    const { mentor, attendance, performanceStatus, endDate, certificate } = req.body;

    const progress = await OJTProgress.findById(progressId);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    if (mentor !== undefined) progress.mentor = mentor;
    if (attendance !== undefined) progress.attendance = attendance;
    if (performanceStatus !== undefined) progress.performanceStatus = performanceStatus;
    if (endDate !== undefined) progress.endDate = endDate;
    if (certificate !== undefined) progress.certificate = certificate;

    await progress.save();

    // If performance is set and end date exists, mark student OJT as completed
    if (progress.endDate && progress.performanceStatus !== 'pending') {
      await StudentProfile.findOneAndUpdate(
        { userId: progress.studentId },
        { ojtStatus: 'completed' }
      );
    }

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'UPDATE',
      module: 'OJTProgress',
      details: `Updated progress for student ${progress.studentId}`,
      ip: req.ip
    });

    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Get coordinator dashboard
// @route   GET /api/coordinator/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const pendingApprovals = await Application.countDocuments({ status: 'shortlisted' });
    const approved = await Application.countDocuments({ status: 'approved' });
    const rejected = await Application.countDocuments({ status: 'rejected' });
    const activeOJT = await OJTProgress.countDocuments({ endDate: null });
    const completedOJT = await OJTProgress.countDocuments({ endDate: { $ne: null } });
    const totalStudents = await StudentProfile.countDocuments();

    const recentApplications = await Application.find({ status: 'shortlisted' })
      .populate('studentId', 'fullName email')
      .populate({
        path: 'opportunityId',
        populate: { path: 'companyId', select: 'companyName' }
      })
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: { pendingApprovals, approved, rejected, activeOJT, completedOJT, totalStudents },
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};
