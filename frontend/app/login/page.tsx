"use client";

// Form bilgilerini tutmak için useState kullanıyoruz
import { useState } from "react";

export default function LoginPage() {
  // Kullanıcının yazdığı email bilgisini tutar
  const [email, setEmail] = useState("");

  // Kullanıcının yazdığı şifre bilgisini tutar
  const [password, setPassword] = useState("");

  // Backend'den gelen mesajı ekranda göstermek için kullanılır
  const [message, setMessage] = useState("");

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

      // Backend'den gelen mesajı ekrana yazdırıyoruz
      setMessage(data.message);

      // Eğer giriş başarılıysa token'ı tarayıcıya kaydediyoruz
      if (data.success) {
        localStorage.setItem("token", data.token);

        // İstersen burada formu temizliyoruz
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      // Backend kapalıysa veya bağlantı sorunu varsa burası çalışır
      setMessage("Bir hata oluştu. Backend çalışıyor mu kontrol edin.");
    }
  };

  return (
    <main style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h1 style={styles.title}>Giriş Yap</h1>

        <input
          className="login-input"
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          style={styles.input}
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} type="submit">
          Giriş Yap
        </button>

        {message && <p style={styles.message}>{message}</p>}
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
    width: "350px",
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
    marginBottom: "10px",
    color: "#111827",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    color: "#111827",
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
};