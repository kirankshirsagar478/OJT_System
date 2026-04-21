const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getUsers,
  manageUser,
  getRecruiters,
  verifyRecruiter,
  getAuditLogs,
  getAnalytics
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/user/:id', manageUser);
router.get('/recruiters', getRecruiters);
router.put('/recruiter/:id/verify', verifyRecruiter);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
