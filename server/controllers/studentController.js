const StudentProfile = require('../models/StudentProfile');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const OJTProgress = require('../models/OJTProgress');
const AuditLog = require('../models/AuditLog');

// @desc    Get student profile
// @route   GET /api/student/profile
exports.getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id }).populate('userId', 'fullName email');
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id });
      profile = await StudentProfile.findOne({ userId: req.user._id }).populate('userId', 'fullName email');
    }
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { enrollmentNo, department, year, cgpa, skills } = req.body;
    
    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id });
    }

    if (enrollmentNo !== undefined) profile.enrollmentNo = enrollmentNo;
    if (department !== undefined) profile.department = department;
    if (year !== undefined) profile.year = year;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (skills !== undefined) profile.skills = skills;

    await profile.save();

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'UPDATE',
      module: 'StudentProfile',
      details: 'Student updated profile',
      ip: req.ip
    });

    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all open opportunities
// @route   GET /api/student/opportunities
exports.getOpportunities = async (req, res, next) => {
  try {
    const { search, skills, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'open', deadline: { $gte: new Date() } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim());
      query.requiredSkills = { $in: skillArr };
    }

    const total = await Opportunity.countDocuments(query);
    const opportunities = await Opportunity.find(query)
      .populate('companyId', 'companyName location industryType')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ 
      success: true, 
      opportunities, 
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      } 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to an opportunity
// @route   POST /api/student/apply/:opportunityId
exports.applyToOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    // Check if opportunity exists and is open
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity || opportunity.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Opportunity not available' });
    }

    // Check if deadline passed
    if (new Date(opportunity.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    // Check if already applied
    const existing = await Application.findOne({ studentId: req.user._id, opportunityId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already applied to this opportunity' });
    }

    // Get student resume
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    const application = await Application.create({
      studentId: req.user._id,
      opportunityId,
      resume: profile?.resumeLink || ''
    });

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'CREATE',
      module: 'Application',
      details: `Applied to opportunity: ${opportunity.title}`,
      ip: req.ip
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for current student
// @route   GET /api/student/applications
exports.getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'opportunityId',
        populate: { path: 'companyId', select: 'companyName location' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/student/upload-resume
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const resumeLink = `/uploads/${req.file.filename}`;
    
    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id });
    }
    profile.resumeLink = resumeLink;
    await profile.save();

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'UPLOAD',
      module: 'StudentProfile',
      details: 'Resume uploaded',
      ip: req.ip
    });

    res.json({ success: true, resumeLink });
  } catch (error) {
    next(error);
  }
};

// @desc    Get OJT progress for current student
// @route   GET /api/student/progress
exports.getProgress = async (req, res, next) => {
  try {
    const progress = await OJTProgress.find({ studentId: req.user._id })
      .populate('companyId', 'companyName location');
    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/student/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const totalApplications = await Application.countDocuments({ studentId: req.user._id });
    const pendingApplications = await Application.countDocuments({ studentId: req.user._id, status: 'pending' });
    const shortlisted = await Application.countDocuments({ studentId: req.user._id, status: 'shortlisted' });
    const approved = await Application.countDocuments({ studentId: req.user._id, status: 'approved' });
    const rejected = await Application.countDocuments({ studentId: req.user._id, status: 'rejected' });
    const openOpportunities = await Opportunity.countDocuments({ status: 'open', deadline: { $gte: new Date() } });

    const recentApplications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'opportunityId',
        populate: { path: 'companyId', select: 'companyName' }
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalApplications,
        pendingApplications,
        shortlisted,
        approved,
        rejected,
        openOpportunities,
        ojtStatus: profile?.ojtStatus || 'not-started'
      },
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};
