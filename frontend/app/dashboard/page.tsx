"use client";

// useEffect sayfa açıldığında çalışacak kodlar için kullanılır
// useState ise ekranda göstereceğimiz bilgileri tutmak için kullanılır
import { useEffect, useState } from "react";

// Sayfa yönlendirmesi yapmak için useRouter kullanıyoruz
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  // Kullanıcı bilgilerini tutmak için state oluşturuyoruz
  const [user, setUser] = useState<any>(null);

  // Başarı veya hata mesajlarını göstermek için state oluşturuyoruz
  const [message, setMessage] = useState("");

  // Sayfa yönlendirmesi için router oluşturuyoruz
  const router = useRouter();

  // Sayfa ilk açıldığında çalışır
  useEffect(() => {
    // localStorage içinden login sırasında kaydettiğimiz token'ı alıyoruz
    const token = localStorage.getItem("token");

    // Eğer token yoksa kullanıcı giriş yapmamış demektir
    if (!token) {
      setMessage("Bu sayfayı görmek için giriş yapmalısınız.");
      return;
    }

    // Token varsa kullanıcı profil bilgilerini backend'den getiriyoruz
    const getProfile = async () => {
      try {
        // Backend'deki korumalı profile route'una istek gönderiyoruz
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",

          // Token'ı Authorization header içinde gönderiyoruz
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Backend'den gelen cevabı JSON'a çeviriyoruz
        const data = await response.json();

        // Eğer işlem başarılıysa kullanıcı bilgilerini state'e kaydediyoruz
        if (data.success) {
          setUser(data.user);
        } else {
          // Token geçersizse veya süresi dolduysa mesaj gösteriyoruz
          setMessage(data.message);
        }
      } catch (error) {
        // Backend'e ulaşılamazsa burası çalışır
        setMessage("Bir hata oluştu. Backend çalışıyor mu kontrol edin.");
      }
    };

    // Profil getirme fonksiyonunu çalıştırıyoruz
    getProfile();
  }, []);

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    // localStorage içindeki token'ı siliyoruz
    localStorage.removeItem("token");

    // Kullanıcıyı login sayfasına yönlendiriyoruz
    router.push("/login");
  };

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1 style={styles.title}>Dashboard</h1>

        {user ? (
          <>
            <p style={styles.text}>
              Hoş geldin, {user.firstName} {user.lastName}
            </p>

            <p style={styles.text}>
              Email: {user.email}
            </p>

            <button style={styles.button} onClick={handleLogout}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <p style={styles.text}>{message}</p>

            <button style={styles.button} onClick={() => router.push("/login")}>
              Giriş Yap
            </button>
          </>
        )}
      </section>
    </main>
  );
}

// Sayfanın basit görünüm ayarları
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  card: {
    width: "380px",
    padding: "24px",
    borderRadius: "12px",
    backgroundColor: "white",
    color: "#111827",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  },
  title: {
    marginBottom: "16px",
    color: "#111827",
  },
  text: {
    fontSize: "16px",
    marginBottom: "12px",
    color: "#111827",
  },
  button: {
    marginTop: "12px",
    padding: "12px",
    width: "100%",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};