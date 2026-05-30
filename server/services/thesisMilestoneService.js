const ThesisMilestone = require('../models/ThesisMilestone');

exports.get = async (thesisId) => {
    if (!thesisId) return null;
    return ThesisMilestone.findOne({ thesisId }).lean();
};
