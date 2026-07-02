"use client";

// Formdaki bilgileri tutmak için useState kullanıyoruz
import { useState } from "react";

// Kayıt başarılı olunca login sayfasına yönlendirmek için kullanıyoruz
import { useRouter } from "next/navigation";

// Sayfalar arasında link vermek için kullanıyoruz
import Link from "next/link";

export default function RegisterPage() {
  // Kullanıcının yazdığı ad bilgisini tutar
  const [firstName, setFirstName] = useState("");

  // Kullanıcının yazdığı soyad bilgisini tutar
  const [lastName, setLastName] = useState("");

  // Kullanıcının yazdığı email bilgisini tutar
  const [email, setEmail] = useState("");

  // Kullanıcının yazdığı şifre bilgisini tutar
  const [password, setPassword] = useState("");

  // Backend'den gelen başarı veya hata mesajını göstermek için kullanılır
  const [message, setMessage] = useState("");

  // Şifrenin görünür/gizli olma durumunu tutar
  const [showPassword, setShowPassword] = useState(false);

  // Sayfa yönlendirmesi yapmak için kullanılır
  const router = useRouter();

  // Form gönderildiğinde çalışacak fonksiyon
  const handleRegister = async (e: React.FormEvent) => {
    // Sayfanın yenilenmesini engelliyoruz
    e.preventDefault();

    try {
      // Frontend'den backend'e register isteği gönderiyoruz
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",

        // Backend'e JSON veri gönderdiğimizi söylüyoruz
        headers: {
          "Content-Type": "application/json",
        },

        // Formdaki bilgileri JSON olarak backend'e gönderiyoruz
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      // Backend'den gelen cevabı JSON'a çeviriyoruz
      const data = await response.json();

      // Backend'den gelen mesajı ekranda göstermek için state'e atıyoruz
      setMessage(data.message);

      // Kayıt başarılıysa formu temizliyoruz ve login sayfasına yönlendiriyoruz
      if (data.success) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");

        // Kayıt başarılı olunca kullanıcıyı login sayfasına gönderiyoruz
        router.push("/login");
      }
    } catch (error) {
      // Backend'e ulaşılamazsa burası çalışır
      setMessage("Bir hata oluştu. Backend çalışıyor mu kontrol edin.");
    }
  };

  return (
    <main style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h1 style={styles.title}>Kayıt Ol</h1>

        <input
          className="register-input"
          style={styles.input}
          type="text"
          placeholder="Ad"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="register-input"
          style={styles.input}
          type="text"
          placeholder="Soyad"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          className="register-input"
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={styles.passwordWrapper}>
          <input
            className="register-input"
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
          Kayıt Ol
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.linkText}>
          Zaten hesabın var mı?{" "}
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