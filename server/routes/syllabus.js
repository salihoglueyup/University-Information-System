const router = require('express').Router();
const syllabusController = require('../controllers/syllabusController');

// GET /api/syllabus?courseId=... — the weekly syllabus for a course
router.get('/', syllabusController.list);

module.exports = router;
