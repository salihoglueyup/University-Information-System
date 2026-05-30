const router = require('express').Router();
const financialReportController = require('../controllers/financialReportController');

// GET /api/financial-reports — institution-wide financial report data
router.get('/', financialReportController.get);

module.exports = router;
