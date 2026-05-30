const ThesisTask = require('../models/ThesisTask');
const AppError = require('../utils/AppError');

const COLUMNS = [
    { id: 'todo', title: 'Yapılacaklar' },
    { id: 'in_progress', title: 'Devam Edenler' },
    { id: 'completed', title: 'Tamamlananlar' }
];

exports.getBoard = async (username) => {
    const items = await ThesisTask.find({ userId: username }).sort({ order: 1, createdAt: 1 }).limit(200).lean();
    return { columns: COLUMNS, items };
};

exports.move = async (username, id, column) => {
    const updated = await ThesisTask.findOneAndUpdate(
        { _id: id, userId: username },
        { column },
        { new: true }
    );
    if (!updated) throw new AppError('Görev bulunamadı', 404);
    return updated;
};

exports.reorder = async (username, id, newIndex) => {
    const updated = await ThesisTask.findOneAndUpdate(
        { _id: id, userId: username },
        { order: newIndex },
        { new: true }
    );
    if (!updated) throw new AppError('Görev bulunamadı', 404);
    return updated;
};
