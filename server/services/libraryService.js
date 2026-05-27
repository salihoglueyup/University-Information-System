const BorrowedBook = require('../models/BorrowedBook');
const Book = require('../models/Book');
const User = require('../models/User');

const DEFAULT_CATALOG = [
    { bookId: "B1", title: "Clean Code", author: "Robert C. Martin", cover: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 5 },
    { bookId: "B2", title: "Design Patterns", author: "Erich Gamma", cover: "https://m.media-amazon.com/images/I/51k+Ox-1EBL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 2 },
    { bookId: "B3", title: "Introduction to Algorithms", author: "Thomas H. Cormen", cover: "https://m.media-amazon.com/images/I/41T0iBxY8FL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 0 },
    { bookId: "B4", title: "Grokking Algorithms", author: "Aditya Bhargava", cover: "https://m.media-amazon.com/images/I/61uUPXbhMzL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 10 },
    { bookId: "B5", title: "The Pragmatic Programmer", author: "David Thomas", cover: "https://m.media-amazon.com/images/I/51A8l+FxNNL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 4 },
];

let catalogSeeded = false;
const ensureCatalogSeeded = async () => {
    if (catalogSeeded) return;
    const count = await Book.countDocuments();
    if (count === 0) {
        await Book.insertMany(DEFAULT_CATALOG);
    }
    catalogSeeded = true;
};

exports.getCatalog = async () => {
    await ensureCatalogSeeded();
    return await Book.find({}).lean();
};

exports.getBorrowedBooks = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    const books = await BorrowedBook.find({ studentNo: user.username }).lean();
    return books;
};

exports.borrowBook = async (userId, bookId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    const catalogBook = await Book.findOne({ bookId });

    if (!catalogBook) {
        throw new Error('BOOK_NOT_FOUND');
    }

    if (catalogBook.available <= 0) {
        throw new Error('STOCK_EMPTY');
    }

    catalogBook.available--;
    await catalogBook.save();

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const newBorrowedBook = new BorrowedBook({
        studentNo: user.username,
        title: catalogBook.title,
        author: catalogBook.author,
        cover: catalogBook.cover,
        dueDate,
        status: "Okunuyor"
    });

    return await newBorrowedBook.save();
};
