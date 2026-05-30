const router = require('express').Router();
const questionController = require('../controllers/questionController');
const { validate } = require('../middleware/validate');

// GET /api/questions — the user's question bank
router.get('/', questionController.list);

// POST /api/questions — add a question
router.post('/', validate('question'), questionController.create);

// DELETE /api/questions/:id — remove a question
router.delete('/:id', questionController.remove);

module.exports = router;
