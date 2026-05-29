const LostFoundItem = require('../models/LostFoundItem');
const AppError = require('../utils/AppError');

exports.list = async ({ type, search } = {}) => {
    const query = {};
    if (type === 'found' || type === 'lost') query.type = type;
    if (search) query.item = { $regex: String(search).slice(0, 80), $options: 'i' };
    return LostFoundItem.find(query).sort({ createdAt: -1 }).limit(100).lean();
};

exports.create = async (data, reportedBy) => {
    const { item, category, location, type, status, image, description } = data || {};
    if (!item || !String(item).trim()) {
        throw new AppError('Eşya adı gereklidir', 400);
    }
    return LostFoundItem.create({
        item: String(item).trim(),
        category,
        location,
        type: type === 'found' ? 'found' : 'lost',
        status,
        image,
        description,
        reportedBy
    });
};
