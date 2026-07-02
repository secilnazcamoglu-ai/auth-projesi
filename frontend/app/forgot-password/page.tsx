"use client";

// Formdaki email bilgisini tutmak için useState kullanıyoruz
import { useState } from "react";

// Login sayfasına link vermek için kullanıyoruz
import Link from "next/link";

export default function ForgotPasswordPage() {
  // Kullanıcının yazdığı email bilgisini tutar
  const [email, setEmail] = useState("");

  // Backend'den gelen mesajı ekranda göstermek için kullanılır
  const [message, setMessage] = useState("");

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

      // İşlem başarılıysa email inputunu temizliyoruz
      if (data.success) {
        setEmail("");
      }
    } catch (error) {
      // Backend kapalıysa veya bağlantı sorunu varsa burası çalışır
      setMessage("Bir hata oluştu. Backend çalışıyor mu kontrol edin.");
    }
  };

  return (
    <main style={styles.container}>
      <form onSubmit={handleForgotPassword} style={styles.form}>
        <h1 style={styles.title}>Şifremi Unuttum</h1>

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

        <p style={styles.linkText}>
          Şifreni hatırladın mı?{" "}
          <Link href="/login" style={styles.link}>
            Giriş Yap
          </Link>
        </p>
      </form>
    </main>
  );
}

// Sayfanın görünüm ayarları
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },

  form: {
    width: "380px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    padding: "24px",
    borderRadius: "12px",
    backgroundColor: "white",
    color: "#111827",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center" as const,
    marginBottom: "4px",
    color: "#111827",
  },

  description: {
    textAlign: "center" as const,
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "8px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "white",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  message: {
    textAlign: "center" as const,
    marginTop: "10px",
    color: "#111827",
    fontWeight: "500",
  },

  linkText: {
    textAlign: "center" as const,
    marginTop: "8px",
    color: "#374151",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },
};