"use client";

// Form bilgilerini tutmak için useState kullanıyoruz
import { useState } from "react";

// Login başarılı olunca dashboard sayfasına yönlendirmek için kullanıyoruz
import { useRouter } from "next/navigation";

// Sayfalar arasında link vermek için kullanıyoruz
import Link from "next/link";

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
          initial={{ opacity: 0, scale: 0.92, rotateY: -12 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
  >
           <div style={styles.leftPage}>
          <p style={styles.smallText}>Book Club</p>

          <h1 style={styles.welcomeTitle}>Tekrar Hoş Geldin</h1>

          <p style={styles.welcomeText}>
            Okuma yolculuğuna kaldığın yerden devam et. Kitap kulübüne giriş
            yaparak profil bilgilerine ulaşabilirsin.
          </p>

          <div style={styles.quoteBox}>
            <p style={styles.quote}>
              “Bir kitap, insanın içinde açılan sessiz bir kapıdır.”
            </p>
          </div>
        </div>

        <div style={styles.pageDivider}></div>

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

  backgroundImage:
    "linear-gradient(rgba(15, 9, 5, 0.45), rgba(15, 9, 5, 0.65)), url('/bookshelf-bg.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
},

  bookCard: {
    width: "900px",
    minHeight: "520px",
    display: "flex",
    position: "relative" as const,
    borderRadius: "18px",
    overflow: "hidden",
    backgroundColor: "#fff8e8",
    border: "1px solid #d8c3a5",
    boxShadow: "0 24px 60px rgba(35, 20, 8, 0.35)",
  },

  leftPage: {
    width: "50%",
    padding: "48px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    background:
      "linear-gradient(90deg, #fff4d8 0%, #fff8e8 80%, #efe0c4 100%)",
    color: "#3b2415",
  },

  rightPage: {
    width: "50%",
    padding: "48px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    gap: "14px",
    background:
      "linear-gradient(90deg, #efe0c4 0%, #fff8e8 12%, #fffaf0 100%)",
    color: "#3b2415",
  },

  pageDivider: {
    position: "absolute" as const,
    top: "0",
    bottom: "0",
    left: "50%",
    width: "14px",
    transform: "translateX(-50%)",
    background:
      "linear-gradient(90deg, rgba(120,80,40,0.2), rgba(255,255,255,0.7), rgba(120,80,40,0.2))",
    boxShadow: "inset 0 0 16px rgba(80, 50, 20, 0.25)",
    zIndex: 1,
  },

  smallText: {
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "#8b5e34",
    fontWeight: "700",
    marginBottom: "14px",
  },

  welcomeTitle: {
    fontSize: "42px",
    lineHeight: "1.1",
    marginBottom: "18px",
    color: "#3b2415",
  },

  welcomeText: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#6b4a2f",
    marginBottom: "28px",
  },

  quoteBox: {
    padding: "18px",
    borderLeft: "4px solid #8b5e34",
    backgroundColor: "rgba(139, 94, 52, 0.08)",
    borderRadius: "8px",
  },

  quote: {
    margin: 0,
    color: "#5c3d2e",
    fontStyle: "italic",
    lineHeight: "1.6",
  },

  title: {
    textAlign: "center" as const,
    marginBottom: "12px",
    color: "#3b2415",
    fontSize: "28px",
  },

  input: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #c7ad86",
    fontSize: "15px",
    color: "#3b2415",
    backgroundColor: "#fffdf7",
    outline: "none",
  },

  passwordWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "1px solid #c7ad86",
    borderRadius: "8px",
    backgroundColor: "#fffdf7",
    overflow: "hidden",
  },

  passwordInput: {
    flex: 1,
    padding: "14px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#3b2415",
    backgroundColor: "#fffdf7",
  },

  eyeButton: {
    width: "48px",
    height: "48px",
    border: "none",
    backgroundColor: "#fffdf7",
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
    backgroundColor: "#8b5e34",
    color: "white",
    fontSize: "17px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "4px",
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
    color: "#8b5e34",
    textDecoration: "none",
    fontWeight: "800",
  },
};