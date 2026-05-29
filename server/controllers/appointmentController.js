const appointmentService = require('../services/appointmentService');
const officeHourService = require('../services/officeHourService');

class AppointmentController {
    async list(req, res, next) {
        try {
            res.status(200).json(await appointmentService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            res.status(201).json(await appointmentService.create(req.user && req.user.username, req.body));
        } catch (err) { next(err); }
    }

    async updateStatus(req, res, next) {
        try {
            const updated = await appointmentService.updateStatus(req.user && req.user.username, req.params.id, req.body.status);
            res.status(200).json(updated);
        } catch (err) { next(err); }
    }

    async listOfficeHours(req, res, next) {
        try {
            res.status(200).json(await officeHourService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async createOfficeHour(req, res, next) {
        try {
            res.status(201).json(await officeHourService.create(req.user && req.user.username, req.body));
        } catch (err) { next(err); }
    }
}

module.exports = new AppointmentController();
