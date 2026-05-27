const cron = require('node-cron');
const Assignment = require('../models/Assignment');
const BorrowedBook = require('../models/BorrowedBook');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const logger = require('../utils/logger');

logger.info('⏳ Cron Jobs Initialized...');

// 1. Her Gece Yarısı Çalışan Assignment Gecikme Kontrolü
cron.schedule('0 0 * * *', async () => {
    logger.info('⏰ Running Assignment Due-Date Check Job');
    try {
        const now = new Date();
        const result = await Assignment.updateMany(
            { status: { $nin: ['Tamamlandı', 'Gecikti'] }, dueDate: { $lt: now } },
            { $set: { status: 'Gecikti' } }
        );
        logger.info(`✅ Job Finished. Marked ${result.modifiedCount} assignments as Gecikti.`);
    } catch (error) {
        logger.error('❌ Error in Assignment Job:', error);
    }
});

// 2. Kütüphane Teslim Tarihi Gelenler İçin Uyarı
cron.schedule('0 8 * * *', async () => {  // Her sabah saat 8'de
    logger.info('⏰ Running Library Due-Date Alert Job');
    try {
        const now = new Date();
        const soon = new Date();
        soon.setDate(now.getDate() + 3);

        const books = await BorrowedBook.find({
            dueDate: { $lte: soon },
            status: { $ne: 'Teslim Edildi' }
        });

        // Batch fetch all relevant students in one query
        const studentNos = [...new Set(books.map(b => b.studentNo))];
        const students = await User.find({ username: { $in: studentNos } });
        const studentMap = new Map(students.map(s => [s.username, s]));

        for (const book of books) {
            const student = studentMap.get(book.studentNo);

            if (student && student.email) {
                const message = `Sayın ${student.fullName},\n\nKütüphanemizden ödünç aldığınız "${book.title}" adlı kitabın teslim tarihi ${book.dueDate} olarak yaklaşmaktadır. Lütfen gecikme cezası almamak için süresi dolmadan teslim ediniz veya süresini uzatınız.\n\nBilgilerinize,\nUBIS Kütüphane`;

                try {
                    await sendEmail({
                        email: student.email,
                        subject: 'Kütüphane Kitap Teslim Uyarısı',
                        message
                    });
                    logger.info(`📧 Email sent to ${student.email} for book ${book.title}`);
                } catch (_emailErr) {
                    logger.warn(`⚠️ Email failed to send to ${student.email}. Invalid credentials?`);
                }
            }

            // Collect books to update status in bulk
            if (book.status !== 'Süresi Yaklaşıyor' && book.status !== 'Gecikti') {
                book._needsStatusUpdate = true;
            }
        }

        // Bulk update all books that need status change
        const bulkOps = books
            .filter(b => b._needsStatusUpdate)
            .map(b => ({
                updateOne: {
                    filter: { _id: b._id },
                    update: { $set: { status: 'Süresi Yaklaşıyor' } }
                }
            }));
        if (bulkOps.length > 0) {
            await BorrowedBook.bulkWrite(bulkOps);
        }
    } catch (error) {
        logger.error('❌ Error in Library Job:', error);
    }
});
