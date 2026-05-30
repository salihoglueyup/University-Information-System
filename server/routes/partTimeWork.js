const router = require('express').Router();
const partTimeWorkController = require('../controllers/partTimeWorkController');
const { validate } = require('../middleware/validate');

// GET /api/part-time-work — the user's part-time assignment + timesheet
router.get('/', partTimeWorkController.get);

// POST /api/part-time-work/shifts — log a worked shift
router.post('/shifts', validate('partTimeShift'), partTimeWorkController.addShift);

module.exports = router;
