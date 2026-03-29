const router = require('express').Router();
const studentController = require('../controllers/studentController');
const { restrictTo, verifyOwnerOrStaff } = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cache');

// GET ALL STUDENTS (With optional filtering)
// Only staff can view ALL students
router.get('/', restrictTo('admin', 'academic'), studentController.getAll);

// GET SINGLE STUDENT
// Only owner or staff can view specific student profile
router.get('/:id', verifyOwnerOrStaff, studentController.getById);

// GET COMPREHENSIVE STUDENT 360 DATA
// Only owner or staff can view comprehensive profile
router.get('/:id/360', verifyOwnerOrStaff, cacheMiddleware, studentController.get360);

module.exports = router;
