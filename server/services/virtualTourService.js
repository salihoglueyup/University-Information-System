const VirtualTourSpot = require('../models/VirtualTourSpot');

exports.list = async () => {
    return VirtualTourSpot.find().sort({ order: 1, title: 1 }).limit(50).lean();
};
