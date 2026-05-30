const router = require('express').Router();
const uzemExamController = require('../controllers/uzemExamController');

// GET /api/uzem-exams — the user's online (UZEM) exams
router.get('/', uzemExamController.list);

module.exports = router;
