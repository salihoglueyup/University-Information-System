const router = require('express').Router();
const labController = require('../controllers/labController');

// GET /api/labs — lab sections the user is responsible for
router.get('/', labController.list);

module.exports = router;
