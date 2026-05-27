const Attendance = require('../models/Attendance');

exports.getAttendances = async (userId) => {
    return await Attendance.find({ userId }).lean();
};

exports.createAttendance = async (data) => {
    const newAttendance = new Attendance(data);
    return await newAttendance.save();
};
