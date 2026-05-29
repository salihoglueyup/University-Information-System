const router = require('express').Router();
const vehicleController = require('../controllers/vehicleController');
const { validate } = require('../middleware/validate');

// GET /api/vehicle — the user's current vehicle/sticker
router.get('/', vehicleController.getCurrent);

// POST /api/vehicle — apply for a vehicle sticker (body validated by Zod)
router.post('/', validate('vehicleApply'), vehicleController.apply);

module.exports = router;
