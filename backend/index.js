// Express kütüphanesini projeye dahil ediyoruz.
// Express, backend sunucumuzu oluşturmamızı sağlar.
const express = require("express");

// .env dosyasındaki gizli bilgileri okuyabilmek için dotenv'i dahil ediyoruz.
// Örneğin: PORT, MONGO_URI, JWT_SECRET
const dotenv = require("dotenv");

// MongoDB bağlantı fonksiyonumuzu çağırıyoruz.
// Bu fonksiyon config/db.js dosyasından geliyor.
const connectDB = require("./config/db");

// Auth işlemleri için oluşturduğumuz route dosyasını çağırıyoruz.
// Register, login gibi işlemler bu route üzerinden çalışacak.
const authRoutes = require("./routes/authRoutes");

// .env dosyasını aktif hale getiriyoruz.
// Böylece process.env.PORT veya process.env.MONGO_URI kullanabiliriz.
dotenv.config();

// MongoDB bağlantısını başlatıyoruz.
connectDB();

// Express uygulamasını oluşturuyoruz.
const app = express();

// Frontend'den veya Postman'den gelen JSON verilerini okumamızı sağlar.
// Bu olmazsa req.body içindeki verileri alamayız.
app.use(express.json());

// /api/auth ile başlayan istekleri authRoutes dosyasına yönlendiriyoruz.
// Örnek: POST http://localhost:5000/api/auth/register
app.use("/api/auth", authRoutes);

// Basit test route'u.
// Tarayıcıdan http://localhost:5000 adresine girince bu yazıyı görürüz.
app.get("/", (req, res) => {
  res.send("Backend ve MongoDB çalışıyor!");
});

// Port bilgisini .env dosyasından alıyoruz.
// Eğer .env içinde PORT yoksa 5000 portunu kullanıyoruz.
const PORT = process.env.PORT || 5000;

// Sunucuyu başlatıyoruz.
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});