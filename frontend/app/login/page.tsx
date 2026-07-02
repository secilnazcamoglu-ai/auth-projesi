"use client";

// Form bilgilerini tutmak için useState kullanıyoruz
import { useState } from "react";

// Login başarılı olunca dashboard sayfasına yönlendirmek için kullanıyoruz
import { useRouter } from "next/navigation";

// Sayfalar arasında link vermek için kullanıyoruz
import Link from "next/link";

// Sayfa açılırken animasyon vermek için motion kullanıyoruz
import { motion } from "motion/react";

export default function LoginPage() {
  // Kullanıcının yazdığı email bilgisini tutar
  const [email, setEmail] = useState("");

  // Kullanıcının yazdığı şifre bilgisini tutar
  const [password, setPassword] = useState("");

  // Backend'den gelen mesajı ekranda göstermek için kullanılır
  const [message, setMessage] = useState("");

  // Şifrenin görünür/gizli olma durumunu tutar
  const [showPassword, setShowPassword] = useState(false);

  const [isFlipping, setIsFlipping] = useState(false);

  // Sayfa yönlendirmesi yapmak için kullanılır
  const router = useRouter();


  
  // Form gönderilince çalışacak fonksiyon
  const handleLogin = async (e: React.FormEvent) => {
    // Sayfanın yenilenmesini engelliyoruz
    e.preventDefault();

    try {
      // Frontend'den backend'e login isteği gönderiyoruz
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",

        // Backend'e JSON veri gönderdiğimizi söylüyoruz
        headers: {
          "Content-Type": "application/json",
        },

        // Email ve şifreyi backend'e gönderiyoruz
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Backend'den gelen cevabı JSON'a çeviriyoruz
      const data = await response.json();

      // Backend'den gelen mesajı ekranda göstermek için state'e atıyoruz
      setMessage(data.message);

      // Eğer giriş başarılıysa token'ı kaydedip dashboard'a yönlendiriyoruz
      if (data.success) {
        localStorage.setItem("token", data.token);

        setEmail("");
        setPassword("");

        router.push("/dashboard");
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

          <h1 style={styles.welcomeTitle}>Tekrar Hoş Geldin</h1>

          <p style={styles.welcomeText}>
            Okuma yolculuğuna kaldığın yerden devam et. Kitap kulübüne giriş
            yaparak profil bilgilerine ulaşabilir ve hesabını yönetebilirsin.
          </p>

          <div style={styles.quoteBox}>
            <p style={styles.quote}>
              “Bir kitap, insanın içinde açılan sessiz bir kapıdır.”
            </p>
          </div>
        </div>

        {/* Kitabın orta katlama çizgisi */}
        <div style={styles.pageDivider}></div>

        {/* Sağ kitap sayfası / giriş formu */}
        <form onSubmit={handleLogin} style={styles.rightPage}>
          <h2 style={styles.title}>Giriş Yap</h2>

          <input
            className="login-input"
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={styles.passwordWrapper}>
            <input
              className="login-input"
              style={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              placeholder="Şifre"
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

          <button style={styles.button} type="submit">
            Giriş Yap
          </button>

          {message && <p style={styles.message}>{message}</p>}

          <p style={styles.linkText}>
            <Link href="/forgot-password" style={styles.link}>
              Şifremi unuttum
            </Link>
          </p>

          <p style={styles.linkText}>
            Hesabın yok mu?{" "}
            <Link href="/register" style={styles.link}>
              Kayıt Ol
            </Link>
          </p>
        </form>
      </motion.section>
    </main>
  );
}

// Kitap temalı login sayfası görünüm ayarları
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

    // public klasöründeki kitaplık görselini arka plan yapıyoruz
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
    marginBottom: "14px",
    color: "#4a2f1d",
    fontSize: "30px",
    fontFamily: "Georgia, 'Times New Roman', serif",
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
};