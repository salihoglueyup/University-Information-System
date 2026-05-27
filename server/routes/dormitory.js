const express = require('express');
const router = express.Router();
const dormitoryController = require('../controllers/dormitoryController');
const { verifyToken } = require('../middleware/auth');

// GET /api/dormitory
router.get('/', verifyToken, dormitoryController.getDormitoryInfo);

module.exports = router;
