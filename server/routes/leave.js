const router = require('express').Router();
const leaveController = require('../controllers/leaveController');

// GET /api/leave  — current user's leave/assignment requests
router.get('/', leaveController.list);

// POST /api/leave — create a new request
router.post('/', leaveController.create);

module.exports = router;
