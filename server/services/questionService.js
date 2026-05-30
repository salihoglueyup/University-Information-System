const Question = require('../models/Question');
const AppError = require('../utils/AppError');

exports.list = async (username) => {
    return Question.find({ userId: username }).sort({ createdAt: -1 }).limit(500).lean();
};

exports.create = async (username, data) => {
    const { text, course, topic, difficulty, type } = data;
    return Question.create({
        userId: username,
        text,
        course,
        topic,
        difficulty,
        type,
        date: new Date().toISOString().slice(0, 10)
    });
};

exports.remove = async (username, id) => {
    const deleted = await Question.findOneAndDelete({ _id: id, userId: username });
    if (!deleted) throw new AppError('Soru bulunamadı', 404);
    return deleted;
};
