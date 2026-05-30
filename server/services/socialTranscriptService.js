const SocialTranscript = require('../models/SocialTranscript');

exports.get = async (username) => {
    return SocialTranscript.findOne({ userId: username }).lean();
};
