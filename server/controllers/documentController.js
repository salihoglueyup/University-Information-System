const documentService = require('../services/documentService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getUserDocuments = catchAsync(async (req, res) => {
    const documents = await documentService.getUserDocuments(req.user.id);
    res.status(200).json(documents);
});

exports.uploadDocument = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Dosya bulunamadı', 400));
    }
    const savedDoc = await documentService.uploadDocument(req.user.id, req.body, req.file);
    res.status(201).json(savedDoc);
});
