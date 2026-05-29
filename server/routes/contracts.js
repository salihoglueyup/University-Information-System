const router = require('express').Router();
const contractController = require('../controllers/contractController');
const { validate } = require('../middleware/validate');

// GET /api/contracts — current user's contracts
router.get('/', contractController.list);

// PATCH /api/contracts/:id/status — sign/approve a contract
router.patch('/:id/status', validate('contractStatus'), contractController.updateStatus);

module.exports = router;
