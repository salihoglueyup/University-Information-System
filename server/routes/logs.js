const router = require('express').Router();
const logController = require('../controllers/logController');
const { restrictTo, verifyToken } = require('../middleware/auth');

// GET ALL LOGS
router.get('/', restrictTo('admin'), logController.getAllLogs);

// CREATE A LOG
router.post('/', verifyToken, logController.createLog);

module.exports = router;
