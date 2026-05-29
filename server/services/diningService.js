const DiningMenu = require('../models/DiningMenu');

exports.list = async () => {
    return DiningMenu.find().sort({ order: 1, createdAt: 1 }).limit(14).lean();
};
