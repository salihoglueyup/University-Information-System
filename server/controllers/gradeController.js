const gradeService = require('../services/gradeService');

class GradeController {
    async getByUser(req, res, next) {
        try {
            const userId = req.query.userId || 'all';
            const grades = await gradeService.getGradesByUserId(userId);
            res.status(200).json(grades);
        } catch (err) {
            next(err);
        }
    }

    async save(req, res, next) {
        try {
            const userId = req.body.userId || 'all';
            const io = req.app.get('io');
            const savedData = await gradeService.saveOrUpdateGrades(userId, req.body, io);
            res.status(201).json(savedData);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new GradeController();
