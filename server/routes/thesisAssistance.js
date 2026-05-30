const router = require('express').Router();
const thesisAssistanceController = require('../controllers/thesisAssistanceController');

// GET /api/thesis-assistance — the advisor's supervised thesis records
router.get('/', thesisAssistanceController.list);

module.exports = router;
