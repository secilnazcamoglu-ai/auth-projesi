// Email göndermek için nodemailer paketini kullanıyoruz
const nodemailer = require("nodemailer");

// Email gönderme fonksiyonu
const sendEmail = async (options) => {
  // Gmail SMTP ayarlarını oluşturuyoruz
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Gönderilecek email bilgileri
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Emaili gönderiyoruz
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;