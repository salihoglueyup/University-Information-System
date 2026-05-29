const diningService = require('../services/diningService');

class DiningController {
    async list(req, res, next) {
        try {
            const menu = await diningService.list();
            res.status(200).json(menu);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new DiningController();
