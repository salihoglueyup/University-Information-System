const router = require('express').Router();
const graduationStatusController = require('../controllers/graduationStatusController');

// GET /api/graduation-status — the user's graduation eligibility snapshot
router.get('/', graduationStatusController.get);

module.exports = router;
