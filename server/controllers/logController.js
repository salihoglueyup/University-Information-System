const logService = require('../services/logService');
const catchAsync = require('../utils/catchAsync');

exports.getAllLogs = catchAsync(async (req, res) => {
    const logs = await logService.getAllLogs();
    res.status(200).json(logs);
});

exports.createLog = catchAsync(async (req, res) => {
    const savedLog = await logService.createLog(req.body);
    res.status(201).json(savedLog);
});
