const cron = require('node-cron');
const Assignment = require('../models/Assignment');
const BorrowedBook = require('../models/BorrowedBook');
const User = require('../models/User');
const sendEmail = require('../utils/email');

console.log('⏳ Cron Jobs Initialized...');

// 1. Her Gece Yarısı Çalışan Assignment Gecikme Kontrolü
cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running Assignment Due-Date Check Job');
    try {
        const now = new Date();
        const assignments = await Assignment.find({ status: { $nin: ['Tamamlandı', 'Gecikti'] } });

        let delayedCount = 0;
        for (const assign of assignments) {
            const dueDate = new Date(assign.dueDate);
            if (now > dueDate) {
                assign.status = 'Gecikti';
                await assign.save();
                delayedCount++;
            }
        }
        console.log(`✅ Job Finished. Marked ${delayedCount} assignments as Gecikti.`);
    } catch (error) {
        console.error('❌ Error in Assignment Job:', error);
    }
});

// 2. Kütüphane Teslim Tarihi Gelenler İçin Uyarı
cron.schedule('0 8 * * *', async () => {  // Her sabah saat 8'de
    console.log('⏰ Running Library Due-Date Alert Job');
    try {
        const now = new Date();
        const soon = new Date();
        soon.setDate(now.getDate() + 3); // 3 gün kalmış kitaplar

        // String olarak 'YYYY-MM-DD' formatında karşılaştırmak için date'leri prepare et
        const soonStr = soon.toISOString().split('T')[0];

        const books = await BorrowedBook.find({
            dueDate: { $lte: soonStr },
            status: { $ne: 'Teslim Edildi' }
        });

        for (const book of books) {
            // Find Student's Email
            const student = await User.findOne({ username: book.studentNo });

            if (student && student.email) {
                const message = `Sayın ${student.name},\n\nKütüphanemizden ödünç aldığınız "${book.title}" adlı kitabın teslim tarihi ${book.dueDate} olarak yaklaşmaktadır. Lütfen gecikme cezası almamak için süresi dolmadan teslim ediniz veya süresini uzatınız.\n\nBilgilerinize,\nUBIS Kütüphane`;

                try {
                    await sendEmail({
                        email: student.email,
                        subject: 'Kütüphane Kitap Teslim Uyarısı',
                        message
                    });
                    console.log(`📧 Email sent to ${student.email} for book ${book.title}`);
                } catch (_emailErr) {
                    console.log(`⚠️ Email failed to send to ${student.email}. Invalid credentials?`);
                }
            }

            // Ayrıca statüsünü 'Süresi Yaklaşıyor' olarak DB'de güncelle
            if (book.status !== 'Süresi Yaklaşıyor' && book.status !== 'Gecikti') {
                book.status = 'Süresi Yaklaşıyor';
                await book.save();
            }
        }
    } catch (error) {
        console.error('❌ Error in Library Job:', error);
    }
});
