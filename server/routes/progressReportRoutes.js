const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { createReport, getReports } = require('../controllers/progressReportController');

// All progress report routes: JWT protected + student only
router.use(protect, authorize('student'));

router.post('/', createReport);
router.get('/', getReports);

module.exports = router;
