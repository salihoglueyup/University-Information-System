const contractService = require('../services/contractService');

class ContractController {
    async list(req, res, next) {
        try {
            res.status(200).json(await contractService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async updateStatus(req, res, next) {
        try {
            const updated = await contractService.updateStatus(req.user && req.user.username, req.params.id, req.body.status);
            res.status(200).json(updated);
        } catch (err) { next(err); }
    }
}

module.exports = new ContractController();
