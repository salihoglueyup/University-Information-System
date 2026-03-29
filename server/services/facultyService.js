const Faculty = require('../models/Faculty');

exports.getAllFaculties = async () => {
    return await Faculty.find();
};

exports.getFacultyById = async (id) => {
    return await Faculty.findOne({ id });
};
