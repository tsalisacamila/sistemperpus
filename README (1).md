# 📚 SISTEM PERPUSTAKAAN - Library Management System

Aplikasi web full-stack untuk mengelola perpustakaan digital dengan fitur katalog publik, manajemen buku, anggota, dan peminjaman.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ FITUR UTAMA

### 🌐 Untuk Pengunjung (Tanpa Login)
- ✅ Melihat katalog buku perpustakaan
- ✅ Mencari buku berdasarkan judul/penulis
- ✅ Filter buku berdasarkan kategori
- ✅ Melihat ketersediaan buku real-time

### 🔐 Untuk Petugas (Setelah Login)
- ✅ Manajemen Buku (Create, Read, Update, Delete)
- ✅ Manajemen Anggota (CRUD)
- ✅ Pencatatan Peminjaman Buku
- ✅ Pencatatan Pengembalian Buku
- ✅ Tracking Status Peminjaman (Borrowed, Returned, Overdue)
- ✅ Dashboard dengan statistik

### 👨‍💼 Untuk Admin
- ✅ Semua fitur petugas +
- ✅ Manajemen Staff/Petugas (CRUD)
- ✅ Kelola akun librarian

---

## 🛠️ TEKNOLOGI

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web Framework
- **Sequelize** - ORM untuk MySQL
- **MySQL** - Relational Database
- **JWT** - Authentication
- **bcrypt** - Password Hashing
- **Joi** - Input Validation

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Logic & Interactivity
- **Fetch API** - HTTP Requests

### Security
- **Helmet** - Security Headers
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - DDoS Protection
- **Input Validation** - XSS & SQL Injection Prevention

---

## 📋 REQUIREMENTS

- **Node.js** 14.x atau lebih baru
- **MySQL** 5.7 atau lebih baru (via XAMPP)
- **npm** 6.x atau lebih baru
- **XAMPP** (untuk MySQL & phpMyAdmin)

---

## 🚀 QUICK START

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment

Buat file `.env` di root folder:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=library_db

JWT_SECRET=rahasia_super_aman_ganti_ini
```

### 3. Setup Database

Pastikan XAMPP MySQL sudah running, lalu:

```bash
# Buat database di phpMyAdmin dengan nama: library_db

# Jalankan setup script
node scripts/setup-database.js
```

### 4. Jalankan Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 5. Akses Aplikasi

- **Public Catalog**: http://localhost:3000
- **Login Page**: http://localhost:3000/login.html
- **Admin Dashboard**: http://localhost:3000/admin/dashboard.html

### 6. Login Default

**Admin**:
- Email: `admin@library.com`
- Password: `adminsuper123`

**Librarian**:
- Email: `librarian@library.com`
- Password: `librarian123`

---

## 📁 STRUKTUR PROJECT

```
sistemperpus/
├── src/                      # Backend source code
│   ├── app.js               # Main application
│   ├── config/              # Configuration
│   ├── models/              # Sequelize models
│   ├── controllers/         # Business logic
│   ├── middleware/          # Express middleware
│   └── routes/              # API routes
├── public/                   # Frontend files
│   ├── index.html           # Public catalog
│   ├── login.html           # Login page
│   └── admin/               # Admin dashboard
├── scripts/                  # Utility scripts
│   └── setup-database.js    # Database setup
├── .env                      # Environment variables
└── package.json             # Dependencies
```

---

## 📖 DOKUMENTASI

Dokumentasi lengkap tersedia di:

- **[DOKUMENTASI_LENGKAP.md](DOKUMENTASI_LENGKAP.md)** - Dokumentasi code lengkap dari A-Z
- **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - Dokumentasi API endpoints
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Panduan development

---

## 🔌 API ENDPOINTS

### Authentication
- `POST /api/auth/login` - Login staff
- `GET /api/auth/me` - Get current user

### Books (Public)
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID

### Books (Protected)
- `POST /api/books` - Create book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Members (Protected)
- `GET /api/members` - Get all members
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Loans (Protected)
- `GET /api/loans` - Get all loans
- `POST /api/loans` - Create loan
- `PUT /api/loans/:id/return` - Return book

### Staff (Admin Only)
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Create staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

Lihat [API_ENDPOINTS.md](API_ENDPOINTS.md) untuk detail lengkap.

---

## 🗄️ DATABASE SCHEMA

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  STAFF  │     │ MEMBERS │     │  BOOKS  │     │  LOANS  │
├─────────┤     ├─────────┤     ├─────────┤     ├─────────┤
│ id (PK) │     │ id (PK) │     │ id (PK) │     │ id (PK) │
│ code    │     │ code    │     │ title   │     │ code    │
│ name    │     │ name    │     │ author  │     │ member  │
│ email   │     │ email   │     │ isbn    │     │ book    │
│ password│     │ phone   │     │ category│     │ staff   │
│ role    │     │ address │     │ copies  │     │ dates   │
│ status  │     │ status  │     │ avail   │     │ status  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
```

---

## 🔒 SECURITY FEATURES

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Input Validation (Joi)
- ✅ SQL Injection Prevention (Sequelize ORM)
- ✅ XSS Protection (Helmet)
- ✅ CORS Configuration
- ✅ Rate Limiting
- ✅ Secure HTTP Headers

---

## 🐛 TROUBLESHOOTING

### Database Connection Error
```bash
# Pastikan XAMPP MySQL running
# Cek database library_db sudah dibuat
# Verifikasi kredensial di .env
```

### Port Already in Use
```bash
# Ubah PORT di .env
PORT=3001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

Lihat [DOKUMENTASI_LENGKAP.md](DOKUMENTASI_LENGKAP.md) untuk troubleshooting lengkap.

---

## 📝 CHANGELOG

### Version 1.0.0 (2026-01-13)
- ✅ Initial release
- ✅ Public book catalog
- ✅ Staff authentication
- ✅ Book management (CRUD)
- ✅ Member management (CRUD)
- ✅ Loan management
- ✅ Staff management (admin only)
- ✅ Search & filter functionality
- ✅ Responsive design
- ✅ Security features
- ✅ Bug fix: ISBN validation

---

## 📄 LICENSE

This project is licensed under the MIT License.

---

## 👥 TEAM

**Developer**: Library System Team
**Version**: 1.0.0
**Last Updated**: 2026-01-13

---

🎉 **Selamat menggunakan Sistem Perpustakaan!** 🎉
