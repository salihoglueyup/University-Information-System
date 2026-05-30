const router = require('express').Router();
const thesisStudentController = require('../controllers/thesisStudentController');

// GET /api/thesis-students — the advisor's supervised thesis students
router.get('/', thesisStudentController.list);

module.exports = router;
