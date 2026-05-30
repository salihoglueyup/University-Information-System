const router = require('express').Router();
const gradingTaskController = require('../controllers/gradingTaskController');

// GET /api/grading-queue — the user's pending grading tasks
router.get('/', gradingTaskController.list);

module.exports = router;
