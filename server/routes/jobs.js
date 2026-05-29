const router = require('express').Router();
const jobController = require('../controllers/jobController');

// GET /api/jobs — job & internship listings
router.get('/', jobController.list);

module.exports = router;
