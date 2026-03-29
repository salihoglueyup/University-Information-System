const router = require('express').Router();
const logController = require('../controllers/logController');

// GET ALL LOGS
router.get('/', logController.getAllLogs);

// CREATE A LOG
router.post('/', logController.createLog);

module.exports = router;
