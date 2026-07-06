# Kitap Kulübü - Node.js Auth Projesi

Bu proje, kullanıcıların kayıt olabildiği, giriş yapabildiği ve kendi kitaplıklarını yönetebildiği bir Kitap Kulübü uygulamasıdır.

Projede kullanıcı kimlik doğrulama işlemleri, şifre sıfırlama sistemi, kitap ekleme/düzenleme özellikleri ve okuma hedefi takibi bulunmaktadır.

## Projenin Amacı

Bu projenin amacı; Node.js, Express.js, MongoDB ve Next.js kullanarak güvenli bir kullanıcı giriş sistemi oluşturmak ve bu sistemi görsel olarak nostaljik bir Kitap Kulübü temasıyla desteklemektir.

## Kullanılan Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- dotenv
- cors

### Frontend
- Next.js
- React
- TypeScript
- CSS / Inline Style
- LocalStorage

## Özellikler

- Kullanıcı kayıt sistemi
- Kullanıcı giriş sistemi
- JWT ile oturum kontrolü
- Şifrelerin bcryptjs ile güvenli şekilde saklanması
- Şifremi unuttum özelliği
- Gmail üzerinden şifre sıfırlama maili gönderme
- 2 dakika geçerli reset password linki
- Kitap Kulübü temasına uygun HTML mail tasarımı
- Kullanıcı dashboard sayfası
- Kitap ekleme
- Kitap silme
- Kitap detay sayfası
- Kitap düzenleme
- Kitaplara yıldız puanı verme
- Kitap yorumu ekleme
- Kitapları aylara göre raflarda gösterme
- Okuma durumu belirleme
  - Okunacak
  - Okunuyor
  - Okundu
- Aylık okuma hedefi takibi
- Topluluk yorumları paneli
- Responsive tasarım için temel düzenlemeler

## Proje Yapısı

```txt
auth-project
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── index.js
│   └── .env
│
├── frontend
│   ├── app
│   │   ├── dashboard
│   │   ├── login
│   │   ├── register
│   │   ├── forgot-password
│   │   ├── reset-password
│   │   └── book-preview
│   │
│   ├── public
│   └── package.json
│
└── README.md