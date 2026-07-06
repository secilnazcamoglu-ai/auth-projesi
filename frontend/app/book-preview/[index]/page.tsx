"use client";

// URL'deki kitap index değerini almak için kullanıyoruz
import { useParams, useRouter } from "next/navigation";

// Sayfa açılınca localStorage'dan kitapları almak için kullanıyoruz
import { useEffect, useState } from "react";

// Kitabın okuma durumunu belirlemek için özel tip oluşturuyoruz
type BookStatus = "okunacak" | "okunuyor" | "okundu";

// Kitap tipi
type Book = {
  title: string;
  author: string;
  rating: string;
  comment: string;
  status: BookStatus;
  month: number;
};

// Ay isimleri
const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

// Durumların ekranda görünecek isimleri
const statusLabels = {
  okunacak: "Okunacak",
  okunuyor: "Okunuyor",
  okundu: "Okundu",
};

// Durum renkleri
const statusColors = {
  okunacak: "#d7b98e",
  okunuyor: "#c79545",
  okundu: "#6b3e26",
};

export default function BookPreviewPage() {
  // URL'deki index bilgisini alıyoruz
  const params = useParams();

  // Sayfa yönlendirmesi için kullanıyoruz
  const router = useRouter();

  // Seçilen kitabı tutuyoruz
  const [book, setBook] = useState<Book | null>(null);

  // Hata veya başarı mesajı için kullanıyoruz
  const [message, setMessage] = useState("");

  // Düzenleme modu açık mı kapalı mı bunu tutuyoruz
  const [isEditing, setIsEditing] = useState(false);

  // Düzenleme formundaki bilgileri tutuyoruz
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<BookStatus>("okunacak");
  const [month, setMonth] = useState(String(new Date().getMonth()));

  useEffect(() => {
    // localStorage'dan kitap listesini alıyoruz
    const savedBooks = localStorage.getItem("books");

    if (!savedBooks) {
      setMessage("Kayıtlı kitap bulunamadı.");
      return;
    }

    try {
      // Kitapları JSON'dan diziye çeviriyoruz
      const books: Book[] = JSON.parse(savedBooks);

      // URL'den gelen index değerini sayıya çeviriyoruz
      const bookIndex = Number(params.index);

      // Eğer index geçersizse hata gösteriyoruz
      if (Number.isNaN(bookIndex) || !books[bookIndex]) {
        setMessage("Kitap bulunamadı.");
        return;
      }

      // Seçilen kitabı state'e kaydediyoruz
      const selectedBook = books[bookIndex];

      setBook(selectedBook);

      // Düzenleme formunu da seçilen kitabın bilgileriyle dolduruyoruz
      setTitle(selectedBook.title);
      setAuthor(selectedBook.author);
      setRating(selectedBook.rating);
      setComment(selectedBook.comment);
      setStatus(selectedBook.status);
      setMonth(String(selectedBook.month));
    } catch (error) {
      setMessage("Kitap bilgileri okunurken bir hata oluştu.");
    }
  }, [params.index]);

  // Kitap bilgilerini güncelleme işlemi
  const handleUpdateBook = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author) {
      setMessage("Kitap adı ve yazar alanları boş bırakılamaz.");
      return;
    }

    const savedBooks = localStorage.getItem("books");

    if (!savedBooks) {
      setMessage("Kitap listesi bulunamadı.");
      return;
    }

    try {
      const books: Book[] = JSON.parse(savedBooks);
      const bookIndex = Number(params.index);

      if (Number.isNaN(bookIndex) || !books[bookIndex]) {
        setMessage("Güncellenecek kitap bulunamadı.");
        return;
      }

      const updatedBook: Book = {
        title,
        author,
        rating,
        comment,
        status,
        month: Number(month),
      };

      // Seçilen kitabı güncelliyoruz
      books[bookIndex] = updatedBook;

      // Güncel kitap listesini localStorage'a kaydediyoruz
      localStorage.setItem("books", JSON.stringify(books));

      // Ekrandaki bilgileri de güncelliyoruz
      setBook(updatedBook);

      // Düzenleme modunu kapatıyoruz
      setIsEditing(false);

      setMessage("Kitap bilgileri başarıyla güncellendi.");
    } catch (error) {
      setMessage("Kitap güncellenirken bir hata oluştu.");
    }
  };

  return (
    <main style={styles.container}>
      <section style={styles.overlayCard}>
        <p style={styles.smallText}>Kitap Kulübü</p>

        <h1 style={styles.title}>
          {isEditing ? "Kitabı Düzenle" : "Kitap Önizleme"}
        </h1>

        {book ? (
          <>
            {!isEditing ? (
              <>
                <div style={styles.bookHeader}>
                  <div style={styles.fakeBookCover}>
                    <span style={styles.coverText}>{book.title}</span>
                  </div>

                  <div style={styles.bookInfo}>
                    <h2 style={styles.bookTitle}>{book.title}</h2>

                    <p style={styles.author}>
                      <strong>Yazar:</strong> {book.author}
                    </p>

                    <p style={styles.infoText}>
                      <strong>Ay:</strong> {monthNames[book.month]}
                    </p>

                    <div style={styles.statusRow}>
                      <span
                        style={{
                          ...styles.statusDot,
                          backgroundColor: statusColors[book.status],
                        }}
                      ></span>

                      <span style={styles.statusText}>
                        {statusLabels[book.status]}
                      </span>
                    </div>

                    <p style={styles.stars}>
                      {"★".repeat(Number(book.rating) || 0)}
                      {"☆".repeat(5 - (Number(book.rating) || 0))}
                    </p>
                  </div>
                </div>

                <div style={styles.commentBox}>
                  <p style={styles.commentLabel}>Yorum</p>

                  <p style={styles.commentText}>
                    {book.comment
                      ? book.comment
                      : "Bu kitap için henüz yorum eklenmedi."}
                  </p>
                </div>

                {message && <p style={styles.successMessage}>{message}</p>}

                <div style={styles.buttonRow}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => router.push("/dashboard")}
                  >
                    Okuma Paneline Dön
                  </button>

                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={() => setIsEditing(true)}
                  >
                    Kitabı Düzenle
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdateBook} style={styles.editForm}>
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

                <select
                  style={styles.input}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookStatus)}
                >
                  <option value="okunacak">Okunacak</option>
                  <option value="okunuyor">Okunuyor</option>
                  <option value="okundu">Okundu</option>
                </select>

                <select
                  style={styles.input}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {monthNames.map((monthName, index) => (
                    <option key={monthName} value={index}>
                      {monthName}
                    </option>
                  ))}
                </select>

                <div style={styles.ratingArea}>
                  <p style={styles.ratingLabel}>Puan</p>

                  <div style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(String(star))}
                        style={styles.starButton}
                      >
                        {Number(rating) >= star ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  style={styles.textarea}
                  placeholder="Kitap hakkındaki yorumun"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {message && <p style={styles.errorText}>{message}</p>}

                <div style={styles.buttonRow}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => {
                      if (book) {
                        setTitle(book.title);
                        setAuthor(book.author);
                        setRating(book.rating);
                        setComment(book.comment);
                        setStatus(book.status);
                        setMonth(String(book.month));
                      }

                      setIsEditing(false);
                      setMessage("");
                    }}
                  >
                    Vazgeç
                  </button>

                  <button style={styles.primaryButton} type="submit">
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <>
            <p style={styles.errorText}>{message}</p>

            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => router.push("/dashboard")}
            >
              Okuma Paneline Dön
            </button>
          </>
        )}
      </section>
    </main>
  );
}

