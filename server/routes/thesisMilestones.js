const router = require('express').Router();
const thesisMilestoneController = require('../controllers/thesisMilestoneController');

// GET /api/thesis-milestones/:thesisId — the milestone plan for a thesis
router.get('/:thesisId', thesisMilestoneController.get);

module.exports = router;
