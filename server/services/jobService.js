const JobPosting = require('../models/JobPosting');

exports.list = async () => {
    return JobPosting.find().sort({ createdAt: -1 }).limit(100).lean();
};
