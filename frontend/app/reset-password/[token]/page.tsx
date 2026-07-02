"use client";

// Form bilgilerini tutmak için useState kullanıyoruz
import { useState } from "react";

// URL'deki token bilgisini almak ve yönlendirme yapmak için kullanıyoruz
import { useParams, useRouter } from "next/navigation";

// Sayfa açılırken animasyon vermek için motion kullanıyoruz
import { motion } from "motion/react";

export default function ResetPasswordPage() {
  // URL içindeki token bilgisini alıyoruz
  const params = useParams();

  // Sayfa yönlendirmesi için kullanıyoruz
  const router = useRouter();

  // Kullanıcının yazdığı yeni şifreyi tutar
  const [password, setPassword] = useState("");

  // Kullanıcının tekrar yazdığı şifreyi tutar
  const [confirmPassword, setConfirmPassword] = useState("");

  // Mesaj göstermek için kullanılır
  const [message, setMessage] = useState("");

  // Yeni şifre görünür/gizli durumunu tutar
  const [showPassword, setShowPassword] = useState(false);

  // Şifre tekrar görünür/gizli durumunu tutar
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form gönderildiğinde çalışacak fonksiyon
  const handleResetPassword = async (e: React.FormEvent) => {
    // Sayfanın yenilenmesini engelliyoruz
    e.preventDefault();

    // İki şifre aynı mı kontrol ediyoruz
    if (password !== confirmPassword) {
      setMessage("Şifreler eşleşmiyor.");
      return;
    }

    try {
      // Backend reset-password route'una yeni şifreyi gönderiyoruz
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${params.token}`,
        {
          method: "PUT",

          // Backend'e JSON veri gönderdiğimizi söylüyoruz
          headers: {
            "Content-Type": "application/json",
          },

          // Yeni şifreyi backend'e gönderiyoruz
          body: JSON.stringify({
            password,
          }),
        }
      );

      // Backend'den gelen cevabı JSON'a çeviriyoruz
      const data = await response.json();

      // Backend'den gelen mesajı ekranda gösteriyoruz
      setMessage(data.message);

      // Şifre başarıyla değişirse kullanıcıyı login sayfasına gönderiyoruz
      if (data.success) {
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/login");
        }, 1500);
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

          <h1 style={styles.welcomeTitle}>Yeni Bir Sayfa Aç</h1>

          <p style={styles.welcomeText}>
            Hesabın için yeni bir şifre belirleyerek okuma yolculuğuna güvenli
            şekilde devam edebilirsin.
          </p>

          <div style={styles.quoteBox}>
            <p style={styles.quote}>
              “Bazen yeni bir başlangıç, sadece yeni bir şifre kadar yakındır.”
            </p>
          </div>
        </div>

        {/* Kitabın orta katlama çizgisi */}
        <div style={styles.pageDivider}></div>

        {/* Sağ kitap sayfası / şifre yenileme formu */}
        <form onSubmit={handleResetPassword} style={styles.rightPage}>
          <h2 style={styles.title}>Şifre Yenile</h2>

          <p style={styles.description}>
            Yeni şifrenizi girin. İşlem başarılı olursa giriş sayfasına
            yönlendirileceksiniz.
          </p>

          <input
            style={styles.disabledInput}
            type="text"
            value="Email bağlantısı doğrulandı"
            disabled
          />

          <div style={styles.passwordWrapper}>
            <input
              className="reset-input"
              style={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              placeholder="Yeni Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? "/eye.svg" : "/eye-off.svg"}
                alt={showPassword ? "Şifre görünür" : "Şifre gizli"}
                style={styles.eyeIcon}
              />
            </button>
          </div>

          <div style={styles.passwordWrapper}>
            <input
              className="reset-input"
              style={styles.passwordInput}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Yeni Şifre Tekrar"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <img
                src={showConfirmPassword ? "/eye.svg" : "/eye-off.svg"}
                alt={showConfirmPassword ? "Şifre görünür" : "Şifre gizli"}
                style={styles.eyeIcon}
              />
            </button>
          </div>

          <button style={styles.button} type="submit">
            Şifreyi Güncelle
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </form>
      </motion.section>
    </main>
  );
}

// Kitap temalı şifre yenileme sayfası görünüm ayarları
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
    minHeight: "560px",
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

  disabledInput: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #b99972",
    fontSize: "15px",
    color: "#6a4a31",
    backgroundColor: "#e6d7bb",
    outline: "none",
    cursor: "not-allowed",
  },

  passwordWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "1px solid #b99972",
    borderRadius: "8px",
    backgroundColor: "#f3ead8",
    overflow: "hidden",
  },

  passwordInput: {
    flex: 1,
    padding: "14px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#3b2415",
    backgroundColor: "#f3ead8",
  },

  eyeButton: {
    width: "48px",
    height: "48px",
    border: "none",
    backgroundColor: "#f3ead8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  eyeIcon: {
    width: "22px",
    height: "22px",
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
};