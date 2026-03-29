const academicCalendarService = require('../services/academicCalendarService');
const catchAsync = require('../utils/catchAsync');

exports.getAllEvents = catchAsync(async (req, res) => {
    const events = await academicCalendarService.getAllEvents();
    res.status(200).json(events);
});

exports.createEvent = catchAsync(async (req, res) => {
    const event = await academicCalendarService.createEvent(req.body);
    res.status(201).json(event);
});
