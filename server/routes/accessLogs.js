const router = require('express').Router();
const accessLogController = require('../controllers/accessLogController');

// GET /api/access-logs — the user's card-access events
router.get('/', accessLogController.list);

module.exports = router;
