const User = require('../models/User');
const Company = require('../models/Company');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const OJTProgress = require('../models/OJTProgress');
const AuditLog = require('../models/AuditLog');

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status) query.accountStatus = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage user (activate/deactivate)
// @route   PUT /api/admin/user/:id
exports.manageUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accountStatus, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (accountStatus) user.accountStatus = accountStatus;
    if (role) user.role = role;
    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'UPDATE',
      module: 'User',
      details: `Admin updated user ${user.email} - status: ${user.accountStatus}`,
      ip: req.ip
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recruiters for verification
// @route   GET /api/admin/recruiters
exports.getRecruiters = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.verificationStatus = status;

    const companies = await Company.find(query)
      .populate('userId', 'fullName email accountStatus')
      .sort({ createdAt: -1 });

    res.json({ success: true, companies });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify recruiter
// @route   PUT /api/admin/recruiter/:id/verify
exports.verifyRecruiter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;

    if (!['verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    company.verificationStatus = verificationStatus;
    await company.save();

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'UPDATE',
      module: 'Company',
      details: `Admin ${verificationStatus} company: ${company.companyName}`,
      ip: req.ip
    });

    res.json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { module, page = 1, limit = 50 } = req.query;
    let query = {};
    if (module) query.module = module;

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('userId', 'fullName email role')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      logs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalOpportunities = await Opportunity.countDocuments();
    const openOpportunities = await Opportunity.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const activeOJT = await OJTProgress.countDocuments({ endDate: null });
    const completedOJT = await OJTProgress.countDocuments({ endDate: { $ne: null } });
    const pendingVerifications = await Company.countDocuments({ verificationStatus: 'pending' });

    // Application status distribution
    const applicationStats = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Monthly registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalOpportunities,
        openOpportunities,
        totalApplications,
        pendingApplications,
        approvedApplications,
        activeOJT,
        completedOJT,
        pendingVerifications
      },
      applicationStats,
      monthlyRegistrations
    });
  } catch (error) {
    next(error);
  }
};
