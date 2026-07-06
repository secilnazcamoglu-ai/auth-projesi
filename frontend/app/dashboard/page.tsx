"use client";

// Sayfa açıldığında token kontrolü, kullanıcı bilgisi ve kitapları almak için kullanıyoruz
import { useEffect, useMemo, useState } from "react";

// Sayfa yönlendirmesi yapmak için kullanıyoruz
import { useRouter } from "next/navigation";

// Kitabın okuma durumunu belirlemek için özel tip oluşturuyoruz
type BookStatus = "okunacak" | "okunuyor" | "okundu";

// Kitap tipi oluşturuyoruz
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

// Kitap sırtları için daha nostaljik kahverengi tonları
const bookColors = [
  "#6b3e26",
  "#7a4a2d",
  "#8b5e34",
  "#5d3724",
  "#9a6a43",
  "#70452b",
  "#85603d",
  "#5a3220",
  "#7f5539",
  "#6f4e37",
];

// Kitap durumlarının ekranda görünen isimleri
const statusLabels = {
  okunacak: "Okunacak",
  okunuyor: "Okunuyor",
  okundu: "Okundu",
};

// Kitap durumlarının etiket renkleri
const statusColors = {
  okunacak: "#d7b98e",
  okunuyor: "#c79545",
  okundu: "#6b3e26",
};

