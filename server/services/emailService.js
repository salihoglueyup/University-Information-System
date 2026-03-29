const Email = require('../models/Email');
const User = require('../models/User');

exports.getUserEmails = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    let emails = await Email.find({ receiver: user.username }).sort({ createdAt: -1 });

    if (emails.length === 0) {
        const dummyEmails = [
            { sender: "Sistem Yöneticisi", receiver: user.username, subject: "Sisteme Hoşgeldiniz", preview: "UBIS sistemine başarıyla giriş yaptınız. Lütfen parolanızı güncellemeyi unutmayın.", read: false, folder: 'Gelen Kutusu', date: "Bugün" },
            { sender: "Öğrenci İşleri", receiver: user.username, subject: "Bahar Dönemi Kayıtları", preview: "Kayıt yenileme işlemleri yarın başlayacaktır.", read: true, folder: 'Gelen Kutusu', date: "Dün" }
        ];
        await Email.insertMany(dummyEmails);
        emails = await Email.find({ receiver: user.username }).sort({ createdAt: -1 });
    }

    return { currentUser: user.username, emails };
};

exports.sendEmail = async (senderId, emailData) => {
    const senderUser = await User.findById(senderId);
    if (!senderUser) return null;

    const newEmail = new Email({
        sender: senderUser.username,
        receiver: emailData.receiver,
        subject: emailData.subject,
        preview: emailData.preview,
        read: false,
        folder: 'Gelen Kutusu',
        date: "Şimdi"
    });

    return await newEmail.save();
};
