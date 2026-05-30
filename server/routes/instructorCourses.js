const router = require('express').Router();
const instructorCourseController = require('../controllers/instructorCourseController');

// GET /api/instructor-courses — the courses the user teaches this term
router.get('/', instructorCourseController.list);

module.exports = router;
