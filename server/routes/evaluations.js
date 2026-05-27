const router = require('express').Router();
const evaluationController = require('../controllers/evaluationController');
const { restrictTo, verifyToken } = require('../middleware/auth');

// GET /api/evaluations/me
router.get('/me', verifyToken, evaluationController.getStudentEvaluations);

// GET /api/evaluations/academic
router.get('/academic', verifyToken, evaluationController.getAcademicEvaluations);

// GET /api/evaluations/all
router.get('/all', restrictTo('admin'), evaluationController.getAllEvaluations);

// POST /api/evaluations
router.post('/', verifyToken, evaluationController.createEvaluation);

module.exports = router;
