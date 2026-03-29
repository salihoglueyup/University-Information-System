const Attendance = require('../models/Attendance');

exports.getAttendances = async (userId) => {
    return await Attendance.find({ userId });
};

exports.createAttendance = async (data) => {
    const newAttendance = new Attendance(data);
    return await newAttendance.save();
};
