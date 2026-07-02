"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  const handleResetPassword = async (e: React.FormEvent) => {
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response.json();

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
      <form onSubmit={handleResetPassword} style={styles.form}>
        <h1 style={styles.title}>Şifre Sıfırla</h1>

        <p style={styles.description}>
          Yeni şifrenizi belirleyin. İşlem başarılı olursa giriş sayfasına
          yönlendirileceksiniz.
        </p>

        <input
          style={styles.disabledInput}
          type="text"
          value="Email link üzerinden doğrulandı"
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
    </main>
  );
}

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

  disabledInput: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
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
};