const router = require('express').Router();
const eventController = require('../controllers/eventController');

// GET /api/events — campus events
router.get('/', eventController.list);

module.exports = router;
