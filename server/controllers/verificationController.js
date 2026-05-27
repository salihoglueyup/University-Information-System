const verificationService = require('../services/verificationService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { verificationRequestsTotal, verificationLookupDurationMs } = require('../utils/metrics');

exports.createVerification = catchAsync(async (req, res) => {
    const endTimer = verificationLookupDurationMs.startTimer({ operation: 'create' });
    const savedDoc = await verificationService.createVerification(req.body);
    verificationRequestsTotal.inc({ operation: 'create', result: 'success' });
    endTimer();
    res.status(201).json(savedDoc);
});

exports.getVerificationByHash = catchAsync(async (req, res, next) => {
    const endTimer = verificationLookupDurationMs.startTimer({ operation: 'lookup' });
    const doc = await verificationService.getVerificationByHash(req.params.hash);
    if (!doc) {
        verificationRequestsTotal.inc({ operation: 'lookup', result: 'not_found' });
        endTimer();
        return next(new AppError('Belge sistemde bulunamadı veya geçersiz.', 404));
    }
    verificationRequestsTotal.inc({ operation: 'lookup', result: 'success' });
    endTimer();
    res.status(200).json(doc);
});
