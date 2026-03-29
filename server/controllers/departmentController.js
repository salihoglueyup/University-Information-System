const departmentService = require('../services/departmentService');
const catchAsync = require('../utils/catchAsync');

exports.getDepartments = catchAsync(async (req, res) => {
    const query = req.query.facultyId ? { facultyId: req.query.facultyId } : {};
    const departments = await departmentService.getDepartments(query);
    res.status(200).json(departments);
});
