const router = require('express').Router();
const systemSettingController = require('../controllers/systemSettingController');
const { validate } = require('../middleware/validate');

// GET /api/system-settings — university-wide configuration
router.get('/', systemSettingController.get);

// PATCH /api/system-settings — update configuration
router.patch('/', validate('systemSettings'), systemSettingController.update);

module.exports = router;
