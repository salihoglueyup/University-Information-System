const router = require('express').Router();
const examSessionController = require('../controllers/examSessionController');

// GET /api/exam-sessions — scheduled exam sessions for the proctoring scheduler
router.get('/', examSessionController.list);

module.exports = router;
