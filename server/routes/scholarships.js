const router = require('express').Router();
const scholarshipController = require('../controllers/scholarshipController');
const { validate } = require('../middleware/validate');

// GET /api/scholarships — current user's scholarships & applications
router.get('/', scholarshipController.list);

// POST /api/scholarships — apply for a scholarship
router.post('/', validate('scholarshipApply'), scholarshipController.apply);

module.exports = router;
