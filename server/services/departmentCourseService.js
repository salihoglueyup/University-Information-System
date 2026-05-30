const DepartmentCourse = require('../models/DepartmentCourse');

exports.list = async () => {
    return DepartmentCourse.find().sort({ semester: 1, code: 1 }).limit(500).lean();
};
