const Document = require('../models/Document');

exports.getUserDocuments = async (userId) => {
    return await Document.find({ userId }).sort({ createdAt: -1 });
};

exports.uploadDocument = async (userId, bodyData, fileData) => {
    const newDoc = new Document({
        userId,
        title: bodyData.title || fileData.originalname,
        filename: fileData.originalname,
        fileUrl: `/uploads/${fileData.filename}`,
        type: bodyData.type || "Diğer",
        status: "Bekliyor",
        size: (fileData.size / 1024).toFixed(1) + " KB"
    });

    return await newDoc.save();
};
