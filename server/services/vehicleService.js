const Vehicle = require('../models/Vehicle');

// The user's most recent vehicle/sticker (or null).
exports.getCurrent = async (username) => {
    return Vehicle.findOne({ userId: username }).sort({ createdAt: -1 }).lean();
};

// Body is validated by the `vehicleApply` Zod schema at the route layer.
exports.apply = async (username, data) => {
    const { plate, model, owner, color } = data;
    return Vehicle.create({
        userId: username,
        plate: String(plate).trim().toUpperCase(),
        model,
        owner,
        color,
        status: 'Beklemede'
    });
};
