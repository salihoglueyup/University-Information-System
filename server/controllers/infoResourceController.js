const infoResourceService = require('../services/infoResourceService');

class InfoResourceController {
    async list(req, res, next) {
        try {
            res.status(200).json(await infoResourceService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new InfoResourceController();
