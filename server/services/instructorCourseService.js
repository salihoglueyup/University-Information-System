const InstructorCourse = require('../models/InstructorCourse');

exports.list = async (username) => {
    return InstructorCourse.find({ userId: username }).sort({ code: 1 }).limit(100).lean();
};
