const router = require('express').Router();
const departmentCourseController = require('../controllers/departmentCourseController');

// GET /api/department-courses — the department curriculum catalog
router.get('/', departmentCourseController.list);

module.exports = router;
