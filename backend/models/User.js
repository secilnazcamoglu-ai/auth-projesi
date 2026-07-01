// MongoDB ile çalışmamızı sağlayan mongoose kütüphanesini projeye dahil ediyoruz.
const mongoose = require("mongoose");

// Kullanıcıların veritabanında nasıl tutulacağını tanımlayan şemayı oluşturuyoruz.
const userSchema = new mongoose.Schema(
  {
    // Kullanıcının adı
    firstName: {
      type: String,      // Veri tipi metin olacak.
      required: true,    // Bu alan boş bırakılamaz.
      trim: true,        // Başındaki ve sonundaki boşlukları siler.
    },

    // Kullanıcının soyadı
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    // Kullanıcının e-posta adresi
    email: {
      type: String,
      required: true,
      unique: true,      // Aynı e-posta ile ikinci kez kayıt olunamaz.
      lowercase: true,   // E-postayı otomatik küçük harfe çevirir.
    },

    // Kullanıcının şifresi
    password: {
      type: String,
      required: true,
      // Burada düz şifre tutulmayacak.
      // Register işlemi sırasında bcrypt ile şifrelenmiş (hashlenmiş) hali kaydedilecek.
    },

    // Şifremi unuttum özelliği için oluşturulacak token
    resetPasswordToken: {
      type: String,
      default: null,     // İlk oluşturulduğunda boş olacak.
    },

    // Şifre sıfırlama bağlantısının son kullanma tarihi
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },

  {
    // Kullanıcı oluşturulma ve güncellenme tarihlerini otomatik ekler.
    timestamps: true,
  }
);

// User modelini oluşturup diğer dosyalarda kullanabilmek için dışa aktarıyoruz.
module.exports = mongoose.model("User", userSchema);