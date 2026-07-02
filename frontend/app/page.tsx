// Next.js Link yapısını kullanıyoruz.
// Sayfalar arasında yönlendirme yapmak için kullanılır.
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1 style={styles.title}>Auth Projesine Hoş Geldiniz</h1>

        <p style={styles.description}>
          Bu projede kullanıcı kayıt olabilir, giriş yapabilir ve giriş yaptıktan
          sonra dashboard sayfasında profil bilgilerini görebilir.
        </p>

        <div style={styles.buttonGroup}>
          <Link href="/register" style={styles.registerButton}>
            Kayıt Ol
          </Link>

          <Link href="/login" style={styles.loginButton}>
            Giriş Yap
          </Link>
        </div>
      </section>
    </main>
  );
}

// Ana sayfanın görünüm ayarları
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  card: {
    width: "500px",
    padding: "32px",
    borderRadius: "16px",
    backgroundColor: "white",
    color: "#111827",
    textAlign: "center" as const,
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "16px",
    color: "#111827",
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "24px",
    color: "#374151",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  registerButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
  loginButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    backgroundColor: "#111827",
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
};