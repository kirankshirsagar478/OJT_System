const Company = require('../models/Company');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const AuditLog = require('../models/AuditLog');

// @desc    Get recruiter company profile
// @route   GET /api/recruiter/profile
exports.getProfile = async (req, res, next) => {
  try {
    let company = await Company.findOne({ userId: req.user._id }).populate('userId', 'fullName email');
    if (!company) {
      company = await Company.create({ userId: req.user._id, companyName: req.user.fullName + "'s Company" });
      company = await Company.findOne({ userId: req.user._id }).populate('userId', 'fullName email');
    }
    res.json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile
// @route   PUT /api/recruiter/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { companyName, industryType, location, hrName, hrEmail, hrPhone } = req.body;

    let company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      company = await Company.create({ userId: req.user._id, companyName: companyName || 'My Company' });
    }

    if (companyName !== undefined) company.companyName = companyName;
    if (industryType !== undefined) company.industryType = industryType;
    if (location !== undefined) company.location = location;
    if (hrName !== undefined) company.hrName = hrName;
    if (hrEmail !== undefined) company.hrEmail = hrEmail;
    if (hrPhone !== undefined) company.hrPhone = hrPhone;

    await company.save();

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'UPDATE',
      module: 'Company',
      details: `Updated company profile: ${company.companyName}`,
      ip: req.ip
    });

    res.json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

// @desc    Post new opportunity
// @route   POST /api/recruiter/opportunity
exports.createOpportunity = async (req, res, next) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(400).json({ success: false, message: 'Company profile not found. Please complete your profile first.' });
    }

    if (company.verificationStatus !== 'verified') {
      return res.status(403).json({ success: false, message: 'Company must be verified to post opportunities. Contact admin.' });
    }

    const { title, description, requiredSkills, stipend, duration, deadline } = req.body;

    const opportunity = await Opportunity.create({
      companyId: company._id,
      title,
      description,
      requiredSkills: requiredSkills || [],
      stipend: stipend || 'Unpaid',
      duration: duration || '',
      deadline
    });

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'CREATE',
      module: 'Opportunity',
      details: `Posted opportunity: ${title}`,
      ip: req.ip
    });

    res.status(201).json({ success: true, opportunity });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's opportunities
// @route   GET /api/recruiter/opportunities
exports.getOpportunities = async (req, res, next) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.json({ success: true, opportunities: [] });
    }

    const opportunities = await Opportunity.find({ companyId: company._id })
      .sort({ createdAt: -1 });

    // Get application count for each opportunity
    const oppsWithCounts = await Promise.all(
      opportunities.map(async (opp) => {
        const applicationCount = await Application.countDocuments({ opportunityId: opp._id });
        return { ...opp.toObject(), applicationCount };
      })
    );

    res.json({ success: true, opportunities: oppsWithCounts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for an opportunity
// @route   GET /api/recruiter/applicants/:opportunityId
exports.getApplicants = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    // Verify ownership
    const company = await Company.findOne({ userId: req.user._id });
    const opportunity = await Opportunity.findById(opportunityId);
    
    if (!opportunity || !company || opportunity.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ opportunityId })
      .populate('studentId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications, opportunity });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (shortlist/reject)
// @route   PUT /api/recruiter/application/:applicationId
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, remarks } = req.body;

    if (!['shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use shortlisted or rejected.' });
    }

    const application = await Application.findById(applicationId).populate('opportunityId');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify ownership
    const company = await Company.findOne({ userId: req.user._id });
    if (!company || application.opportunityId.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    if (remarks) application.remarks = remarks;
    await application.save();

    await AuditLog.create({
      userId: req.user._id,
      actionType: 'UPDATE',
      module: 'Application',
      details: `Application ${applicationId} ${status}`,
      ip: req.ip
    });

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter dashboard
// @route   GET /api/recruiter/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.json({
        success: true,
        stats: { totalOpportunities: 0, totalApplications: 0, shortlisted: 0, openPositions: 0 },
        recentApplications: []
      });
    }

    const totalOpportunities = await Opportunity.countDocuments({ companyId: company._id });
    const openPositions = await Opportunity.countDocuments({ companyId: company._id, status: 'open' });
    
    const opportunityIds = (await Opportunity.find({ companyId: company._id }).select('_id')).map(o => o._id);
    const totalApplications = await Application.countDocuments({ opportunityId: { $in: opportunityIds } });
    const shortlisted = await Application.countDocuments({ opportunityId: { $in: opportunityIds }, status: 'shortlisted' });

    const recentApplications = await Application.find({ opportunityId: { $in: opportunityIds } })
      .populate('studentId', 'fullName email')
      .populate('opportunityId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      company,
      stats: { totalOpportunities, totalApplications, shortlisted, openPositions },
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};
