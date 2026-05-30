const router = require('express').Router();
const infoResourceController = require('../controllers/infoResourceController');

// GET /api/info-resources — library/info-center electronic resources
router.get('/', infoResourceController.list);

module.exports = router;
