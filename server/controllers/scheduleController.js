const scheduleService = require('../services/scheduleService');

class ScheduleController {
    async getAll(req, res, next) {
        try {
            // Because verifyToken hasn't been consistently applied, handle missing req.user
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "You are not authenticated!" });
            }
            const schedules = await scheduleService.getAllSchedules(req.user.id);
            res.status(200).json(schedules);
        } catch (err) {
            if (err.status) {
                res.status(err.status).json({ message: err.message });
            } else {
                next(err);
            }
        }
    }

    async create(req, res, next) {
        try {
            const result = await scheduleService.createSchedule(req.body);
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ScheduleController();
