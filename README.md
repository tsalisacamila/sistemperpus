# Sistem Informasi Perpustakaan (Library Management System)

Aplikasi manajemen perpustakaan berbasis web modern yang dibangun menggunakan Node.js, Express, dan MySQL. Sistem ini dirancang untuk memudahkan pengelolaan buku, peminjaman, anggota, dan staf perpustakaan dengan antarmuka yang responsif dan mudah digunakan.

## Fitur Utama

### Katalog Publik
- **Pencarian Buku**: Cari buku berdasarkan judul, penulis, ISBN, atau filter berdasarkan kategori.
- **Ketersediaan Real-time**: Lihat status ketersediaan stok buku secara langsung.
- **Responsif**: Tampilan yang nyaman diakses dari desktop maupun mobile.

### Admin Dashboard
- **Manajemen Buku**: Tambah, edit, dan update stok buku.
- **Manajemen Peminjaman**:
  - Mencatat peminjaman baru (auto-calculate tanggal kembali 7 hari).
  - Pengembalian buku (update otomatis stok & status).
  - Statistik peminjaman (Active, Total, Overdue).
- **Manajemen Anggota**:
  - CRUD (Create, Read, Update, Delete) data anggota.
  - Validasi data yang aman (mencegah hapus anggota yang masih meminjam buku).
- **Manajemen Staf** (Admin Only): Kelola akun staf perpustakaan.

## Yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MySQL, Sequelize ORM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Keamanan**: JWT (JSON Web Tokens), Bcrypt (Password Hashing), Helmet, Rate Limiting
- **Validasi**: Joi (Input Validation)

## Instalasi & Setup

### Prasyarat
- Node.js (v14+)
- MySQL (XAMPP/MAMP/Standalone)

### Langkah Instalasi

1.  **Clone Repository** (atau download zip project ini)
    ```bash
    git clone https://github.com/gusbram66/sistemperpus.git
    cd sistemperpus
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Database**
    - Pastikan MySQL server berjalan.
    - Buat database kosong bernama `library_db` (opsional, Sequelize akan membuatnya otomatis jika dikonfigurasi).
    - Sesuaikan konfigurasi database di `.env` (lihat bagian Environment Variables).

4.  **Jalankan Server (Development Mode)**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000`.

## Environment Variables

Buat file `.env` di root folder project dan isi dengan konfigurasi berikut:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=          # Kosongkan jika menggunakan XAMPP default
DB_NAME=library_db
JWT_SECRET=rahasia_super_aman_ganti_ini
NODE_ENV=development
```

## Akun Default

Setelah menjalankan server pertama kali (seeding), Anda dapat login menggunakan akun berikut:

**Admin / Pustakawan**
- **Email**: `admin@library.com`
- **Password**: `adminsuper123`

## Struktur Project

```
sistemperpus/
├── public/                 # File statis frontend (HTML, CSS, JS)
│   ├── admin/             # Dashboard admin
│   ├── js/                # Script frontend (main.js, login.js)
│   ├── css/               # Styling
│   └── index.html         # Halaman utama katalog
├── src/
│   ├── config/            # Konfigurasi Database
│   ├── controllers/       # Logika bisnis (Loan, Member, Book)
│   ├── middleware/        # Auth & Validasi
│   ├── models/            # Definisi Model Database (Sequelize)
│   ├── routes/            # Definisi API Endpoints
│   └── app.js             # Entry point aplikasi
└── package.json           # Dependencies project
```

## Lisensi

Project ini dibuat untuk tujuan pembelajaran dan pengembangan sistem informasi perpustakaan.
