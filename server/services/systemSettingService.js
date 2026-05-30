const SystemSetting = require('../models/SystemSetting');

// Returns the singleton settings document, creating it with defaults if absent.
exports.get = async () => {
    let doc = await SystemSetting.findOne().lean();
    if (!doc) doc = (await SystemSetting.create({})).toObject();
    return doc;
};

exports.update = async (data) => {
    const allowed = ['activeSemester', 'registrationOpen', 'allowGradeEntry', 'maintenanceMode'];
    const sanitized = {};
    for (const key of allowed) {
        if (data[key] !== undefined) sanitized[key] = data[key];
    }
    return SystemSetting.findOneAndUpdate({}, { $set: sanitized }, { new: true, upsert: true });
};
