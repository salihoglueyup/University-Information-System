const BorrowedBook = require('../models/BorrowedBook');
const User = require('../models/User');

// Mock Catalog Database (Normally in a separate 'Book' MongoDB Collection)
const libraryCatalog = [
    { id: "B1", title: "Clean Code", author: "Robert C. Martin", cover: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 5 },
    { id: "B2", title: "Design Patterns", author: "Erich Gamma", cover: "https://m.media-amazon.com/images/I/51k+Ox-1EBL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 2 },
    { id: "B3", title: "Introduction to Algorithms", author: "Thomas H. Cormen", cover: "https://m.media-amazon.com/images/I/41T0iBxY8FL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 0 },
    { id: "B4", title: "Grokking Algorithms", author: "Aditya Bhargava", cover: "https://m.media-amazon.com/images/I/61uUPXbhMzL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 10 },
    { id: "B5", title: "The Pragmatic Programmer", author: "David Thomas", cover: "https://m.media-amazon.com/images/I/51A8l+FxNNL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg", available: 4 },
];

exports.getCatalog = async () => {
    return libraryCatalog;
};

exports.getBorrowedBooks = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    let books = await BorrowedBook.find({ studentNo: user.username });

    if (books.length === 0) {
        const dummyBooks = [
            { studentNo: user.username, title: "Clean Code", author: "Robert C. Martin", dueDate: "2026-02-25", status: "Okunuyor", cover: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg" },
            { studentNo: user.username, title: "Design Patterns", author: "Erich Gamma", dueDate: "2026-02-20", status: "Süresi Yaklaşıyor", cover: "https://m.media-amazon.com/images/I/51k+Ox-1EBL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg" },
            { studentNo: user.username, title: "Introduction to Algorithms", author: "Thomas H. Cormen", dueDate: "2026-03-01", status: "Okunuyor", cover: "https://m.media-amazon.com/images/I/41T0iBxY8FL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg" }
        ];
        await BorrowedBook.insertMany(dummyBooks);
        books = await BorrowedBook.find({ studentNo: user.username });
    }

    return books;
};

exports.borrowBook = async (userId, bookId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    const catalogBook = libraryCatalog.find(b => b.id === bookId);

    if (!catalogBook) {
        throw new Error('BOOK_NOT_FOUND');
    }

    if (catalogBook.available <= 0) {
        throw new Error('STOCK_EMPTY');
    }

    // Calculate due date (14 days from now)
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 14);
    const formattedDueDate = dueDateObj.toISOString().split('T')[0];

    const newBorrowedBook = new BorrowedBook({
        studentNo: user.username,
        title: catalogBook.title,
        author: catalogBook.author,
        cover: catalogBook.cover,
        dueDate: formattedDueDate,
        status: "Okunuyor"
    });

    return await newBorrowedBook.save();
};
