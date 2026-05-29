const router = require('express').Router();
const examController = require('../controllers/examController');

// GET /api/exams/results — exam results grouped by course
router.get('/results', examController.listResults);

// GET /api/exams/schedule — upcoming exam schedule with assigned seats
router.get('/schedule', examController.listSchedule);

module.exports = router;
