const gradeService = require('../services/gradeService');

class GradeController {
    async getByUser(req, res, next) {
        try {
            const role = req.user?.role;
            // Admin/academic can query any user; students can only see their own
            let userId;
            if (role === 'admin' || role === 'academic') {
                userId = req.query.userId || req.user.id;
            } else {
                userId = req.user.id;
            }
            const grades = await gradeService.getGradesByUserId(userId);
            res.status(200).json(grades);
        } catch (err) {
            next(err);
        }
    }

    async save(req, res, next) {
        try {
            const userId = req.body.userId || 'all';
            const savedData = await gradeService.saveOrUpdateGrades(userId, req.body);
            res.status(201).json(savedData);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new GradeController();
