const socialTranscriptService = require('../services/socialTranscriptService');

class SocialTranscriptController {
    async get(req, res, next) {
        try {
            res.status(200).json(await socialTranscriptService.get(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new SocialTranscriptController();
