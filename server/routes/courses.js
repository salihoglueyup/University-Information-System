const router = require('express').Router();
const courseController = require('../controllers/courseController');
const { verifyToken, restrictTo } = require('../middleware/auth');

// GET ALL COURSES
router.get('/', courseController.getAll);

// CREATE COURSE
// Only admins/academics can create courses
router.post('/', verifyToken, restrictTo('admin', 'academic'), courseController.create);

module.exports = router;
