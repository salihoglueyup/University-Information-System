const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Kurumsal SMTP ayarları için .env'den çekilen bilgiler. 
    // Geliştirme ortamında Mailtrap gibi servisler kullanılabilir.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USERNAME || 'test_user',
            pass: process.env.EMAIL_PASSWORD || 'test_password'
        }
    });

    const mailOptions = {
        from: 'UBIS Kurumsal İletişim <noreply@ubis.edu.tr>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
