const tuitionFeeService = require('../services/tuitionFeeService');

class TuitionFeeController {
    async list(req, res, next) {
        try {
            res.status(200).json(await tuitionFeeService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async pay(req, res, next) {
        try {
            const updated = await tuitionFeeService.pay(req.user && req.user.username, req.params.id);
            res.status(200).json(updated);
        } catch (err) { next(err); }
    }
}

module.exports = new TuitionFeeController();