export default function DashboardPage() {
  // Backend'den gelen kullanıcı bilgisini tutar
  const [user, setUser] = useState<any>(null);

  // Kullanıcının eklediği kitapları tutar
  const [books, setBooks] = useState<Book[]>([]);

  // Hata veya bilgi mesajı göstermek için kullanılır
  const [message, setMessage] = useState("");

  // Kitap ekleme pop-up açık mı kapalı mı bunu tutar
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Kitabın üzerine gelince önizleme göstermek için kullanılır
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null);

  // Düzenleme modunda hangi kitabın düzenlendiğini tutar
  const [editingBookIndex, setEditingBookIndex] = useState<number | null>(null);

  // Aylık okuma hedefini tutar
  const [monthlyGoal, setMonthlyGoal] = useState("4");

  // Kitap ekleme formundaki bilgileri tutar
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>("okunacak");
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth())
  );

  // Sayfa yönlendirmesi yapmak için kullanılır
  const router = useRouter();

  // Sayfa ilk açıldığında token kontrolü yapılır
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Token yoksa kullanıcı login sayfasına gönderilir
    if (!token) {
      router.push("/login");
      return;
    }

    // Backend'den kullanıcı bilgisi çekilir
    const getProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        setMessage("Bir hata oluştu. Backend çalışıyor mu kontrol edin.");
      }
    };

    getProfile();

    // localStorage içindeki kitapları alıyoruz
    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
      try {
        const parsedBooks = JSON.parse(savedBooks);

        // Eski eklenen kitaplarda status veya month yoksa onları tamamlıyoruz
        const normalizedBooks: Book[] = parsedBooks.map((book: any) => ({
          title: book.title || "",
          author: book.author || "",
          rating: book.rating || "",
          comment: book.comment || "",
          status: book.status || "okunacak",
          month:
            typeof book.month === "number"
              ? book.month
              : new Date().getMonth(),
        }));

        setBooks(normalizedBooks);
        localStorage.setItem("books", JSON.stringify(normalizedBooks));
      } catch {
        setBooks([]);
      }
    }

    // Daha önce kaydedilen aylık hedef varsa onu alıyoruz
    const savedGoal = localStorage.getItem("monthlyGoal");

    if (savedGoal) {
      setMonthlyGoal(savedGoal);
    }
  }, [router]);

  // Çıkış yapma işlemi
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Kitap ekleme pop-up'ını açar
  const openModal = () => {
    setMessage("");
    setEditingBookIndex(null);
    setIsModalOpen(true);
  };

  // Kitap düzenleme pop-up'ını açar ve formu doldurur
  const openEditModal = (book: Book, index: number) => {
    setMessage("");

    setEditingBookIndex(index);

    setTitle(book.title);
    setAuthor(book.author);
    setRating(book.rating);
    setComment(book.comment);
    setSelectedStatus(book.status);
    setSelectedMonth(String(book.month));

    setIsModalOpen(true);
  };

  // Kitap ekleme pop-up'ını kapatır
  const closeModal = () => {
    setIsModalOpen(false);

    setTitle("");
    setAuthor("");
    setRating("");
    setComment("");
    setSelectedStatus("okunacak");
    setSelectedMonth(String(new Date().getMonth()));
    setEditingBookIndex(null);
  };

  // Kitap ekleme işlemi
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author) {
      setMessage("Lütfen kitap adı ve yazar alanlarını doldurun.");
      return;
    }

    const bookData: Book = {
      title,
      author,
      rating,
      comment,
      status: selectedStatus,
      month: Number(selectedMonth),
    };

    let updatedBooks: Book[];

    if (editingBookIndex !== null) {
      updatedBooks = books.map((book, index) =>
        index === editingBookIndex ? bookData : book
      );

      setMessage("Kitap bilgileri başarıyla güncellendi.");
    } else {
      updatedBooks = [...books, bookData];

      setMessage("Kitap başarıyla kitaplığa eklendi.");
    }

    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));

    closeModal();
  };

  // Son eklenen kitabı kitaplıktan çıkarır
  const handleRemoveLastBook = () => {
    if (books.length === 0) {
      setMessage("Kitaplıkta çıkarılacak kitap yok.");
      return;
    }

    const updatedBooks = books.slice(0, -1);

    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    setMessage("Son kitap kitaplıktan çıkarıldı.");
  };

  // Aylık hedef değişince hem state'e hem localStorage'a kaydediyoruz
  const handleGoalChange = (value: string) => {
    setMonthlyGoal(value);
    localStorage.setItem("monthlyGoal", value);
  };

  // Bulunduğumuz ayı alıyoruz
  const currentMonth = new Date().getMonth();

  // Gösterilecek ayları hesaplıyoruz
  const visibleMonthIndexes = useMemo(() => {
    // Normalde bulunduğumuz aydan Aralık ayına kadar gösteriyoruz
    const monthsFromNow = monthNames
      .map((_, index) => index)
      .filter((index) => index >= currentMonth);

    // Eğer geçmiş aylara kitap eklendiyse, o ayları da gösteriyoruz
    const pastMonthsWithBooks = books
      .map((book) => book.month)
      .filter((month) => month < currentMonth);

    // Tekrar eden ayları kaldırıyoruz ve küçükten büyüğe sıralıyoruz
    return Array.from(new Set([...pastMonthsWithBooks, ...monthsFromNow])).sort(
      (a, b) => a - b
    );
  }, [books, currentMonth]);

  // Kitapları aylara göre grupluyoruz
  const groupedBooks = useMemo(() => {
    return visibleMonthIndexes.map((monthIndex) => ({
      monthName: monthNames[monthIndex],
      monthIndex,
      items: books.filter((book) => book.month === monthIndex),
    }));
  }, [books, visibleMonthIndexes]);

  // Bu ay okundu olarak işaretlenen kitapları hesaplıyoruz
  const currentMonthReadBooks = books.filter(
    (book) => book.month === currentMonth && book.status === "okundu"
  );

  // Aylık hedef sayıya çevriliyor
  const monthlyGoalNumber = Number(monthlyGoal) || 0;

  // Hedefin yüzde kaçının tamamlandığını hesaplıyoruz
  const monthlyProgress =
    monthlyGoalNumber > 0
      ? Math.min(
          100,
          Math.round((currentMonthReadBooks.length / monthlyGoalNumber) * 100)
        )
      : 0;

  // Topluluk yorumları için örnek veriler
  const communityComments = [
    {
      name: "Ayşe",
      book: "Kürk Mantolu Madonna",
      text: "Kitabın dili çok sade ama etkisi oldukça güçlüydü.",
      rating: 5,
    },
    {
      name: "Mehmet",
      book: "Hayvan Çiftliği",
      text: "Kısa olmasına rağmen düşündüren bir kitap.",
      rating: 4,
    },
    {
      name: "Zeynep",
      book: "Dune",
      text: "Dünya kurgusu çok etkileyiciydi, seriye devam edeceğim.",
      rating: 5,
    },
    {
      name: "Elif",
      book: "Simyacı",
      text: "Okuması kolay ve motive edici bir kitaptı.",
      rating: 4,
    },
    {
      name: "Can",
      book: "1984",
      text: "Atmosferi oldukça karanlık ama etkileyiciydi.",
      rating: 5,
    },
  ];

  return (
    <main style={styles.container}>
      {/* Üst alan */}
      <header style={styles.header}>
        <div>
          <p style={styles.smallText}>Kitap Kulübü</p>
          <h1 style={styles.logoTitle}>Okuma Paneli</h1>
        </div>

        <div style={styles.topRightArea}>
          <div style={styles.userMiniCard}>
            <p style={styles.userMiniLabel}>Üye Bilgileri</p>

            {user ? (
              <>
                <p style={styles.userMiniName}>
                  {user.firstName} {user.lastName}
                </p>

                <p style={styles.userMiniEmail}>{user.email}</p>
              </>
            ) : (
              <p style={styles.userMiniEmail}>Yükleniyor...</p>
            )}
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Ana dashboard alanı */}
      <section style={styles.dashboardArea}>
        {/* Sol kitaplık alanı */}
        <div style={styles.libraryArea}>
          <div style={styles.libraryHeader}>
            <div>
              <p style={styles.cardLabel}>Benim Kitaplığım</p>
              <h2 style={styles.libraryTitle}>Okuma Rafım</h2>
            </div>

            <div style={styles.libraryButtons}>
              <button onClick={openModal} style={styles.addBookButton}>
                Kitap Ekle
              </button>

              <button
                onClick={handleRemoveLastBook}
                style={styles.removeBookButton}
              >
                Son Kitabı Çıkar
              </button>
            </div>
          </div>

          {/* Durum açıklamaları */}
          <div style={styles.statusInfoRow}>
            <span style={styles.statusInfoItem}>
              <span
                style={{
                  ...styles.statusDot,
                  backgroundColor: statusColors.okunacak,
                }}
              ></span>
              Okunacak
            </span>

            <span style={styles.statusInfoItem}>
              <span
                style={{
                  ...styles.statusDot,
                  backgroundColor: statusColors.okunuyor,
                }}
              ></span>
              Okunuyor
            </span>

            <span style={styles.statusInfoItem}>
              <span
                style={{
                  ...styles.statusDot,
                  backgroundColor: statusColors.okundu,
                }}
              ></span>
              Okundu
            </span>
          </div>

          {/* Kitaplık */}
          <div style={styles.bookshelfContainer}>
            {groupedBooks.map((group) => (
              <div key={group.monthIndex} style={styles.monthShelfBlock}>
                <div style={styles.monthHeader}>
                  <span style={styles.monthBadge}>{group.monthName}</span>
                </div>

                <div style={styles.shelfBoard}>
                  <div style={styles.shelfBooksScroller}>
                   
  {group.items.length > 0 ? (
  group.items.map((book, index) => {
    const realBookIndex = books.findIndex(
      (item) =>
        item.title === book.title &&
        item.author === book.author &&
        item.month === book.month &&
        item.status === book.status
    );

    // Kitabın üzerine gelince tooltip göstermek için
    return (
     <div
  key={`${group.monthIndex}-${index}-${book.title}`}
  style={{
    ...styles.bookSpine,
    backgroundColor:
      bookColors[(group.monthIndex + index) % bookColors.length],
  }}
  onClick={() => router.push(`/book-preview/${realBookIndex}`)}
>
        <span
          style={{
            ...styles.bookStatusMark,
            backgroundColor: statusColors[book.status],
          }}
        ></span>

        <span style={styles.bookTitle}>{book.title}</span>

        {hoveredBook === book && (
          <div style={styles.bookTooltip}>
            <p style={styles.tooltipLabel}>Kitap Önizleme</p>

            <h3 style={styles.tooltipTitle}>{book.title}</h3>

            <p style={styles.tooltipText}>
              <strong>Yazar:</strong> {book.author}
            </p>

            <p style={styles.tooltipText}>
              <strong>Durum:</strong> {statusLabels[book.status]}
            </p>

            <p style={styles.tooltipStars}>
              {"★".repeat(Number(book.rating) || 0)}
              {"☆".repeat(5 - (Number(book.rating) || 0))}
            </p>

            {book.comment && (
              <p style={styles.tooltipComment}>{book.comment}</p>
            )}

            <button
              type="button"
              style={styles.tooltipEditButton}
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(book, realBookIndex);
              }}
            >
              Düzenle
            </button>
          </div>
        )}
      </div>
    );
  })
) : (
  <div style={styles.emptyMonthText}>Bu ay için kitap eklenmedi.</div>
)}
                  </div>

                  <div style={styles.shelfWood}></div>
                </div>
              </div>
            ))}
          </div>

          
          {message && <p style={styles.message}>{message}</p>}
        </div>

        {/* Sağ taraf */}
        <div style={styles.rightColumn}>
          {/* Aylık okuma hedefi paneli */}
          <section style={styles.goalPanel}>
            <p style={styles.cardLabel}>Aylık Hedef</p>

            <h2 style={styles.goalTitle}>
              {monthNames[currentMonth]} Okuma Hedefi
            </h2>

            <p style={styles.goalText}>
              Bu ay okundu olarak işaretlediğin kitap sayısı:
            </p>

            <div style={styles.goalNumbers}>
              <span style={styles.readCount}>
                {currentMonthReadBooks.length}
              </span>

              <span style={styles.goalSlash}>/</span>

              <input
                style={styles.goalInput}
                type="number"
                min="1"
                value={monthlyGoal}
                onChange={(e) => handleGoalChange(e.target.value)}
              />
            </div>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${monthlyProgress}%`,
                }}
              ></div>
            </div>

            <p style={styles.goalPercent}>
              Hedefin %{monthlyProgress} tamamlandı.
            </p>
          </section>

          {/* Topluluk yorumları alanı */}
          <aside style={styles.communityPanel}>
            <p style={styles.cardLabel}>Topluluk</p>

            <h2 style={styles.communityTitle}>Son Yorumlar</h2>

            <p style={styles.communityDescription}>
              Diğer kullanıcıların kitaplar hakkındaki düşüncelerini buradan
              takip edebilirsin.
            </p>

            <div className="comment-scroll" style={styles.commentList}>
              {communityComments.map((commentItem, index) => (
                <div key={index} style={styles.commentCard}>
                  <div style={styles.commentHeader}>
                    <strong style={styles.commentName}>
                      {commentItem.name}
                    </strong>

                    <span style={styles.commentStars}>
                      {"★".repeat(commentItem.rating)}
                      {"☆".repeat(5 - commentItem.rating)}
                    </span>
                  </div>

                  <p style={styles.commentBook}>{commentItem.book}</p>

                  <p style={styles.commentText}>{commentItem.text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Kitap ekleme pop-up alanı */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <form onSubmit={handleAddBook} style={styles.modalCard}>
            <button type="button" onClick={closeModal} style={styles.closeButton}>
              ×
            </button>

            <p style={styles.modalLabel}>Kitap Kulübü</p>

            <h2 style={styles.modalTitle}>
  {editingBookIndex !== null ? "Kitabı Düzenle" : "Yeni Kitap Ekle"}
            </h2>

            <p style={styles.modalDescription}>
              Kitap bilgilerini gir, okuma durumunu seç ve kitabı rafına ekle.
            </p>

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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as BookStatus)}
            >
              <option value="okunacak">Okunacak</option>
              <option value="okunuyor">Okunuyor</option>
              <option value="okundu">Okundu</option>
            </select>

            <select
              style={styles.input}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            {/* Yıldızlı puanlama */}
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

            <button style={styles.modalButton} type="submit">
        {editingBookIndex !== null ? "Kitabı Güncelle" : "Kitabı Rafıma Ekle"}
            </button>

            <button type="button" onClick={closeModal} style={styles.backButton}>
              Okuma Paneline Dön
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

// Dashboard sayfası görünüm ayarları
const styles = {
  container: {
    minHeight: "100vh",
    padding: "28px",
    position: "relative" as const,
    overflow: "hidden",

    backgroundImage:
      "linear-gradient(rgba(15, 9, 5, 0.50), rgba(15, 9, 5, 0.78)), url('/bookshelf-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  header: {
    maxWidth: "1240px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  },

  smallText: {
    margin: "0 0 6px 0",
    color: "#d7b98e",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "4px",
    textTransform: "uppercase" as const,
    textShadow: "0 3px 14px rgba(0,0,0,0.5)",
  },

  logoTitle: {
    margin: 0,
    color: "#fff4dc",
    fontSize: "34px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    textShadow: "0 4px 18px rgba(0,0,0,0.55)",
  },

 topRightArea: {
    display: "flex",
    alignItems: "stretch",
    gap: "14px",
},

 userMiniCard: {
  minWidth: "260px",
  minHeight: "72px",
  padding: "12px 16px",
  borderRadius: "12px",
  color: "#3f2b1d",
  background:
    "linear-gradient(135deg, rgba(238, 221, 185, 0.94) 0%, rgba(248, 236, 207, 0.94) 100%)",
  border: "1px solid rgba(151, 105, 55, 0.65)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.32)",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
},

  userMiniLabel: {
    margin: "0 0 4px 0",
    color: "#8b5d2f",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
  },

  userMiniName: {
    margin: "0 0 4px 0",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "19px",
    fontWeight: "700",
  },

  userMiniEmail: {
    margin: 0,
    color: "#5f4028",
    fontSize: "13px",
  },

 logoutButton: {
  minHeight: "72px",
  padding: "0 24px",
  borderRadius: "12px",
  border: "1px solid rgba(246, 230, 200, 0.55)",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  color: "#f6e6c8",
  fontSize: "15px",
  fontWeight: "800",
  cursor: "pointer",
  backdropFilter: "blur(8px)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.22)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

  dashboardArea: {
    maxWidth: "1240px",
    minHeight: "calc(100vh - 120px)",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.18fr 0.82fr",
    gap: "28px",
    alignItems: "start",
    paddingTop: "24px",
  },

  libraryArea: {
    padding: "28px",
    borderRadius: "18px",
    backgroundColor: "rgba(35, 20, 10, 0.45)",
    border: "1px solid rgba(246, 230, 200, 0.16)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.38)",
    backdropFilter: "blur(6px)",
  },

  libraryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    marginBottom: "16px",
  },

  cardLabel: {
    margin: "0 0 10px 0",
    color: "#b98a57",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
  },

  libraryTitle: {
    margin: 0,
    color: "#fff4dc",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "30px",
    textShadow: "0 4px 18px rgba(0,0,0,0.55)",
  },

  libraryButtons: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },

  addBookButton: {
    padding: "11px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#9b7447",
    color: "white",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.26)",
  },

  removeBookButton: {
    padding: "11px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(246, 230, 200, 0.55)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#f6e6c8",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  statusInfoRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
    marginBottom: "18px",
  },

  statusInfoItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#f6e6c8",
    fontSize: "13px",
    fontWeight: "700",
  },

  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  },

  bookshelfContainer: {
    maxHeight: "520px",
    overflowY: "auto" as const,
    padding: "18px",
    borderRadius: "16px",
    background:
      "linear-gradient(180deg, rgba(67, 38, 20, 0.96), rgba(49, 27, 15, 0.96))",
    border: "4px solid rgba(110, 66, 36, 0.95)",
    boxShadow:
      "inset 0 0 30px rgba(0,0,0,0.55), 0 18px 40px rgba(0,0,0,0.35)",
  },

  monthShelfBlock: {
    marginBottom: "18px",
  },

  monthHeader: {
    marginBottom: "8px",
  },

  monthBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    backgroundColor: "rgba(246, 230, 200, 0.12)",
    color: "#f4dec0",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  shelfBoard: {
    padding: "12px 12px 0 12px",
    borderRadius: "12px",
    backgroundColor: "rgba(0,0,0,0.12)",
  },

  shelfBooksScroller: {
    minHeight: "170px",
    display: "flex",
    alignItems: "flex-end",
    gap: "9px",
    overflowX: "auto" as const,
    overflowY: "visible" as const,
    padding: "50px 10px 8px 10px",
    whiteSpace: "nowrap" as const,
  },

  shelfWood: {
    height: "14px",
    borderRadius: "7px",
    background:
      "linear-gradient(90deg, #3d2314 0%, #5f3820 35%, #70452a 50%, #5f3820 70%, #3d2314 100%)",
    boxShadow: "0 8px 14px rgba(0,0,0,0.36)",
    marginTop: "8px",
  },

  bookSpine: {
    width: "50px",
    minWidth: "50px",
    height: "150px",
    borderRadius: "6px 6px 2px 2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 4px",
    border: "1px solid rgba(255,255,255,0.12)",
    position: "relative" as const,
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow:
      "inset 7px 0 9px rgba(255,255,255,0.08), inset -7px 0 9px rgba(0,0,0,0.24), 0 10px 16px rgba(0,0,0,0.34)",
  },

  bookStatusMark: {
    position: "absolute" as const,
    top: "7px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "22px",
    height: "6px",
    borderRadius: "999px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.28)",
  },

  bookTitle: {
    writingMode: "vertical-rl" as const,
    transform: "rotate(180deg)",
    color: "#f6e6c8",
    fontSize: "11px",
    fontWeight: "800",
    textAlign: "center" as const,
    maxHeight: "125px",
    overflow: "hidden",
  },

    bookTooltip: {
    position: "absolute" as const,
    bottom: "165px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "230px",
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "rgba(246, 230, 200, 0.98)",
    color: "#3f2b1d",
    boxShadow: "0 14px 34px rgba(0,0,0,0.42)",
    border: "1px solid rgba(151, 105, 55, 0.65)",
    zIndex: 50,
    whiteSpace: "normal" as const,
  },

  tooltipLabel: {
    margin: "0 0 6px 0",
    color: "#8b5d2f",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
  },

  tooltipTitle: {
    margin: "0 0 8px 0",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "18px",
  },

  tooltipText: {
    margin: "0 0 6px 0",
    color: "#5f4028",
    fontSize: "13px",
  },

  tooltipStars: {
    margin: "0 0 8px 0",
    color: "#9b7447",
    fontSize: "17px",
    letterSpacing: "1px",
  },

  tooltipComment: {
    margin: "0 0 10px 0",
    color: "#5f4028",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  tooltipEditButton: {
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#8a6238",
    color: "white",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
  },

  emptyMonthText: {
    color: "rgba(246, 230, 200, 0.72)",
    fontSize: "14px",
    padding: "18px 8px",
    fontStyle: "italic",
  },

  message: {
    marginTop: "14px",
    color: "#f6e6c8",
    fontWeight: "700",
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "18px",
  },

  goalPanel: {
    padding: "24px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(238, 221, 185, 0.95) 0%, rgba(248, 236, 207, 0.95) 48%, rgba(218, 194, 151, 0.95) 100%)",
    border: "1px solid rgba(151, 105, 55, 0.65)",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.36), inset 0 0 24px rgba(120, 84, 48, 0.14)",
  },

  goalTitle: {
    margin: "0 0 12px 0",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "27px",
  },

  goalText: {
    margin: "0 0 12px 0",
    color: "#6a4a31",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  goalNumbers: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },

  readCount: {
    color: "#4a2f1d",
    fontSize: "38px",
    fontWeight: "900",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },

  goalSlash: {
    color: "#8b5d2f",
    fontSize: "28px",
    fontWeight: "800",
  },

  goalInput: {
    width: "70px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #b99972",
    backgroundColor: "#f3ead8",
    color: "#3b2415",
    fontSize: "20px",
    fontWeight: "800",
    outline: "none",
    textAlign: "center" as const,
  },

  progressBar: {
    width: "100%",
    height: "12px",
    borderRadius: "999px",
    backgroundColor: "rgba(120, 84, 48, 0.18)",
    overflow: "hidden",
    marginBottom: "10px",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #8a6238 0%, #b98a57 100%)",
    transition: "width 0.3s ease",
  },

  goalPercent: {
    margin: 0,
    color: "#6a4a31",
    fontSize: "14px",
    fontWeight: "700",
  },

  communityPanel: {
    padding: "28px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(238, 221, 185, 0.95) 0%, rgba(248, 236, 207, 0.95) 48%, rgba(218, 194, 151, 0.95) 100%)",
    border: "1px solid rgba(151, 105, 55, 0.65)",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.42), inset 0 0 28px rgba(120, 84, 48, 0.16)",
  },

  communityTitle: {
    margin: "0 0 12px 0",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "32px",
  },

  communityDescription: {
    margin: "0 0 20px 0",
    color: "#6a4a31",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  commentList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    maxHeight: "300px",
    overflowY: "auto" as const,
    paddingRight: "6px",
  },

  commentCard: {
    padding: "18px",
    borderRadius: "12px",
    backgroundColor: "rgba(120, 84, 48, 0.10)",
    border: "1px solid rgba(139, 93, 47, 0.20)",
  },

  commentHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "8px",
  },

  commentName: {
    color: "#4a2f1d",
    fontSize: "15px",
  },

  commentStars: {
    color: "#9b7447",
    fontSize: "14px",
    letterSpacing: "1px",
  },

  commentBook: {
    margin: "0 0 8px 0",
    color: "#8b5d2f",
    fontWeight: "800",
    fontSize: "15px",
  },

  commentText: {
    margin: 0,
    color: "#5f4028",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 10,
    backgroundColor: "rgba(10, 5, 2, 0.72)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
  },

  modalCard: {
    width: "460px",
    position: "relative" as const,
    padding: "34px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "13px",
    color: "#3f2b1d",
    background:
      "linear-gradient(135deg, rgba(238, 221, 185, 0.98) 0%, rgba(248, 236, 207, 0.98) 48%, rgba(218, 194, 151, 0.98) 100%)",
    border: "1px solid rgba(151, 105, 55, 0.75)",
    boxShadow:
      "0 28px 70px rgba(0,0,0,0.55), inset 0 0 26px rgba(120, 84, 48, 0.16)",
  },

  closeButton: {
    position: "absolute" as const,
    top: "12px",
    right: "14px",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "rgba(120, 84, 48, 0.14)",
    color: "#4a2f1d",
    fontSize: "26px",
    cursor: "pointer",
    lineHeight: "30px",
  },

  modalLabel: {
    margin: "0",
    color: "#8b5d2f",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "3px",
    textTransform: "uppercase" as const,
  },

  modalTitle: {
    margin: "0",
    color: "#4a2f1d",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "32px",
  },

  modalDescription: {
    margin: "0 0 6px 0",
    color: "#6a4a31",
    fontSize: "15px",
    lineHeight: "1.6",
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
    minHeight: "88px",
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

  modalButton: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#8a6238",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "800",
    marginTop: "4px",
    boxShadow: "0 6px 18px rgba(70, 40, 15, 0.22)",
  },

  backButton: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #b99972",
    backgroundColor: "transparent",
    color: "#8a6238",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "800",
  
  bookTooltip: {
  position: "absolute" as const,
  bottom: "calc(100% + 16px)",
  left: "50%",
  transform: "translateX(-50%)",
  width: "240px",
  padding: "16px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, rgba(238, 221, 185, 0.98) 0%, rgba(248, 236, 207, 0.98) 48%, rgba(218, 194, 151, 0.98) 100%)",
  border: "1px solid rgba(151, 105, 55, 0.75)",
  boxShadow:
    "0 18px 42px rgba(0,0,0,0.50), inset 0 0 18px rgba(120, 84, 48, 0.12)",
  color: "#3f2b1d",
  pointerEvents: "auto" as const,
  zIndex: 999,
},

tooltipLabel: {
  margin: "0 0 8px 0",
  color: "#8b5d2f",
  fontSize: "11px",
  fontWeight: "900",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
},

tooltipTitle: {
  margin: "0 0 8px 0",
  color: "#4a2f1d",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "20px",
  lineHeight: "1.2",
},

tooltipText: {
  margin: "0 0 6px 0",
  color: "#5f4028",
  fontSize: "14px",
  lineHeight: "1.5",
},

tooltipStars: {
  margin: "8px 0",
  color: "#9b7447",
  fontSize: "19px",
  letterSpacing: "1px",
},

tooltipComment: {
  margin: "8px 0 12px 0",
  padding: "10px",
  borderRadius: "8px",
  backgroundColor: "rgba(120, 84, 48, 0.10)",
  color: "#6a4a31",
  fontSize: "13px",
  lineHeight: "1.5",
  fontStyle: "italic",
},

tooltipEditButton: {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#8a6238",
  color: "white",
  fontSize: "13px",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(70, 40, 15, 0.22)",
},
  
  
  
  
  },
};