const radioScheduleService = require('../services/radioScheduleService');

class RadioScheduleController {
    async list(req, res, next) {
        try {
            res.status(200).json(await radioScheduleService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new RadioScheduleController();
