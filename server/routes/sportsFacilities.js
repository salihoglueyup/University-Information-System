const router = require('express').Router();
const sportsFacilityController = require('../controllers/sportsFacilityController');

// GET /api/sports-facilities — campus sports facilities with occupancy
router.get('/', sportsFacilityController.list);

module.exports = router;
