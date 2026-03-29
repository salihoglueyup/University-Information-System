const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { verifyToken, restrictTo } = require('../middleware/auth');

// GET ALL SCHEDULES
router.get('/', verifyToken, scheduleController.getAll);

// CREATE SCHEDULE
// Only staff should be able to create schedule events
router.post('/', verifyToken, restrictTo('admin', 'academic'), scheduleController.create);

module.exports = router;
