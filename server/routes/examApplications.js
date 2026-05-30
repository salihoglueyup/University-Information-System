const router = require('express').Router();
const examApplicationController = require('../controllers/examApplicationController');

// GET /api/exam-applications — available special exams (catalog)
router.get('/', examApplicationController.list);

// POST /api/exam-applications/:id/apply — apply for an exam
router.post('/:id/apply', examApplicationController.apply);

module.exports = router;
