const router = require('express').Router();
const academicProgressController = require('../controllers/academicProgressController');
const { validate } = require('../middleware/validate');

// GET /api/academic-progress — the user's academic-progress record
router.get('/', academicProgressController.getProgress);

// POST /api/academic-progress/publications — add a publication
router.post('/publications', validate('publication'), academicProgressController.addPublication);

module.exports = router;
