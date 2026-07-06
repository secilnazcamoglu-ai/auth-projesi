// User modelini projeye dahil ediyoruz.
// MongoDB'deki users koleksiyonu ile işlem yapmak için kullanacağız.
const User = require("../models/User");

// Şifreyi güvenli hale getirmek için bcryptjs kullanacağız.
// Kullanıcının şifresini düz metin olarak veritabanına kaydetmemeliyiz.
const bcrypt = require("bcryptjs");

// JWT paketi token oluşturmak için kullanılır.
// Login başarılı olunca kullanıcıya token vereceğiz.
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendEmail");

// Şifre sıfırlama tokeni oluşturmak için crypto kullanacağız.
const crypto = require("crypto");

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


// Forgot Password yani şifremi unuttum fonksiyonu
const forgotPassword = async (req, res) => {
  try {
    // Kullanıcının gönderdiği email bilgisini alıyoruz
    const { email } = req.body;

    // Email boş gönderildiyse hata döndürüyoruz
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Lütfen email adresinizi girin.",
      });
    }

    // Bu email ile kayıtlı kullanıcı var mı kontrol ediyoruz
    const user = await User.findOne({ email });

    // Kullanıcı bulunamazsa hata döndürüyoruz
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Bu email ile kayıtlı kullanıcı bulunamadı.",
      });
    }

    // Rastgele reset token oluşturuyoruz
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token'ı veritabanına düz haliyle kaydetmiyoruz, hashliyoruz
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Hashlenmiş token'ı kullanıcıya kaydediyoruz
    user.resetPasswordToken = hashedToken;

    // Reset linkinin 2 dakika geçerli olmasını sağlıyoruz
    user.resetPasswordExpire = Date.now() + 2 * 60 * 1000;

    const expireTime = new Date(user.resetPasswordExpire).toLocaleTimeString("tr-TR", {
  hour: "2-digit",
  minute: "2-digit",
});

    // Kullanıcıyı güncelliyoruz
    await user.save();

    // Frontend reset password linki
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
  <div style="margin:0; padding:0; background-color:#1f1208; font-family:Arial, sans-serif;">
    <div style="max-width:620px; margin:0 auto; padding:32px 18px;">
      
      <div style="
        background: linear-gradient(135deg, #eee0c2 0%, #f8eccf 48%, #dac297 100%);
        border: 1px solid #b9976b;
        border-radius: 18px;
        padding: 34px;
        color: #3f2b1d;
        box-shadow: 0 18px 40px rgba(0,0,0,0.35);
      ">
        
        <p style="
          margin:0 0 12px 0;
          color:#8b5d2f;
          font-size:13px;
          font-weight:800;
          letter-spacing:3px;
          text-transform:uppercase;
        ">
          Kitap Kulübü
        </p>

        <h1 style="
          margin:0 0 18px 0;
          color:#4a2f1d;
          font-family:Georgia, 'Times New Roman', serif;
          font-size:34px;
          line-height:1.2;
        ">
          Şifre Yenileme Bağlantısı
        </h1>

        <p style="
          margin:0 0 16px 0;
          color:#5f4028;
          font-size:16px;
          line-height:1.7;
        ">
          Kitap Kulübü hesabınız için şifre yenileme isteği aldık.
          Şifrenizi yenilemek için aşağıdaki butona tıklayabilirsiniz.
        </p>

        <div style="
          margin:24px 0;
          padding:18px;
          border-radius:12px;
          background-color:rgba(120,84,48,0.10);
          border:1px solid rgba(139,93,47,0.24);
        ">
          <p style="
            margin:0 0 6px 0;
            color:#4a2f1d;
            font-size:16px;
            font-weight:700;
          ">
            Bağlantı geçerlilik süresi
          </p>

          <p style="
            margin:0;
            color:#7a2e1f;
            font-size:22px;
            font-weight:900;
            font-family:Georgia, 'Times New Roman', serif;
          ">
            2 dakika
          </p>

          <p style="
            margin:8px 0 0 0;
            color:#6a4a31;
            font-size:14px;
          ">
            Son geçerlilik saati: ${expireTime}
          </p>
        </div>

        <a href="${resetUrl}" style="
          display:block;
          width:100%;
          box-sizing:border-box;
          text-align:center;
          padding:15px 20px;
          border-radius:10px;
          background-color:#8a6238;
          color:#ffffff;
          text-decoration:none;
          font-size:17px;
          font-weight:800;
          box-shadow:0 8px 20px rgba(70,40,15,0.22);
        ">
          Şifremi Yenile
        </a>

        <p style="
          margin:22px 0 0 0;
          color:#5f4028;
          font-size:14px;
          line-height:1.6;
        ">
          Eğer bu işlemi siz yapmadıysanız bu e-postayı dikkate almayabilirsiniz.
        </p>

        <div style="
          margin-top:26px;
          padding-top:18px;
          border-top:1px solid rgba(139,93,47,0.22);
        ">
          <p style="
            margin:0;
            color:#8b5d2f;
            font-size:13px;
            font-weight:800;
            letter-spacing:2px;
          ">
            Kitap Kulübü
          </p>

          <p style="
            margin:6px 0 0 0;
            color:#6a4a31;
            font-size:13px;
          ">
            Okuma yolculuğuna güvenle devam et.
          </p>
        </div>
      </div>

      <p style="
        margin:18px 0 0 0;
        color:#d7b98e;
        font-size:12px;
        text-align:center;
        line-height:1.5;
      ">
        Buton çalışmazsa aşağıdaki bağlantıyı tarayıcınıza yapıştırabilirsiniz:
        <br />
        <span style="color:#f6e6c8;">${resetUrl}</span>
      </p>
    </div>
  </div>
`;
    try {
      // Email gönderiyoruz
      await sendEmail({
        email: user.email,
        subject: "Şifre Sıfırlama Bağlantısı",
        message: message,
      });

      res.status(200).json({
        success: true,
        message: "Şifre sıfırlama linki email adresinize gönderildi.",
      });
    } catch (error) {
      // Email gönderilemezse token bilgilerini temizliyoruz
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(500).json({
        success: false,
        message: "Email gönderilemedi. Lütfen tekrar deneyin.",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
      error: error.message,
    });
  }
};

// Reset Password yani yeni şifre belirleme fonksiyonu
const resetPassword = async (req, res) => {
  try {
    // URL'den token bilgisini alıyoruz
    const { token } = req.params;

    // Kullanıcının gönderdiği yeni şifreyi alıyoruz
    const { password } = req.body;

    // Şifre boş gönderildiyse hata döndürüyoruz
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Lütfen yeni şifrenizi girin.",
      });
    }

    // URL'den gelen token'ı hashliyoruz
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Token doğru mu ve süresi dolmamış mı kontrol ediyoruz
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // Kullanıcı bulunamazsa token geçersiz veya süresi dolmuş demektir
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token geçersiz veya süresi dolmuş.",
      });
    }

    // Yeni şifreyi hashliyoruz
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcının şifresini güncelliyoruz
    user.password = hashedPassword;

    // Reset token bilgilerini temizliyoruz
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Kullanıcıyı kaydediyoruz
    await user.save();

    res.status(200).json({
      success: true,
      message: "Şifre başarıyla güncellendi.",
    });
  } catch (error) {
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
  forgotPassword,
  resetPassword,
};