const CatalogCourse = require('../models/CatalogCourse');

exports.list = async () => {
    return CatalogCourse.find().sort({ semester: 1, code: 1 }).limit(500).lean();
};
