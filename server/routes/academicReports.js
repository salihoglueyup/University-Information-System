const router = require('express').Router();
const academicReportController = require('../controllers/academicReportController');

// GET /api/academic-reports — institution-wide academic report data
router.get('/', academicReportController.get);

module.exports = router;
