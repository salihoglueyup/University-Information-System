const ExamApplication = require('../models/ExamApplication');
const AppError = require('../utils/AppError');

exports.list = async () => {
    return ExamApplication.find().sort({ order: 1, date: 1 }).limit(100).lean();
};

exports.apply = async (username, id) => {
    const exam = await ExamApplication.findById(id);
    if (!exam) throw new AppError('Sınav bulunamadı', 404);

    if (!exam.appliedUserIds.includes(username)) {
        exam.appliedUserIds.push(username);
        await exam.save();
    }
    return { id: exam._id, name: exam.name, applied: true };
};
