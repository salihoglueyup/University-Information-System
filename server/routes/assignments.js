const router = require('express').Router();
const assignmentController = require('../controllers/assignmentController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET ALL ASSIGNMENTS
router.get('/', assignmentController.getAll);

// CREATE ASSIGNMENT
router.post('/', assignmentController.create);

// SUBMIT ASSIGNMENT (Student uploads file)
router.post('/:id/submit', verifyToken, upload.single('file'), assignmentController.submit);

module.exports = router;
