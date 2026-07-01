// Express'in Router özelliğini projeye dahil ediyoruz.
const express = require("express");

// Yeni bir router oluşturuyoruz.
const router = express.Router();

// Controller dosyasındaki register fonksiyonunu içe aktarıyoruz.
const { register } = require("../controllers/authController");

// POST isteği geldiğinde register fonksiyonu çalışacak.
router.post("/register", register);

// Bu router'ı diğer dosyalarda kullanabilmek için dışa aktarıyoruz.
module.exports = router;
