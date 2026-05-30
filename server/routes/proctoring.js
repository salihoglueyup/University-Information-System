const router = require('express').Router();
const proctoringController = require('../controllers/proctoringController');

// GET /api/proctoring — the user's proctoring duties
router.get('/', proctoringController.list);

// PATCH /api/proctoring/:id/confirm — confirm an assigned duty
router.patch('/:id/confirm', proctoringController.confirm);

module.exports = router;
