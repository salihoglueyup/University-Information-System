const publicationService = require('../services/publicationService');

class PublicationController {
    async list(req, res, next) {
        try {
            res.status(200).json(await publicationService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new PublicationController();
