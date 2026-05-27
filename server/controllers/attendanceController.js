const attendanceService = require('../services/attendanceService');
const catchAsync = require('../utils/catchAsync');

exports.getAttendances = catchAsync(async (req, res) => {
    const role = req.user?.role;
    let userId;
    if (role === 'admin' || role === 'academic') {
        userId = req.query.userId || req.user.id;
    } else {
        userId = req.user.id;
    }
    const attendances = await attendanceService.getAttendances(userId);
    res.status(200).json(attendances);
});

exports.createAttendance = catchAsync(async (req, res) => {
    const savedAttendance = await attendanceService.createAttendance(req.body);
    res.status(201).json(savedAttendance);
});
