const router = require('express').Router();
const supportController = require('../controllers/supportController');
const { validate } = require('../middleware/validate');

// GET /api/support  — current user's tickets
router.get('/', supportController.list);

// POST /api/support — create a new ticket
router.post('/', validate('supportTicket'), supportController.create);

module.exports = router;
