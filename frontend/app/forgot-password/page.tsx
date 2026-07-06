"use client";

// React ve Next.js kütüphanelerini import ediyoruz 
import { useEffect, useState } from "react";

// Login sayfasına link vermek için kullanıyoruz
import Link from "next/link";

// Sayfa açılırken animasyon vermek için motion kullanıyoruz
import { motion } from "motion/react";

export default function ForgotPasswordPage() {
  // Kullanıcının yazdığı email bilgisini tutar
  const [email, setEmail] = useState("");

  // Backend'den gelen mesajı ekranda göstermek için kullanılır
  const [message, setMessage] = useState("");

// Şifre sıfırlama linkinin geçerlilik süresini göstermek için kullanılır
  const [countdown, setCountdown] = useState(0);

// countdown state'i değiştiğinde çalışacak useEffect
useEffect(() => {
  if (countdown <= 0) return;

  const timer = setInterval(() => {
    setCountdown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [countdown]);

  // Form gönderilince çalışacak fonksiyon
  const handleForgotPassword = async (e: React.FormEvent) => {
    // Sayfanın yenilenmesini engelliyoruz
    e.preventDefault();

    try {
      // Backend'e forgot-password isteği gönderiyoruz
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",

          // Backend'e JSON veri gönderdiğimizi söylüyoruz
          headers: {
            "Content-Type": "application/json",
          },

          // Kullanıcının yazdığı emaili backend'e gönderiyoruz
          body: JSON.stringify({
            email,
          }),
        }
      );

      // Backend'den gelen cevabı JSON'a çeviriyoruz
      const data = await response.json();

      // Backend'den gelen mesajı ekranda gösteriyoruz
      setMessage(data.message);

      // Eğer backend başarılı bir şekilde link gönderdi ise email state'ini temizliyoruz
      if (data.success) {
  setEmail("");

  // Reset linki 2 dakika geçerli olduğu için ekranda 120 saniyelik geri sayım başlatıyoruz
  setCountdown(120);
}
    } catch (error) {
      setMessage("Bir hata oluştu. Backend çalışıyor mu kontrol edin.");
    }
  };

  return (
    <main style={styles.container}>
      <motion.section
        style={styles.bookCard}
        initial={{ opacity: 0, scale: 0.92, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Kitabın üstüne sıcak ışık yansıması verir */}
        <div style={styles.bookLight}></div>

        {/* Sol kitap sayfası */}
        <div style={styles.leftPage}>
          <p style={styles.smallText}>Kitap Kulübü</p>

          <h1 style={styles.welcomeTitle}>Şifreni mi Unuttun?</h1>

          <p style={styles.welcomeText}>
            Endişelenme. Hesabına kayıtlı email adresini yaz, sana şifreni
            yenileyebilmen için güvenli bir bağlantı gönderelim.
          </p>

          <div style={styles.quoteBox}>
            <p style={styles.quote}>
              “Kaybolan bir sayfa, doğru işaretle yeniden bulunur.”
            </p>
          </div>
        </div>

        {/* Kitabın orta katlama çizgisi */}
        <div style={styles.pageDivider}></div>

        {/* Sağ kitap sayfası / şifremi unuttum formu */}
        <form onSubmit={handleForgotPassword} style={styles.rightPage}>
          <h2 style={styles.title}>Şifre Sıfırlama</h2>

          <p style={styles.description}>
            Email adresinizi girin. Şifre sıfırlama bağlantısı email adresinize
            gönderilecektir.
          </p>

          <input
            className="forgot-input"
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button style={styles.button} type="submit">
            Link Gönder
          </button>

          {message && <p style={styles.message}>{message}</p>}
          {countdown > 0 && (         
            <div style={styles.countdownBox}>
              <p style={styles.countdownText}>Reset linkinin kalan süresi</p>

              <p style={styles.countdownTime}>
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                {String(countdown % 60).padStart(2, "0")}
              </p>
          </div>
        )}

{countdown === 0 && message && (
  <p style={styles.expireText}>
    Süre dolduysa yeni bir şifre sıfırlama bağlantısı isteyebilirsin.
  </p>
)}


          <p style={styles.linkText}>
            Şifreni hatırladın mı?{" "}
            <Link href="/login" style={styles.link}>
              Giriş Yap
            </Link>
          </p>
        </form>
      </motion.section>
    </main>
  );
}

// Kitap temalı forgot password sayfası görünüm ayarları
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    perspective: "1200px",
    overflow: "hidden",
    position: "relative" as const,

    backgroundImage:
      "linear-gradient(rgba(15, 9, 5, 0.45), rgba(15, 9, 5, 0.68)), url('/bookshelf-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  bookCard: {
    width: "900px",
    minHeight: "520px",
    display: "flex",
    position: "relative" as const,
    zIndex: 1,
    borderRadius: "14px",
    overflow: "hidden",
    backgroundColor: "#eadfc8",
    border: "1px solid #b9976b",
    boxShadow: "0 24px 60px rgba(20, 10, 5, 0.45)",
  },

  bookLight: {
    position: "absolute" as const,
    top: "-70px",
    left: "50%",
    width: "420px",
    height: "250px",
    transform: "translateX(-50%)",
    background:
      "radial-gradient(circle, rgba(255, 190, 105, 0.24) 0%, rgba(255, 160, 70, 0.12) 45%, transparent 75%)",
    filter: "blur(20px)",
    pointerEvents: "none" as const,
    zIndex: 2,
  },

  leftPage: {
    width: "50%",
    padding: "48px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    position: "relative" as const,
    zIndex: 3,
    background:
      "linear-gradient(90deg, #e8dcc3 0%, #efe3cb 78%, #dcc8a6 100%)",
    color: "#3f2b1d",
  },

  rightPage: {
    width: "50%",
    padding: "48px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    gap: "14px",
    position: "relative" as const,
    zIndex: 3,
    background:
      "linear-gradient(90deg, #dcc8a6 0%, #efe3cb 12%, #f3ead7 100%)",
    color: "#3f2b1d",
  },

  pageDivider: {
    position: "absolute" as const,
    top: "0",
    bottom: "0",
    left: "50%",
    width: "18px",
    transform: "translateX(-50%)",
    background:
      "linear-gradient(90deg, rgba(120, 84, 48, 0.38), rgba(248, 238, 214, 0.92), rgba(120, 84, 48, 0.38))",
    boxShadow: "inset 0 0 18px rgba(70, 40, 15, 0.28)",
    zIndex: 4,
  },

  smallText: {
    fontSize: "14px",
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
    color: "#8b5d2f",
    fontWeight: "700",
    marginBottom: "16px",
  },

  welcomeTitle: {
    fontSize: "44px",
    lineHeight: "1.15",
    marginBottom: "20px",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },

  welcomeText: {
    fontSize: "17px",
    lineHeight: "1.8",
    color: "#6a4a31",
    marginBottom: "28px",
  },

  quoteBox: {
    padding: "20px",
    borderLeft: "4px solid #8b5d2f",
    backgroundColor: "rgba(120, 84, 48, 0.10)",
    borderRadius: "8px",
    boxShadow: "inset 0 0 8px rgba(90, 60, 30, 0.06)",
  },

  quote: {
    margin: 0,
    color: "#5f4028",
    fontStyle: "italic",
    lineHeight: "1.8",
    fontSize: "16px",
  },

  title: {
    textAlign: "center" as const,
    marginBottom: "6px",
    color: "#4a2f1d",
    fontSize: "30px",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },

  description: {
    textAlign: "center" as const,
    color: "#6a4a31",
    fontSize: "15px",
    lineHeight: "1.6",
    marginBottom: "8px",
  },

  input: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #b99972",
    fontSize: "15px",
    color: "#3b2415",
    backgroundColor: "#f3ead8",
    outline: "none",
  },

  button: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#8a6238",
    color: "white",
    fontSize: "17px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "6px",
    boxShadow: "0 6px 18px rgba(70, 40, 15, 0.22)",
  },

  message: {
    textAlign: "center" as const,
    marginTop: "8px",
    color: "#5c3d2e",
    fontWeight: "600",
  },

  linkText: {
    textAlign: "center" as const,
    marginTop: "6px",
    marginBottom: "0",
    color: "#6b4a2f",
    fontSize: "15px",
  },

  link: {
    color: "#8a6238",
    textDecoration: "none",
    fontWeight: "800",
  },

countdownBox: {
  marginTop: "10px",
  padding: "14px",
  borderRadius: "12px",
  backgroundColor: "rgba(120, 84, 48, 0.10)",
  border: "1px solid rgba(139, 93, 47, 0.22)",
  textAlign: "center" as const,
},

countdownText: {
  margin: "0 0 6px 0",
  color: "#6a4a31",
  fontSize: "14px",
  fontWeight: "700",
},

countdownTime: {
  margin: 0,
  color: "#4a2f1d",
  fontSize: "32px",
  fontWeight: "900",
  fontFamily: "Georgia, 'Times New Roman', serif",
},

expireText: {
  margin: "8px 0 0 0",
  color: "#7a2e1f",
  fontSize: "14px",
  fontWeight: "700",
  textAlign: "center" as const,
},



};