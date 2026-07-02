// Express'i dahil ediyoruz.
// Route oluşturmak için kullanacağız.
const express = require("express");

// Express Router yapısını oluşturuyoruz.
// Bu sayede auth ile ilgili yolları burada toplayacağız.
const router = express.Router();

// Controller içinden register ve login fonksiyonlarını alıyoruz.
// Register: kayıt olma işlemi
// Login: giriş yapma işlemi
const { 
    register, 
    login,
    getProfile,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Kullanıcı kayıt route'u
// POST http://localhost:5000/api/auth/register
router.post("/register", register);

// Kullanıcı giriş route'u
router.post("/login", login);

// Kullanıcı profili route'u
// Bu route korumalıdır, yani token olmadan çalışmaz.
// GET http://localhost:5000/api/auth/profile
router.get("/profile", authMiddleware, getProfile);

// POST http://localhost:5000/api/auth/login
router.post("/login", login);

// Şifre sıfırlama işlemleri için iki route oluşturuyoruz
router.post("/forgot-password", forgotPassword);

// Şifre sıfırlama tokeni ile şifreyi güncelleme route'u
router.put("/reset-password/:token", resetPassword);

// Bu router'ı dışarı aktarıyoruz.
// index.js içinde app.use("/api/auth", authRoutes) ile kullanılıyor.
module.exports = router;
