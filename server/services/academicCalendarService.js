const AcademicCalendar = require('../models/AcademicCalendar');

exports.getAllEvents = async () => {
    return await AcademicCalendar.find().sort({ month: 1 }).lean();
};

exports.createEvent = async (eventData) => {
    const newEvent = new AcademicCalendar(eventData);
    return await newEvent.save();
};
