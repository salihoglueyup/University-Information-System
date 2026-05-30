const router = require('express').Router();
const onlineCourseController = require('../controllers/onlineCourseController');

// GET /api/online-courses — the user's online courses
router.get('/', onlineCourseController.list);

module.exports = router;
