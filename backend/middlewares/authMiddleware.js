// JWT paketini dahil ediyoruz.
// Token kontrolü yapmak için kullanacağız.
const jwt = require("jsonwebtoken");

// Bu middleware korumalı route'lara giriş kontrolü yapacak.
const authMiddleware = (req, res, next) => {
  // Kullanıcının gönderdiği token header içinden alınır.
  // Postman'de Authorization kısmından gönderilecek.
  const authHeader = req.headers.authorization;

  // Eğer Authorization bilgisi yoksa kullanıcı giriş yapmamış demektir.
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token bulunamadı. Lütfen giriş yapın.",
    });
  }

  // Token genelde şu formatta gelir:
  // Bearer token_degeri
  // Biz burada sadece token kısmını alıyoruz.
  const token = authHeader.split(" ")[1];

  // Eğer token yoksa hata döndürüyoruz.
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Geçersiz token formatı.",
    });
  }

  try {
    // Token doğru mu kontrol ediyoruz.
    // JWT_SECRET .env dosyasından geliyor.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token içindeki kullanıcı id bilgisini request içine ekliyoruz.
    // Böylece sonraki fonksiyonlarda req.userId ile kullanıcıya ulaşabiliriz.
    req.userId = decoded.id;

    // Her şey doğruysa bir sonraki adıma geçiyoruz.
    next();
  } catch (error) {
    // Token hatalıysa veya süresi dolduysa burası çalışır.
    return res.status(401).json({
      success: false,
      message: "Token geçersiz veya süresi dolmuş.",
    });
  }
};

// Middleware'i dışarı aktarıyoruz.
module.exports = authMiddleware;