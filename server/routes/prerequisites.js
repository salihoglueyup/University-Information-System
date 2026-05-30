const router = require('express').Router();
const prerequisiteController = require('../controllers/prerequisiteController');

// GET /api/prerequisites — course prerequisite catalog
router.get('/', prerequisiteController.list);

module.exports = router;
