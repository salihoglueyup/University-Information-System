const Document = require('../models/Document');

exports.getUserDocuments = async (userId) => {
    const documents = await Document.find({ userId }).sort({ createdAt: -1 });

    if (documents.length === 0) {
        const dummyDocs = [
            { userId, title: "Ara Sınav Mazeret Dilekçesi", filename: "mazeret.pdf", fileUrl: "#", type: "Dilekçe", status: "Bekliyor", size: "245 KB" },
            { userId, title: "Güz Dönemi Transkript", filename: "transkript_guz.pdf", fileUrl: "#", type: "Transkript Talebi", status: "Onaylandı", size: "1200 KB" },
            { userId, title: "Burs Başvuru Formu", filename: "burs_form.pdf", fileUrl: "#", type: "Diğer", status: "Reddedildi", size: "850 KB" }
        ];
        await Document.insertMany(dummyDocs);
        return await Document.find({ userId }).sort({ createdAt: -1 });
    }

    return documents;
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
