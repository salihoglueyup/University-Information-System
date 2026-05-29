const internshipService = require('../services/internshipService');

class InternshipController {
    async getStatus(req, res, next) {
        try {
            const status = await internshipService.getStatus(req.user && req.user.username);
            res.status(200).json(status);
        } catch (err) {
            next(err);
        }
    }

    async listOffers(req, res, next) {
        try {
            const offers = await internshipService.listOffers();
            res.status(200).json(offers);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new InternshipController();
