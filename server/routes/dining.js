const router = require('express').Router();
const diningController = require('../controllers/diningController');

// GET /api/dining-menu — weekly cafeteria menu
router.get('/', diningController.list);

module.exports = router;
