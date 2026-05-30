const catalogCourseService = require('../services/catalogCourseService');

class CatalogCourseController {
    async list(req, res, next) {
        try {
            res.status(200).json(await catalogCourseService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new CatalogCourseController();
