const router = require('express').Router();
const radioScheduleController = require('../controllers/radioScheduleController');

// GET /api/radio-schedule — university radio/TV broadcast schedule
router.get('/', radioScheduleController.list);

module.exports = router;
