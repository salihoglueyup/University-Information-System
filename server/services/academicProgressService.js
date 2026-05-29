const AcademicProgress = require('../models/AcademicProgress');

const DEFAULT = {
    program: '', stage: '', advisor: '',
    completedCredits: 0, requiredCredits: 0, gpa: 0,
    milestones: [], publications: []
};

exports.getProgress = async (username) => {
    const doc = await AcademicProgress.findOne({ userId: username }).lean();
    return doc ? { ...DEFAULT, ...doc } : DEFAULT;
};

exports.addPublication = async (username, data) => {
    const { title, journal, status } = data;
    const publication = {
        title,
        journal: journal || '',
        date: new Date().toISOString().slice(0, 10),
        status: status || 'Hazırlanıyor'
    };
    const updated = await AcademicProgress.findOneAndUpdate(
        { userId: username },
        {
            $push: { publications: publication },
            // publications is created by $push; don't set it here (avoids conflict)
            $setOnInsert: { program: '', stage: '', advisor: '', completedCredits: 0, requiredCredits: 0, gpa: 0, milestones: [] }
        },
        { new: true, upsert: true }
    );
    return updated;
};
