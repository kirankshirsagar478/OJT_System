const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validateOpportunity } = require('../middleware/validate');
const {
  getProfile,
  updateProfile,
  createOpportunity,
  getOpportunities,
  getApplicants,
  updateApplicationStatus,
  getDashboard
} = require('../controllers/recruiterController');

router.use(protect, authorize('recruiter'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/opportunity', validateOpportunity, createOpportunity);
router.get('/opportunities', getOpportunities);
router.get('/applicants/:opportunityId', getApplicants);
router.put('/application/:applicationId', updateApplicationStatus);

module.exports = router;
