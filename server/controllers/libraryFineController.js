const libraryFineService = require('../services/libraryFineService');

class LibraryFineController {
    async list(req, res, next) {
        try {
            res.status(200).json(await libraryFineService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async pay(req, res, next) {
        try {
            const updated = await libraryFineService.pay(req.user && req.user.username, req.params.id);
            res.status(200).json(updated);
        } catch (err) { next(err); }
    }
}

module.exports = new LibraryFineController();
