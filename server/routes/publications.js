const router = require('express').Router();
const publicationController = require('../controllers/publicationController');

// GET /api/publications — the user's academic publications
router.get('/', publicationController.list);

module.exports = router;
