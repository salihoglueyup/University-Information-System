const Faculty = require('../models/Faculty');

exports.getAllFaculties = async () => {
    return await Faculty.find().lean();
};

exports.getFacultyById = async (id) => {
    return await Faculty.findOne({ id }).lean();
};
