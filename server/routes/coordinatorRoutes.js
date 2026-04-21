const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getApplications,
  approveApplication,
  getProgress,
  updateProgress,
  getDashboard
} = require('../controllers/coordinatorController');

router.use(protect, authorize('coordinator'));

router.get('/dashboard', getDashboard);
router.get('/applications', getApplications);
router.put('/approve/:applicationId', approveApplication);
router.get('/progress', getProgress);
router.put('/progress/:progressId', updateProgress);

module.exports = router;
