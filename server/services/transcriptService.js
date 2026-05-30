const TranscriptEntry = require('../models/TranscriptEntry');

exports.list = async (username) => {
    return TranscriptEntry.find({ userId: username }).sort({ semester: 1, code: 1 }).limit(300).lean();
};
