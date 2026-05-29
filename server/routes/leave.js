const router = require('express').Router();
const leaveController = require('../controllers/leaveController');
const { validate } = require('../middleware/validate');

// GET /api/leave  — current user's leave/assignment requests
router.get('/', leaveController.list);

// POST /api/leave — create a new request
router.post('/', validate('leaveRequest'), leaveController.create);

module.exports = router;
