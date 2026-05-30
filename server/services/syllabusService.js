const SyllabusWeek = require('../models/SyllabusWeek');

exports.list = async (courseId) => {
    if (!courseId) return [];
    return SyllabusWeek.find({ courseId }).sort({ week: 1 }).limit(30).lean();
};
