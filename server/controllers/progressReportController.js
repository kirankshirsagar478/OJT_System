const ProgressReport = require('../models/ProgressReport');

// @desc    Create a new progress report
// @route   POST /api/progress
// @access  Private (student only)
exports.createReport = async (req, res, next) => {
  try {
    const { type, date, tasks, learning, hoursWorked, remarks } = req.body;

    if (!type || !tasks || !learning || hoursWorked === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, tasks, learning, and hoursWorked'
      });
    }

    const validTypes = ['daily', 'weekly', 'monthly'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Report type must be daily, weekly, or monthly'
      });
    }

    const report = await ProgressReport.create({
      studentId: req.user._id,
      type,
      date: date ? new Date(date) : new Date(),
      tasks,
      learning,
      hoursWorked: Number(hoursWorked),
      remarks: remarks || ''
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all progress reports for the current student
// @route   GET /api/progress
// @access  Private (student only)
exports.getReports = async (req, res, next) => {
  try {
    const { type } = req.query;

    const filter = { studentId: req.user._id };
    if (type && ['daily', 'weekly', 'monthly'].includes(type)) {
      filter.type = type;
    }

    const reports = await ProgressReport.find(filter).sort({ date: -1, createdAt: -1 });

    // Calculate total hours across all reports (unfiltered)
    const allReports = await ProgressReport.find({ studentId: req.user._id });
    const totalHours = allReports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);

    res.json({ success: true, reports, totalHours });
  } catch (error) {
    next(error);
  }
};
