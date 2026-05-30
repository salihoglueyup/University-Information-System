const systemSettingService = require('../services/systemSettingService');

class SystemSettingController {
    async get(req, res, next) {
        try {
            res.status(200).json(await systemSettingService.get());
        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            res.status(200).json(await systemSettingService.update(req.body));
        } catch (err) { next(err); }
    }
}

module.exports = new SystemSettingController();
