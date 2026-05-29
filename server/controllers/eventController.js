const eventService = require('../services/eventService');

class EventController {
    async list(req, res, next) {
        try {
            const events = await eventService.list();
            res.status(200).json(events);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new EventController();
