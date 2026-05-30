const router = require('express').Router();
const virtualTourController = require('../controllers/virtualTourController');

// GET /api/virtual-tour — 360° campus virtual-tour spots
router.get('/', virtualTourController.list);

module.exports = router;
