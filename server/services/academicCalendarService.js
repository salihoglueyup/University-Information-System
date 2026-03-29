const AcademicCalendar = require('../models/AcademicCalendar');

exports.getAllEvents = async () => {
    return await AcademicCalendar.find();
};

exports.createEvent = async (eventData) => {
    const newEvent = new AcademicCalendar(eventData);
    return await newEvent.save();
};