// Sayfa tasarım ayarları
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    backgroundImage:
      "linear-gradient(rgba(15, 9, 5, 0.52), rgba(15, 9, 5, 0.78)), url('/bookshelf-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  overlayCard: {
    width: "760px",
    maxWidth: "100%",
    padding: "36px",
    borderRadius: "20px",
    color: "#3f2b1d",
    background:
      "linear-gradient(135deg, rgba(238, 221, 185, 0.97) 0%, rgba(248, 236, 207, 0.97) 48%, rgba(218, 194, 151, 0.97) 100%)",
    border: "1px solid rgba(151, 105, 55, 0.75)",
    boxShadow:
      "0 30px 80px rgba(0,0,0,0.58), inset 0 0 26px rgba(120, 84, 48, 0.16)",
  },

  smallText: {
    margin: "0 0 8px 0",
    color: "#8b5d2f",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
  },

  title: {
    margin: "0 0 26px 0",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "38px",
  },

  bookHeader: {
    display: "flex",
    gap: "26px",
    alignItems: "stretch",
    marginBottom: "24px",
  },

  fakeBookCover: {
    width: "150px",
    minWidth: "150px",
    minHeight: "220px",
    borderRadius: "10px 16px 16px 10px",
    background:
      "linear-gradient(90deg, #5d3724 0%, #7a4a2d 38%, #8b5e34 100%)",
    boxShadow:
      "inset 10px 0 14px rgba(255,255,255,0.08), inset -10px 0 14px rgba(0,0,0,0.25), 0 16px 30px rgba(70, 40, 15, 0.28)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px",
    border: "1px solid rgba(255,255,255,0.16)",
  },

  coverText: {
    writingMode: "vertical-rl" as const,
    transform: "rotate(180deg)",
    color: "#f6e6c8",
    fontSize: "18px",
    fontWeight: "900",
    textAlign: "center" as const,
    fontFamily: "Georgia, 'Times New Roman', serif",
  },

  bookInfo: {
    flex: 1,
    padding: "18px",
    borderRadius: "14px",
    backgroundColor: "rgba(120, 84, 48, 0.10)",
    border: "1px solid rgba(139, 93, 47, 0.18)",
  },

  bookTitle: {
    margin: "0 0 12px 0",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "30px",
    lineHeight: "1.2",
  },

  author: {
    margin: "0 0 10px 0",
    color: "#5f4028",
    fontSize: "16px",
  },

  infoText: {
    margin: "0 0 10px 0",
    color: "#5f4028",
    fontSize: "16px",
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "10px 0",
  },

  statusDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    display: "inline-block",
  },

  statusText: {
    color: "#5f4028",
    fontSize: "16px",
    fontWeight: "800",
  },

  stars: {
    margin: "14px 0 0 0",
    color: "#9b7447",
    fontSize: "26px",
    letterSpacing: "2px",
  },

  commentBox: {
    padding: "18px",
    borderRadius: "14px",
    backgroundColor: "rgba(120, 84, 48, 0.10)",
    border: "1px solid rgba(139, 93, 47, 0.18)",
    marginBottom: "24px",
  },

  commentLabel: {
    margin: "0 0 8px 0",
    color: "#8b5d2f",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
  },

  commentText: {
    margin: 0,
    color: "#5f4028",
    fontSize: "16px",
    lineHeight: "1.7",
    fontStyle: "italic",
  },

  editForm: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },

  input: {
    padding: "13px",
    borderRadius: "8px",
    border: "1px solid #b99972",
    fontSize: "15px",
    color: "#3b2415",
    backgroundColor: "#f3ead8",
    outline: "none",
  },

  ratingArea: {
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "rgba(120, 84, 48, 0.10)",
    border: "1px solid rgba(185, 151, 107, 0.55)",
  },

  ratingLabel: {
    margin: "0 0 6px 0",
    color: "#6a4a31",
    fontSize: "14px",
    fontWeight: "800",
  },

  starRow: {
    display: "flex",
    gap: "4px",
  },

  starButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#9b7447",
    fontSize: "30px",
    cursor: "pointer",
    padding: "0 2px",
    lineHeight: "1",
  },

  textarea: {
    minHeight: "100px",
    padding: "13px",
    borderRadius: "8px",
    border: "1px solid #b99972",
    fontSize: "15px",
    color: "#3b2415",
    backgroundColor: "#f3ead8",
    outline: "none",
    resize: "none" as const,
    fontFamily: "Arial, sans-serif",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },

  primaryButton: {
    padding: "13px 18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#8a6238",
    color: "white",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(70, 40, 15, 0.22)",
  },

  secondaryButton: {
    padding: "13px 18px",
    borderRadius: "10px",
    border: "1px solid #b99972",
    backgroundColor: "transparent",
    color: "#8a6238",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  errorText: {
    color: "#7a2e1f",
    fontSize: "16px",
    fontWeight: "800",
    marginBottom: "20px",
  },

  successMessage: {
    color: "#5f4028",
    backgroundColor: "rgba(120, 84, 48, 0.10)",
    border: "1px solid rgba(139, 93, 47, 0.20)",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "800",
    marginBottom: "18px",
  },
};