"use client";

// Form bilgilerini tutmak için useState kullanıyoruz
import { useState } from "react";

// Login başarılı olunca dashboard sayfasına yönlendirmek için kullanıyoruz
import { useRouter } from "next/navigation";

// Sayfalar arasında link vermek için kullanıyoruz
import Link from "next/link";

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
        // Backend'den gelen token'ı tarayıcıya kaydediyoruz
        localStorage.setItem("token", data.token);

        // Formu temizliyoruz
        setEmail("");
        setPassword("");

        // Login başarılı olunca dashboard sayfasına gönderiyoruz
        router.push("/dashboard");
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
    backgroundColor: "white",
  },

  passwordWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "white",
    overflow: "hidden",
  },

  passwordInput: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "white",
  },

  eyeButton: {
    width: "44px",
    height: "44px",
    border: "none",
    backgroundColor: "white",
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