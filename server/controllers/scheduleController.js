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
            // Delegate to the global error handler (err.statusCode is numeric there).
            // Previously used res.status(err.status) where err.status is a string
            // ('fail'/'error'), which threw "Invalid status code" -> 500 on any error.
            next(err);
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
