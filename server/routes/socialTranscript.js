const router = require('express').Router();
const socialTranscriptController = require('../controllers/socialTranscriptController');

// GET /api/social-transcript — the user's co-curricular (social) transcript
router.get('/', socialTranscriptController.get);

module.exports = router;
