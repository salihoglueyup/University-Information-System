const evaluationService = require('../services/evaluationService');
const catchAsync = require('../utils/catchAsync');

exports.getStudentEvaluations = catchAsync(async (req, res) => {
    const evaluations = await evaluationService.getStudentEvaluations(req.user.id);
    res.status(200).json(evaluations);
});

exports.getAcademicEvaluations = catchAsync(async (req, res) => {
    const evaluations = await evaluationService.getAcademicEvaluations(req.user.name);
    res.status(200).json(evaluations);
});

exports.getAllEvaluations = catchAsync(async (req, res) => {
    const evaluations = await evaluationService.getAllEvaluations();
    res.status(200).json(evaluations);
});

exports.createEvaluation = catchAsync(async (req, res) => {
    const savedEvaluation = await evaluationService.createEvaluation(req.body, req.user.id);
    res.status(201).json(savedEvaluation);
});
