const router = require('express').Router();
const catalogCourseController = require('../controllers/catalogCourseController');

// GET /api/course-catalog — institution-wide course catalog
router.get('/', catalogCourseController.list);

module.exports = router;
