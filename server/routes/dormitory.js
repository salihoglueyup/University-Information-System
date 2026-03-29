const express = require('express');
const router = express.Router();
const dormitoryController = require('../controllers/dormitoryController');

// GET /api/dormitory
router.get('/', dormitoryController.getDormitoryInfo);

module.exports = router;
