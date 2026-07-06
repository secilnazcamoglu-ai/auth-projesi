const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Kitap Kulübü" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
      text: "Kitap Kulübü şifre yenileme bağlantısı gönderildi.",
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Email gönderme hatası:", error);
    throw new Error("Email gönderilemedi.");
  }
};

module.exports = sendEmail;