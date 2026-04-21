const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getProfile,
  updateProfile,
  getOpportunities,
  applyToOpportunity,
  getApplications,
  uploadResume,
  getProgress,
  getDashboard
} = require('../controllers/studentController');

// Multer config for resume upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `resume-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'));
    }
  }
});

// All routes require student role
router.use(protect, authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/opportunities', getOpportunities);
router.post('/apply/:opportunityId', applyToOpportunity);
router.get('/applications', getApplications);
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.get('/progress', getProgress);

module.exports = router;
