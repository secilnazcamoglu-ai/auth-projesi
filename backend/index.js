// Express kütüphanesini projemize dahil ediyoruz
// Express sayesinde backend sunucusu oluşturacağız
const express = require("express");

// .env dosyasındaki gizli bilgileri okumak için dotenv kullanıyoruz
// Örneğin PORT veya MongoDB bağlantı adresi burada tutulur
const dotenv = require("dotenv");

// CORS paketi frontend ile backend arasındaki bağlantıya izin verir
const cors = require("cors");

// MongoDB bağlantı fonksiyonumuzu çağırıyoruz
// Bu fonksiyon config/db.js dosyasından gelecek
const connectDB = require("./config/db");

// Auth route dosyamızı çağırıyoruz
// Register, login gibi işlemlerin yolları burada olacak
const authRoutes = require("./routes/authRoutes");

// .env dosyasını aktif ediyoruz
dotenv.config();

// MongoDB veritabanına bağlanıyoruz
connectDB();

// Express uygulamasını başlatıyoruz
const app = express();

// Frontend'in backend'e istek atmasına izin veriyoruz
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Gelen JSON verilerini okumamızı sağlar
// Örneğin kullanıcı register olurken name, email, password JSON olarak gelir
app.use(express.json());

// Auth işlemleri için ana route tanımlıyoruz
// /api/auth/register gibi yollar buradan çalışacak
app.use("/api/auth", authRoutes);

// Ana sayfa test route'u
// Tarayıcıda http://localhost:5000 açılırsa bu mesaj görünür
app.get("/", (req, res) => {
  res.send("API çalışıyor...");
});

// PORT değerini .env dosyasından alıyoruz
// Eğer .env içinde PORT yoksa 5000 kullanılır
const PORT = process.env.PORT || 5000;

// Sunucuyu başlatıyoruz
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
