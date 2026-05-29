const router = require('express').Router();
const healthReportController = require('../controllers/healthReportController');
const { validate } = require('../middleware/validate');

// GET /api/health-reports — current user's reports
router.get('/', healthReportController.list);

// POST /api/health-reports — submit a report (body validated by Zod)
router.post('/', validate('healthReport'), healthReportController.create);

module.exports = router;
