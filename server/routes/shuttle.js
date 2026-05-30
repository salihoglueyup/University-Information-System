const router = require('express').Router();
const shuttleController = require('../controllers/shuttleController');

// GET /api/shuttle — campus shuttle (ring) routes and times
router.get('/', shuttleController.list);

module.exports = router;
