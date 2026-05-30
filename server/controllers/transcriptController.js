const transcriptService = require('../services/transcriptService');

class TranscriptController {
    async list(req, res, next) {
        try {
            res.status(200).json(await transcriptService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new TranscriptController();
