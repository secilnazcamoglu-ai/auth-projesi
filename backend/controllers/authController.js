// User modelini projeye dahil ediyoruz.
// MongoDB'deki users koleksiyonu ile işlem yapmak için kullanacağız.
const User = require("../models/User");

// Şifreyi güvenli hale getirmek için bcryptjs kullanacağız.
// Kullanıcının şifresini düz metin olarak veritabanına kaydetmemeliyiz.
const bcrypt = require("bcryptjs");

// JWT paketi token oluşturmak için kullanılır.
// Login başarılı olunca kullanıcıya token vereceğiz.
const jwt = require("jsonwebtoken");

// Register yani kayıt olma fonksiyonu
const register = async (req, res) => {
  try {
    // Postman'den gelen body içindeki bilgileri alıyoruz.
    // Body'den firstName, lastName, email ve password değerlerini çıkarıyoruz.
    const { firstName, lastName, email, password } = req.body;
    // Eğer kullanıcı boş alan gönderirse hata mesajı döndürüyoruz.
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Lütfen tüm alanları doldurun.",
      });
    }

    // Aynı email ile daha önce kullanıcı kayıt olmuş mu kontrol ediyoruz.
    const existingUser = await User.findOne({ email });

    // Eğer aynı email varsa tekrar kayıt yapılmasına izin vermiyoruz.
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email zaten kayıtlı.",
      });
    }

    // Şifreyi hash'liyoruz yani güvenli hale getiriyoruz.
    // 10 değeri güvenlik seviyesi gibi düşünülebilir.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluşturuyoruz.
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    // Kayıt başarılı olursa kullanıcıya başarılı mesajı dönüyoruz.
    res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla kaydedildi.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Beklenmeyen bir hata olursa burası çalışır.
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
      error: error.message,
    });
  }
};

// Login yani giriş yapma fonksiyonu
const login = async (req, res) => {
  try {
    // Postman'den gelen email ve password bilgilerini alıyoruz.
    const { email, password } = req.body;

    // Email veya şifre boş gönderildiyse hata döndürüyoruz.
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Lütfen email ve şifre girin.",
      });
    }

    // Veritabanında bu email'e sahip kullanıcı var mı kontrol ediyoruz.
    const user = await User.findOne({ email: email });

    // Eğer kullanıcı bulunamazsa hata döndürüyoruz.
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    // Girilen şifre ile veritabanındaki hashlenmiş şifreyi karşılaştırıyoruz.
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Eğer şifre yanlışsa hata döndürüyoruz.
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

// Kullanıcı bilgileri doğruysa token oluşturuyoruz.
// Token içine kullanıcının id bilgisini koyuyoruz.
// JWT_SECRET ise .env dosyasından geliyor.
// expiresIn: "1h" tokenın 1 saat geçerli olacağını söyler.
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// Email ve şifre doğruysa giriş başarılı cevabı döndürüyoruz.
// Cevabın içine token bilgisini de ekliyoruz.
res.status(200).json({
  success: true,
  message: "Giriş başarılı.",
  token: token,
  user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  },
});

  } catch (error) {
    // Beklenmeyen bir hata olursa burası çalışır.
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
      error: error.message,
    });
  }
};

// Profile yani giriş yapan kullanıcının bilgilerini getirme fonksiyonu
const getProfile = async (req, res) => {
  try {
    // authMiddleware içinden gelen userId bilgisini kullanıyoruz.
    // Bu id token içinden çözülerek req.userId içine eklenmişti.
  const user = await User.findById(req.userId).select(
  "-password -resetPasswordToken -resetPasswordExpire -createdAt -updatedAt -__v"
);

    // Eğer kullanıcı bulunamazsa hata döndürüyoruz.
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı.",
      });
    }

    // Kullanıcı bulunursa bilgilerini döndürüyoruz.
    res.status(200).json({
      success: true,
      message: "Profil bilgileri getirildi.",
      user: user,
    });
  } catch (error) {
    // Beklenmeyen hata olursa burası çalışır.
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
      error: error.message,
    });
  }
};

// register fonksiyonunu dışarı aktarıyoruz.
// Böylece authRoutes.js bu fonksiyonu kullanabilir.
module.exports = {
  register,
  login,
  getProfile,
};
