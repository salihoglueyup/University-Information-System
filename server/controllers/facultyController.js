const facultyService = require('../services/facultyService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllFaculties = catchAsync(async (req, res) => {
    const faculties = await facultyService.getAllFaculties();
    res.status(200).json(faculties);
});

exports.getFacultyById = catchAsync(async (req, res, next) => {
    const faculty = await facultyService.getFacultyById(req.params.id);
    if (!faculty) {
        return next(new AppError('Faculty not found', 404));
    }
    res.status(200).json(faculty);
});
