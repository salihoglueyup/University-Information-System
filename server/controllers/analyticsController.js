const analyticsService = require('../services/analyticsService');
const catchAsync = require('../utils/catchAsync');

exports.getGeneralAnalytics = catchAsync(async (req, res) => {
    const data = await analyticsService.getGeneralAnalytics();
    res.status(200).json(data);
});

exports.getFacultyGpaDistribution = catchAsync(async (req, res) => {
    const data = await analyticsService.getFacultyGpaDistribution();
    res.status(200).json(data);
});
