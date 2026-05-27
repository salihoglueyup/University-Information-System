const Evaluation = require('../models/Evaluation');

exports.getStudentEvaluations = async (userId) => {
    return await Evaluation.find({ student: userId })
        .populate('course', 'code title')
        .sort({ createdAt: -1 })
        .lean();
};

exports.getAcademicEvaluations = async (academicName) => {
    return await Evaluation.find({ academicName })
        .populate('course', 'code title')
        .sort({ createdAt: -1 })
        .lean();
};

exports.getAllEvaluations = async () => {
    return await Evaluation.find()
        .populate('course', 'code title')
        .sort({ createdAt: -1 })
        .lean();
};

exports.createEvaluation = async (evaluationData, userId) => {
    const newEvaluation = new Evaluation({
        ...evaluationData,
        student: userId
    });
    return await newEvaluation.save();
};
