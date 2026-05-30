const router = require('express').Router();
const deptTaskController = require('../controllers/deptTaskController');
const { validate } = require('../middleware/validate');

// GET /api/dept-tasks — the user's departmental tasks
router.get('/', deptTaskController.list);

// PATCH /api/dept-tasks/:id/status — update a task's status
router.patch('/:id/status', validate('deptTaskStatus'), deptTaskController.setStatus);

module.exports = router;
