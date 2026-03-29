const Department = require('../models/Department');

exports.getDepartments = async (query = {}) => {
    return await Department.find(query);
};
