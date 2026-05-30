const router = require('express').Router();
const thesisTaskController = require('../controllers/thesisTaskController');
const { validate } = require('../middleware/validate');

// GET /api/thesis-tasks/board — the advisor's kanban board (columns + items)
router.get('/board', thesisTaskController.board);

// PATCH /api/thesis-tasks/:id — move a card to another column
router.patch('/:id', validate('thesisTaskMove'), thesisTaskController.move);

// PATCH /api/thesis-tasks/:id/reorder — change a card's order within its column
router.patch('/:id/reorder', validate('thesisTaskReorder'), thesisTaskController.reorder);

module.exports = router;
