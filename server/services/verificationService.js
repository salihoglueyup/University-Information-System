const DocumentVerification = require('../models/DocumentVerification');
const crypto = require('crypto');

exports.createVerification = async (data) => {
    const hash = crypto.randomBytes(16).toString('hex');
    const newDoc = new DocumentVerification({
        hash,
        studentName: data.studentName,
        studentId: data.studentId,
        documentType: data.documentType
    });
    return await newDoc.save();
};

exports.getVerificationByHash = async (hash) => {
    return await DocumentVerification.findOne({ hash });
};
