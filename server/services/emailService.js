const Email = require('../models/Email');
const User = require('../models/User');

exports.getUserEmails = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    const emails = await Email.find({ receiver: user.username }).sort({ createdAt: -1 }).lean();

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
        date: new Date()
    });

    return await newEmail.save();
};
