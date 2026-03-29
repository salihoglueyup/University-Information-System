const attendanceService = require('../services/attendanceService');
const catchAsync = require('../utils/catchAsync');

exports.getAttendances = catchAsync(async (req, res) => {
    const userId = req.query.userId || 'all';
    const attendances = await attendanceService.getAttendances(userId);
    res.status(200).json(attendances);
});

exports.createAttendance = catchAsync(async (req, res) => {
    const savedAttendance = await attendanceService.createAttendance(req.body);
    res.status(201).json(savedAttendance);
});
