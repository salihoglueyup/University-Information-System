const departmentCourseService = require('../services/departmentCourseService');

class DepartmentCourseController {
    async list(req, res, next) {
        try {
            res.status(200).json(await departmentCourseService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new DepartmentCourseController();
