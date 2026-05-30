const virtualTourService = require('../services/virtualTourService');

class VirtualTourController {
    async list(req, res, next) {
        try {
            res.status(200).json(await virtualTourService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new VirtualTourController();
