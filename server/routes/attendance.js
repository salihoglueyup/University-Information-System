const router = require('express').Router();
const attendanceController = require('../controllers/attendanceController');
const { restrictTo, verifyToken } = require('../middleware/auth');

// GET ALL ATTENDANCE
router.get('/', verifyToken, attendanceController.getAttendances);

// CREATE ATTENDANCE
router.post('/', restrictTo('admin', 'academic'), attendanceController.createAttendance);

module.exports = router;
