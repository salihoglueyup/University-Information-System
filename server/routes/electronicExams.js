const router = require('express').Router();
const electronicExamController = require('../controllers/electronicExamController');

// GET /api/electronic-exams — the user's e-exam appointments
router.get('/', electronicExamController.list);

module.exports = router;
