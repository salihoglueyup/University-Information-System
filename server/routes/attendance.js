const router = require('express').Router();
const attendanceController = require('../controllers/attendanceController');

// GET ALL ATTENDANCE
router.get('/', attendanceController.getAttendances);

// CREATE ATTENDANCE
router.post('/', attendanceController.createAttendance);

module.exports = router;
