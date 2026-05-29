const Internship = require('../models/Internship');
const InternshipOffer = require('../models/InternshipOffer');

const DEFAULT_STATUS = { mandatory: { completedDays: 0, totalDays: 30 }, documents: [], history: [] };

exports.getStatus = async (username) => {
    const doc = await Internship.findOne({ userId: username }).lean();
    if (!doc) return DEFAULT_STATUS;
    return {
        mandatory: doc.mandatory || DEFAULT_STATUS.mandatory,
        documents: doc.documents || [],
        history: doc.history || []
    };
};

exports.listOffers = async () => {
    return InternshipOffer.find().sort({ createdAt: -1 }).limit(50).lean();
};
