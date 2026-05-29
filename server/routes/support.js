const router = require('express').Router();
const supportController = require('../controllers/supportController');

// GET /api/support  — current user's tickets
router.get('/', supportController.list);

// POST /api/support — create a new ticket
router.post('/', supportController.create);

module.exports = router;
