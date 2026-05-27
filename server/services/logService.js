const Log = require('../models/Log');

exports.getAllLogs = async () => {
    return await Log.find().sort({ createdAt: -1 }).limit(500).lean();
};

exports.createLog = async (logData) => {
    const newLog = new Log(logData);
    return await newLog.save();
};
