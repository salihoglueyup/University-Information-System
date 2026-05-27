const libraryService = require('../services/libraryService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getCatalog = catchAsync(async (req, res) => {
    const catalog = await libraryService.getCatalog();
    res.status(200).json(catalog);
});

exports.getBorrowedBooks = catchAsync(async (req, res, next) => {
    const books = await libraryService.getBorrowedBooks(req.user.id);
    if (!books) {
        return next(new AppError('Kullanıcı bulunamadı', 404));
    }
    res.status(200).json(books);
});

exports.borrowBook = async (req, res, next) => {
    try {
        const savedBook = await libraryService.borrowBook(req.user.id, req.body.bookId);
        res.status(201).json(savedBook);
    } catch (err) {
        if (err.message === 'USER_NOT_FOUND') return next(new AppError('Kullanıcı bulunamadı', 404));
        if (err.message === 'BOOK_NOT_FOUND') return next(new AppError('Kitap bulunamadı', 404));
        if (err.message === 'STOCK_EMPTY') return next(new AppError('Bu kitaptan stokta kalmamıştır.', 400));
        return next(new AppError('Kitap ödünç alınırken hata oluştu.', 500));
    }
};
