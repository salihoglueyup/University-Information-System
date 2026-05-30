const router = require('express').Router();
const transcriptController = require('../controllers/transcriptController');

// GET /api/transcript — the user's official transcript rows
router.get('/', transcriptController.list);

module.exports = router;
