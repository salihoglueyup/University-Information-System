const vehicleService = require('../services/vehicleService');

class VehicleController {
    async getCurrent(req, res, next) {
        try {
            const vehicle = await vehicleService.getCurrent(req.user && req.user.username);
            res.status(200).json(vehicle);
        } catch (err) {
            next(err);
        }
    }

    async apply(req, res, next) {
        try {
            const created = await vehicleService.apply(req.user && req.user.username, req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new VehicleController();
