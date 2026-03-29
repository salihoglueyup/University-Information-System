const router = require('express').Router();
const evaluationController = require('../controllers/evaluationController');

// GET /api/evaluations/me
router.get('/me', evaluationController.getStudentEvaluations);

// GET /api/evaluations/academic
router.get('/academic', evaluationController.getAcademicEvaluations);

// GET /api/evaluations/all
router.get('/all', evaluationController.getAllEvaluations);

// POST /api/evaluations
router.post('/', evaluationController.createEvaluation);

module.exports = router;
