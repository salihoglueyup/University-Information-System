const healthAppointmentService = require('../services/healthAppointmentService');

class HealthAppointmentController {
    async list(req, res, next) {
        try {
            res.status(200).json(await healthAppointmentService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            res.status(201).json(await healthAppointmentService.create(req.user && req.user.username, req.body));
        } catch (err) { next(err); }
    }
}

module.exports = new HealthAppointmentController();
