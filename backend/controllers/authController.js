// User modelini projeye dahil ediyoruz.
// Birazdan kullanıcı eklemek ve sorgulamak için kullanacağız.
const User = require("../models/User");

// Register (Kayıt Ol) fonksiyonu
const register = async (req, res) => {

    // Şimdilik sadece test ediyoruz.
    // Route gerçekten buraya geliyor mu görmek istiyoruz.
    res.status(200).json({
        success: true,
        message: "Register API çalışıyor."
    });

};

// Bu dosyadaki register fonksiyonunu dışarı açıyoruz.
// Böylece authRoutes.js bu fonksiyonu kullanabilecek.
module.exports = {
    register,
};