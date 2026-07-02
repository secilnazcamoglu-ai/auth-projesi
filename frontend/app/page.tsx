// Sayfalar arasında geçiş yapmak için Link kullanıyoruz
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={styles.container}>
      {/* Üst menü */}
      <header style={styles.navbar}>
        <div style={styles.logo}>Kitap Kulübü</div>
      
      </header>

      {/* Ana içerik */}
      <section style={styles.hero}>
        {/* Sol parşömen alanı */}
        <div style={styles.parchment}>
          <p style={styles.parchmentLabel}>Kulübün Amacı</p>

          <h1 style={styles.parchmentTitle}>
            Okuma yolculuğunu tek yerde topla
          </h1>

          <p style={styles.parchmentText}>
            Kitap Kulübü, kullanıcıların okudukları kitapları takip
            edebilecekleri, kitaplara puan verebilecekleri ve yorumlarını
            paylaşabilecekleri bir platform olarak tasarlanmıştır.
          </p>

          <p style={styles.parchmentText}>
            Eğer bir kitap seriden oluşuyorsa, serinin devam kitabı çıktığında
            kullanıcılar bildirim alarak yeni kitabı kaçırmadan takip
            edebilirler.
          </p>

          <div style={styles.features}>
            <span style={styles.featureItem}>📚 Kitap takibi</span>
            <span style={styles.featureItem}>⭐ Puanlama</span>
            <span style={styles.featureItem}>💬 Yorum paylaşımı</span>
            <span style={styles.featureItem}>🔔 Seri bildirimi</span>
          </div>
        </div>

        {/* Sağ karşılama alanı */}
        <div style={styles.welcomeArea}>
          <p style={styles.smallText}>READ • SHARE • BELONG</p>

          <h2 style={styles.welcomeTitle}>
            Kitap Kulübüne Hoş Geldiniz
          </h2>

          <p style={styles.welcomeText}>
            Okuduğun kitapları kaydet, düşüncelerini paylaş ve kitap dünyasında
            kendi rafını oluştur.
          </p>

          <div style={styles.heroButtons}>
            <Link href="/register" style={styles.primaryHeroButton}>
              Kulübe Katıl
            </Link>

            <Link href="/login" style={styles.secondaryHeroButton}>
              Hesabına Giriş Yap
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    position: "relative" as const,
    overflow: "hidden",
    padding: "28px",

    backgroundImage:
      "linear-gradient(rgba(15, 9, 5, 0.48), rgba(15, 9, 5, 0.72)), url('/bookshelf-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  navbar: {
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  position: "relative" as const,
  zIndex: 2,
},

  logo: {
    color: "#f6e6c8",
    fontSize: "26px",
    fontWeight: "800",
    fontFamily: "Georgia, 'Times New Roman', serif",
    letterSpacing: "1px",
    textShadow: "0 3px 12px rgba(0,0,0,0.45)",
  },


  hero: {
    minHeight: "calc(100vh - 86px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "48px",
    position: "relative" as const,
    zIndex: 1,
    maxWidth: "1180px",
    margin: "0 auto",
  },

  parchment: {
    width: "480px",
    padding: "38px",
    borderRadius: "12px",
    position: "relative" as const,
    color: "#3f2b1d",
    background:
      "linear-gradient(135deg, rgba(238, 221, 185, 0.96) 0%, rgba(248, 236, 207, 0.96) 48%, rgba(218, 194, 151, 0.96) 100%)",
    border: "1px solid rgba(151, 105, 55, 0.65)",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.42), inset 0 0 28px rgba(120, 84, 48, 0.16)",
  },

  parchmentLabel: {
    margin: "0 0 12px 0",
    color: "#8b5d2f",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
  },

  parchmentTitle: {
    margin: "0 0 18px 0",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "34px",
    lineHeight: "1.15",
  },

  parchmentText: {
    color: "#5f4028",
    fontSize: "16px",
    lineHeight: "1.8",
    margin: "0 0 14px 0",
  },

  features: {
    marginTop: "22px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  featureItem: {
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "rgba(120, 84, 48, 0.10)",
    color: "#4a2f1d",
    fontSize: "14px",
    fontWeight: "700",
  },

  welcomeArea: {
    width: "520px",
    color: "#f9ead0",
    textAlign: "left" as const,
    textShadow: "0 4px 18px rgba(0,0,0,0.55)",
  },

  smallText: {
    margin: "0 0 14px 0",
    color: "#d7b98e",
    fontSize: "14px",
    fontWeight: "800",
    letterSpacing: "4px",
  },

  welcomeTitle: {
    margin: "0 0 18px 0",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "58px",
    lineHeight: "1.08",
    color: "#fff4dc",
  },

  welcomeText: {
    margin: "0 0 28px 0",
    color: "#f0d8b3",
    fontSize: "18px",
    lineHeight: "1.7",
    maxWidth: "480px",
  },

  heroButtons: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },

  primaryHeroButton: {
    padding: "14px 24px",
    borderRadius: "10px",
    backgroundColor: "#8a6238",
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "800",
    boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
  },

  secondaryHeroButton: {
    padding: "14px 24px",
    borderRadius: "10px",
    border: "1px solid rgba(246, 230, 200, 0.75)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#f6e6c8",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "800",
    backdropFilter: "blur(8px)",
  },
};