"use client";

// Form bilgilerini tutmak için useState kullanıyoruz
import { useState } from "react";

// Dashboard sayfasına yönlendirmek için kullanıyoruz
import { useRouter } from "next/navigation";

// Dashboard'a geri dönmek için Link kullanıyoruz
import Link from "next/link";

// Kitap tipi oluşturuyoruz
type Book = {
  title: string;
  author: string;
  rating: string;
  comment: string;
};

export default function AddBookPage() {
  // Kitap adı
  const [title, setTitle] = useState("");

  // Yazar adı
  const [author, setAuthor] = useState("");

  // Kullanıcının verdiği puan
  const [rating, setRating] = useState("");

  // Kullanıcının kitap hakkındaki yorumu
  const [comment, setComment] = useState("");

  // Mesaj göstermek için kullanılır
  const [message, setMessage] = useState("");

  // Sayfa yönlendirmesi için kullanılır
  const router = useRouter();

  // Kitap ekleme işlemi
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();

    // Kitap adı ve yazar boş olmasın diye kontrol ediyoruz
    if (!title || !author) {
      setMessage("Lütfen kitap adı ve yazar alanlarını doldurun.");
      return;
    }

    // Yeni kitap nesnesi oluşturuyoruz
    const newBook: Book = {
      title,
      author,
      rating,
      comment,
    };

    // Daha önce kaydedilen kitapları localStorage'dan alıyoruz
    const savedBooks = localStorage.getItem("books");

    // Eğer kitap varsa JSON'dan diziye çeviriyoruz, yoksa boş dizi oluşturuyoruz
    const books: Book[] = savedBooks ? JSON.parse(savedBooks) : [];

    // Yeni kitabı listenin sonuna ekliyoruz
    books.push(newBook);

    // Güncel kitap listesini localStorage'a kaydediyoruz
    localStorage.setItem("books", JSON.stringify(books));

    // Formu temizliyoruz
    setTitle("");
    setAuthor("");
    setRating("");
    setComment("");

    setMessage("Kitap başarıyla kitaplığa eklendi.");

    // Kısa süre sonra dashboard sayfasına geri gönderiyoruz
    setTimeout(() => {
      router.push("/dashboard");
    }, 900);
  };

  return (
    <main style={styles.container}>
      <section style={styles.bookCard}>
        {/* Sol kitap sayfası */}
        <div style={styles.leftPage}>
          <p style={styles.smallText}>Kitap Kulübü</p>

          <h1 style={styles.welcomeTitle}>Yeni Kitap Ekle</h1>

          <p style={styles.welcomeText}>
            Okuduğun veya okumak istediğin kitabı rafına ekle. Böylece kişisel
            kitaplığını adım adım oluşturabilirsin.
          </p>

          <div style={styles.quoteBox}>
            <p style={styles.quote}>
              “Her raf, sahibinin okuma yolculuğundan izler taşır.”
            </p>
          </div>
        </div>

        {/* Kitabın orta çizgisi */}
        <div style={styles.pageDivider}></div>

        {/* Sağ kitap sayfası / kitap ekleme formu */}
        <form onSubmit={handleAddBook} style={styles.rightPage}>
          <h2 style={styles.title}>Kitap Bilgileri</h2>

          <input
            style={styles.input}
            type="text"
            placeholder="Kitap adı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Yazar adı"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            min="1"
            max="5"
            placeholder="Puan 1-5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Kitap hakkındaki yorumun"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button style={styles.button} type="submit">
            Kitabı Rafıma Ekle
          </button>

          {message && <p style={styles.message}>{message}</p>}

          <p style={styles.linkText}>
            <Link href="/dashboard" style={styles.link}>
              Dashboard'a dön
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

// Kitap ekleme sayfası görünüm ayarları
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    position: "relative" as const,
    overflow: "hidden",

    backgroundImage:
      "linear-gradient(rgba(15, 9, 5, 0.45), rgba(15, 9, 5, 0.68)), url('/bookshelf-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  bookCard: {
    width: "900px",
    minHeight: "560px",
    display: "flex",
    position: "relative" as const,
    borderRadius: "14px",
    overflow: "hidden",
    backgroundColor: "#eadfc8",
    border: "1px solid #b9976b",
    boxShadow: "0 24px 60px rgba(20, 10, 5, 0.45)",
  },

  leftPage: {
    width: "50%",
    padding: "48px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
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

  textarea: {
    minHeight: "90px",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #b99972",
    fontSize: "15px",
    color: "#3b2415",
    backgroundColor: "#f3ead8",
    outline: "none",
    resize: "none" as const,
    fontFamily: "Arial, sans-serif",
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
    fontWeight: "700",
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