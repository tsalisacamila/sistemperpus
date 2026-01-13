# 📚 DOKUMENTASI LENGKAP SISTEM PERPUSTAKAAN

## 📋 DAFTAR ISI

1. [Pendahuluan](#pendahuluan)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Struktur Folder](#struktur-folder)
5. [Konfigurasi](#konfigurasi)
6. [Database](#database)
7. [Backend API](#backend-api)
8. [Frontend](#frontend)
9. [Autentikasi & Keamanan](#autentikasi--keamanan)
10. [Cara Menjalankan](#cara-menjalankan)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)

---

## 1. PENDAHULUAN

### 1.1 Tentang Sistem

**Sistem Perpustakaan** adalah aplikasi web full-stack untuk mengelola perpustakaan digital dengan fitur:

- 📖 **Katalog Buku Publik** - Pengunjung dapat melihat dan mencari buku
- 🔐 **Dashboard Admin/Librarian** - Manajemen buku, anggota, dan peminjaman
- 📊 **Tracking Peminjaman** - Pencatatan peminjaman dan pengembalian
- 👥 **Manajemen Anggota** - CRUD data anggota perpustakaan
- 👨‍💼 **Manajemen Staff** - Kelola akun petugas (khusus admin)

### 1.2 Fitur Utama

#### Untuk Pengunjung (Tanpa Login):
- Melihat katalog buku
- Mencari buku berdasarkan judul/penulis
- Filter buku berdasarkan kategori
- Melihat ketersediaan buku

#### Untuk Petugas (Setelah Login):
- Semua fitur pengunjung +
- Tambah/Edit/Hapus buku
- Tambah/Edit/Hapus anggota
- Catat peminjaman buku
- Catat pengembalian buku
- Lihat riwayat peminjaman

#### Untuk Admin (Role Admin):
- Semua fitur petugas +
- Tambah/Edit/Hapus staff
- Kelola akun petugas

---

## 2. ARSITEKTUR SISTEM

### 2.1 Arsitektur Umum

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT SIDE                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Public Page  │  │  Login Page  │  │ Admin Panel  │  │
│  │ (index.html) │  │(login.html)  │  │(dashboard)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                             │
│                    HTTP/HTTPS Requests                   │
│                            │                             │
└────────────────────────────┼─────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────┐
│                      SERVER SIDE                         │
│                            │                             │
│  ┌─────────────────────────▼──────────────────────────┐ │
│  │           Express.js Application                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │ │
│  │  │Middleware│  │  Routes  │  │   Controllers    │ │ │
│  │  │(Auth,    │  │ (API     │  │  (Business       │ │ │
│  │  │Validate) │  │Endpoints)│  │   Logic)         │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │ │
│  │                       │                            │ │
│  │                       ▼                            │ │
│  │  ┌────────────────────────────────────────────┐   │ │
│  │  │         Sequelize ORM (Models)             │   │ │
│  │  └────────────────────────────────────────────┘   │ │
│  └────────────────────────┬───────────────────────────┘ │
└───────────────────────────┼─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    DATABASE LAYER                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │              MySQL Database (XAMPP)                │ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  │ │
│  │  │ books  │  │members │  │ staff  │  │ loans  │  │ │
│  │  └────────┘  └────────┘  └────────┘  └────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Request Flow

```
1. Client → Request → Express Server
2. Express → Middleware (CORS, Helmet, Rate Limit)
3. Middleware → Authentication (JWT Validation)
4. Authentication → Validation (Joi Schema)
5. Validation → Route Handler
6. Route → Controller (Business Logic)
7. Controller → Model (Sequelize ORM)
8. Model → MySQL Database
9. Database → Response → Client
```

---

## 3. TEKNOLOGI YANG DIGUNAKAN

### 3.1 Backend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Node.js** | 14+ | Runtime JavaScript |
| **Express.js** | ^4.18.2 | Web Framework |
| **Sequelize** | ^6.35.2 | ORM untuk MySQL |
| **MySQL2** | ^3.6.5 | MySQL Driver |
| **bcryptjs** | ^2.4.3 | Password Hashing |
| **jsonwebtoken** | ^9.0.2 | JWT Authentication |
| **Joi** | ^17.11.0 | Input Validation |
| **cors** | ^2.8.5 | Cross-Origin Resource Sharing |
| **helmet** | ^7.1.0 | Security Headers |
| **express-rate-limit** | ^7.1.5 | Rate Limiting |
| **dotenv** | ^16.3.1 | Environment Variables |

### 3.2 Frontend

| Teknologi | Fungsi |
|-----------|--------|
| **HTML5** | Struktur halaman |
| **CSS3** | Styling & Layout |
| **Vanilla JavaScript** | Interaksi & AJAX |
| **Fetch API** | HTTP Requests |

### 3.3 Database

| Teknologi | Fungsi |
|-----------|--------|
| **MySQL** | Relational Database |
| **XAMPP** | Local Development Server |

### 3.4 Development Tools

| Tool | Fungsi |
|------|--------|
| **nodemon** | Auto-restart server |
| **PM2** | Production Process Manager |
| **Jest** | Testing Framework |
| **Supertest** | API Testing |

---

## 4. STRUKTUR FOLDER

```
sistemperpus/
│
├── .env                          # Environment variables (JANGAN di-commit!)
├── .gitignore                    # Git ignore file
├── package.json                  # NPM dependencies
├── package-lock.json             # NPM lock file
├── ecosystem.config.js           # PM2 configuration
│
├── database/
│   └── schema.sql                # Database schema SQL
│
├── scripts/
│   └── setup-database.js         # Setup & seed database
│
├── src/                          # Source code backend
│   ├── app.js                    # Main application entry point
│   │
│   ├── config/
│   │   └── database.js           # Database configuration
│   │
│   ├── models/                   # Sequelize models
│   │   ├── index.js              # Model associations
│   │   ├── Book.js               # Book model
│   │   ├── Member.js             # Member model
│   │   ├── Staff.js              # Staff model
│   │   └── Loan.js               # Loan model
│   │
│   ├── controllers/              # Business logic
│   │   ├── authController.js     # Authentication logic
│   │   ├── bookController.js     # Book CRUD logic
│   │   ├── memberController.js   # Member CRUD logic
│   │   ├── staffController.js    # Staff CRUD logic
│   │   └── loanController.js     # Loan management logic
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # JWT authentication
│   │   └── validation.js         # Joi validation schemas
│   │
│   └── routes/                   # API routes
│       ├── index.js              # Main router
│       ├── auth.js               # Auth routes
│       ├── books.js              # Book routes
│       ├── members.js            # Member routes
│       ├── staff.js              # Staff routes
│       └── loans.js              # Loan routes
│
└── public/                       # Frontend files
    ├── index.html                # Public catalog page
    ├── login.html                # Login page
    ├── styles.css                # Public styles
    ├── public-script.js          # Public page scripts
    │
    └── admin/                    # Admin dashboard
        ├── dashboard.html        # Admin dashboard page
        ├── admin.css             # Admin styles
        └── admin_dashboard.js    # Admin scripts
```

---

## 5. KONFIGURASI

### 5.1 File .env

File `.env` berisi konfigurasi environment variables:

```env
# Server Configuration
PORT=3000                          # Port server (default: 3000)
NODE_ENV=development               # Environment: development/production

# Database Configuration
DB_HOST=localhost                  # MySQL host
DB_PORT=3306                       # MySQL port (default: 3306)
DB_USER=root                       # MySQL username
DB_PASSWORD=                       # MySQL password (kosong untuk XAMPP default)
DB_NAME=library_db                 # Nama database

# JWT Configuration
JWT_SECRET=rahasia_super_aman_ganti_ini  # Secret key untuk JWT (GANTI!)

# Rate Limiting (Optional)
RATE_LIMIT_WINDOW_MS=900000        # 15 menit
RATE_LIMIT_MAX_REQUESTS=100        # Max 100 requests per window
```

### 5.2 Penjelasan Konfigurasi

#### PORT
- Port dimana server akan berjalan
- Default: `3000`
- Ubah jika port 3000 sudah digunakan aplikasi lain

#### NODE_ENV
- `development`: Mode development (logging aktif, error detail)
- `production`: Mode production (logging minimal, error tersembunyi)

#### Database
- **DB_HOST**: Alamat MySQL server (localhost untuk XAMPP)
- **DB_PORT**: Port MySQL (3306 default)
- **DB_USER**: Username MySQL (root untuk XAMPP)
- **DB_PASSWORD**: Password MySQL (kosong untuk XAMPP default)
- **DB_NAME**: Nama database yang akan digunakan

#### JWT_SECRET
- Secret key untuk enkripsi JWT token
- **PENTING**: Ganti dengan string random yang kuat di production!
- Contoh generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 6. DATABASE

### 6.1 Struktur Database

Database `library_db` memiliki 4 tabel utama dengan relasi sebagai berikut:

```
┌─────────────┐         ┌─────────────┐
│   STAFF     │         │   MEMBERS   │
│─────────────│         │─────────────│
│ id (PK)     │         │ id (PK)     │
│ staff_code  │         │ member_code │
│ name        │         │ name        │
│ email       │         │ email       │
│ password    │         │ phone       │
│ role        │         │ address     │
│ status      │         │ join_date   │
└──────┬──────┘         │ status      │
       │                └──────┬──────┘
       │                       │
       │    ┌─────────────┐    │
       │    │    LOANS    │    │
       │    │─────────────│    │
       └───→│ id (PK)     │←───┘
            │ loan_code   │
            │ member_id   │ (FK → members.id)
            │ book_id     │ (FK → books.id)
            │ staff_id    │ (FK → staff.id)
            │ loan_date   │
            │ due_date    │
            │ return_date │
            │ status      │
            │ notes       │
            └──────┬──────┘
                   │
            ┌──────┴──────┐
            │    BOOKS    │
            │─────────────│
            │ id (PK)     │
            │ title       │
            │ author      │
            │ isbn        │
            │ category    │
            │ publisher   │
            │ publication_year │
            │ total_copies     │
            │ available_copies │
            │ description      │
            └─────────────┘
```

### 6.2 Tabel: BOOKS

**Deskripsi**: Menyimpan data koleksi buku perpustakaan

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| id | INTEGER | PK, AUTO_INCREMENT | ID unik buku |
| title | VARCHAR(255) | NOT NULL | Judul buku |
| author | VARCHAR(255) | NOT NULL | Nama penulis |
| isbn | VARCHAR(20) | UNIQUE | ISBN buku (opsional) |
| category | VARCHAR(100) | - | Kategori buku |
| publisher | VARCHAR(255) | - | Nama penerbit |
| publication_year | INTEGER | - | Tahun terbit |
| total_copies | INTEGER | DEFAULT 1 | Jumlah total eksemplar |
| available_copies | INTEGER | DEFAULT 1 | Jumlah tersedia |
| description | TEXT | - | Deskripsi buku |
| created_at | DATETIME | NOT NULL | Waktu dibuat |
| updated_at | DATETIME | NOT NULL | Waktu diupdate |

**Kategori Valid**:
- Programming
- Database
- Management
- Computer Science
- Web Development
- Mobile Development
- Other

**Indexes**:
- `title` (untuk pencarian cepat)
- `author` (untuk pencarian cepat)
- `category` (untuk filter)

### 6.3 Tabel: MEMBERS

**Deskripsi**: Menyimpan data anggota perpustakaan

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| id | INTEGER | PK, AUTO_INCREMENT | ID unik anggota |
| member_code | VARCHAR(20) | UNIQUE | Kode anggota (MEM001, MEM002, ...) |
| name | VARCHAR(255) | NOT NULL | Nama anggota |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email anggota |
| phone | VARCHAR(20) | - | Nomor telepon |
| address | TEXT | - | Alamat lengkap |
| join_date | DATE | DEFAULT NOW | Tanggal bergabung |
| status | ENUM | DEFAULT 'active' | Status: active/inactive |
| created_at | DATETIME | NOT NULL | Waktu dibuat |
| updated_at | DATETIME | NOT NULL | Waktu diupdate |

**Auto-generated**:
- `member_code`: Otomatis generate (MEM001, MEM002, dst) via Sequelize hook

### 6.4 Tabel: STAFF

**Deskripsi**: Menyimpan data petugas perpustakaan

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| id | INTEGER | PK, AUTO_INCREMENT | ID unik staff |
| staff_code | VARCHAR(20) | UNIQUE, NOT NULL | Kode staff (STF001, STF002, ...) |
| name | VARCHAR(255) | NOT NULL | Nama staff |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email staff |
| password | VARCHAR(255) | NOT NULL | Password (hashed dengan bcrypt) |
| role | ENUM | DEFAULT 'librarian' | Role: admin/librarian |
| status | ENUM | DEFAULT 'active' | Status: active/inactive |
| created_at | DATETIME | NOT NULL | Waktu dibuat |
| updated_at | DATETIME | NOT NULL | Waktu diupdate |

**Role**:
- `admin`: Akses penuh (kelola staff, buku, anggota, peminjaman)
- `librarian`: Akses terbatas (kelola buku, anggota, peminjaman)

**Security**:
- Password di-hash dengan bcrypt (10 rounds) sebelum disimpan
- Auto-hash via Sequelize `beforeCreate` dan `beforeUpdate` hooks

### 6.5 Tabel: LOANS

**Deskripsi**: Menyimpan data peminjaman buku

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| id | INTEGER | PK, AUTO_INCREMENT | ID unik peminjaman |
| loan_code | VARCHAR(20) | UNIQUE | Kode peminjaman (LOAN001, ...) |
| member_id | INTEGER | FK, NOT NULL | ID anggota peminjam |
| book_id | INTEGER | FK, NOT NULL | ID buku yang dipinjam |
| staff_id | INTEGER | FK, NOT NULL | ID staff yang mencatat |
| loan_date | DATE | NOT NULL | Tanggal pinjam |
| due_date | DATE | - | Tanggal jatuh tempo (7 hari) |
| return_date | DATE | - | Tanggal pengembalian aktual |
| status | ENUM | DEFAULT 'borrowed' | Status peminjaman |
| notes | TEXT | - | Catatan tambahan |
| created_at | DATETIME | NOT NULL | Waktu dibuat |
| updated_at | DATETIME | NOT NULL | Waktu diupdate |

**Status**:
- `borrowed`: Sedang dipinjam
- `returned`: Sudah dikembalikan
- `overdue`: Terlambat (melewati due_date)

**Foreign Keys**:
- `member_id` → `members.id` (ON DELETE NO ACTION)
- `book_id` → `books.id` (ON DELETE NO ACTION)
- `staff_id` → `staff.id` (ON DELETE NO ACTION)

**Business Logic**:
- `due_date` otomatis dihitung: loan_date + 7 hari
- `available_copies` di tabel books berkurang saat peminjaman
- `available_copies` bertambah saat pengembalian

---

## 7. BACKEND API

### 7.1 Struktur Backend

Backend menggunakan arsitektur **MVC (Model-View-Controller)**:

```
Request → Middleware → Route → Controller → Model → Database
```

### 7.2 Main Application (src/app.js)

File utama yang menjalankan Express server.

**Fitur**:
- ✅ Security middleware (Helmet, CORS)
- ✅ Rate limiting
- ✅ Body parsing (JSON, URL-encoded)
- ✅ Static file serving (folder public)
- ✅ API routes mounting
- ✅ Error handling
- ✅ Database connection & sync

**Middleware Stack**:
```javascript
1. helmet()              // Security headers
2. cors()                // Cross-origin requests
3. rateLimit()           // Rate limiting
4. express.json()        // Parse JSON body
5. express.urlencoded()  // Parse form data
6. express.static()      // Serve static files
7. API Routes            // /api/*
8. Error Handler         // Global error handling
```

**Server Startup Flow**:
```javascript
1. Load environment variables (.env)
2. Initialize Sequelize models
3. Test database connection
4. Sync database (create tables if not exist)
5. Start Express server on PORT
6. Listen for requests
```

### 7.3 Database Configuration (src/config/database.js)

**Sequelize Configuration**:
```javascript
{
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: development ? console.log : false,
  pool: {
    max: 10,        // Max connections
    min: 0,         // Min connections
    acquire: 30000, // Max time to get connection
    idle: 10000     // Max idle time
  }
}
```

**Functions**:
- `testConnection()`: Test database connectivity
- `syncDatabase(force)`: Sync models to database
  - `force=false`: Create tables if not exist
  - `force=true`: Drop & recreate tables (DANGER!)

### 7.4 Models (src/models/)

#### 7.4.1 Book Model (src/models/Book.js)

**Validations**:
- `title`: Required, 1-255 characters
- `author`: Required, not empty
- `isbn`: Optional, unique, format: 978/979 + 10-17 digits
- `category`: Must be one of valid categories
- `publication_year`: 1900 - current year
- `total_copies`: Min 1
- `available_copies`: Min 0, Max total_copies

**Instance Methods**:
```javascript
book.isAvailable()           // Check if book available
book.borrowBook()            // Decrease available_copies
book.returnBook()            // Increase available_copies
```

**Static Methods**:
```javascript
Book.searchBooks(query)      // Search by title/author
Book.getByCategory(category) // Filter by category
```

#### 7.4.2 Member Model (src/models/Member.js)

**Validations**:
- `name`: Required, 2-255 characters
- `email`: Required, valid email format, unique
- `phone`: Optional, Indonesian phone format (08xx)
- `member_code`: Auto-generated (MEM001, MEM002, ...)

**Hooks**:
```javascript
beforeCreate: Generate member_code automatically
```

**Instance Methods**:
```javascript
member.isActive()            // Check if member active
member.getActiveLoans()      // Get current loans
```

**Static Methods**:
```javascript
Member.generateMemberCode()  // Generate next member code
```

#### 7.4.3 Staff Model (src/models/Staff.js)

**Validations**:
- `staff_code`: Required, format STF001, STF002, ...
- `name`: Required, 2-255 characters
- `email`: Required, valid email, unique
- `password`: Required, min 6 characters (hashed)
- `role`: admin or librarian

**Hooks**:
```javascript
beforeCreate:
  - Generate staff_code
  - Hash password with bcrypt

beforeUpdate:
  - Hash password if changed
```

**Instance Methods**:
```javascript
staff.isActive()             // Check if staff active
staff.isAdmin()              // Check if role is admin
staff.validatePassword(pwd)  // Compare password
staff.changePassword(newPwd) // Update password
```

**Static Methods**:
```javascript
Staff.generateStaffCode()    // Generate next staff code
Staff.authenticate(email, pwd) // Login authentication
```

#### 7.4.4 Loan Model (src/models/Loan.js)

**Validations**:
- `loan_code`: Auto-generated (LOAN001, LOAN002, ...)
- `member_id`: Required, must exist in members table
- `book_id`: Required, must exist in books table
- `staff_id`: Required, must exist in staff table
- `loan_date`: Required, default today
- `due_date`: Auto-calculated (loan_date + 7 days)

**Hooks**:
```javascript
beforeCreate:
  - Generate loan_code
  - Calculate due_date
  - Decrease book.available_copies

afterUpdate (if returned):
  - Increase book.available_copies
```

**Instance Methods**:
```javascript
loan.isOverdue()             // Check if overdue
loan.markAsReturned()        // Mark as returned
```

**Associations**:
```javascript
Loan.belongsTo(Member)       // loan.member
Loan.belongsTo(Book)         // loan.book
Loan.belongsTo(Staff)        // loan.staff
```

### 7.5 Controllers (src/controllers/)

Controllers berisi business logic untuk setiap resource.

#### 7.5.1 Auth Controller (src/controllers/authController.js)

**Endpoints**:

**POST /api/auth/login**
- Input: email, password
- Process: Validate credentials, generate JWT
- Output: token, staff data (without password)

**GET /api/auth/me**
- Input: JWT token (header)
- Process: Verify token, get staff data
- Output: Current staff data

**POST /api/auth/logout**
- Input: JWT token
- Process: Client-side token removal
- Output: Success message

#### 7.5.2 Book Controller (src/controllers/bookController.js)

**GET /api/books** (Public)
- Query params: page, limit, search, category
- Returns: Paginated books list

**GET /api/books/:id** (Public)
- Returns: Single book detail

**POST /api/books** (Protected: Admin/Librarian)
- Input: Book data
- Returns: Created book

**PUT /api/books/:id** (Protected: Admin/Librarian)
- Input: Updated book data
- Returns: Updated book

**DELETE /api/books/:id** (Protected: Admin/Librarian)
- Returns: Success message

#### 7.5.3 Member Controller (src/controllers/memberController.js)

**GET /api/members** (Protected)
- Query params: page, limit, search
- Returns: Paginated members list

**GET /api/members/:id** (Protected)
- Returns: Single member detail + active loans

**POST /api/members** (Protected)
- Input: Member data
- Returns: Created member

**PUT /api/members/:id** (Protected)
- Input: Updated member data
- Returns: Updated member

**DELETE /api/members/:id** (Protected)
- Validation: Cannot delete if has active loans
- Returns: Success message

#### 7.5.4 Loan Controller (src/controllers/loanController.js)

**GET /api/loans** (Protected)
- Query params: status, member_id, book_id
- Returns: Loans list with relations

**GET /api/loans/:id** (Protected)
- Returns: Single loan detail

**POST /api/loans** (Protected)
- Input: member_id, book_id, notes
- Validation: Book must be available
- Process: Create loan, decrease available_copies
- Returns: Created loan

**PUT /api/loans/:id/return** (Protected)
- Process: Mark as returned, increase available_copies
- Returns: Updated loan

#### 7.5.5 Staff Controller (src/controllers/staffController.js)

**GET /api/staff** (Protected: Admin only)
- Returns: All staff list

**GET /api/staff/:id** (Protected: Admin only)
- Returns: Single staff detail

**POST /api/staff** (Protected: Admin only)
- Input: Staff data
- Returns: Created staff

**PUT /api/staff/:id** (Protected: Admin only)
- Input: Updated staff data
- Returns: Updated staff

**DELETE /api/staff/:id** (Protected: Admin only)
- Validation: Cannot delete self
- Returns: Success message

### 7.6 Middleware (src/middleware/)

#### 7.6.1 Authentication Middleware (src/middleware/auth.js)

**authenticate()**
- Verify JWT token from Authorization header
- Attach staff data to req.user
- Return 401 if invalid/expired token

**isAdmin()**
- Check if req.user.role === 'admin'
- Return 403 if not admin

**Usage**:
```javascript
router.get('/protected', authenticate, controller)
router.post('/admin-only', authenticate, isAdmin, controller)
```

#### 7.6.2 Validation Middleware (src/middleware/validation.js)

**validate(schema, property)**
- Validate req.body/query/params using Joi schema
- Return 400 with error details if validation fails
- Strip unknown fields

**Schemas**:
- `schemas.createBook`: Validate create book
- `schemas.updateBook`: Validate update book
- `schemas.createMember`: Validate create member
- `schemas.updateMember`: Validate update member
- `schemas.createStaff`: Validate create staff
- `schemas.updateStaff`: Validate update staff
- `schemas.createLoan`: Validate create loan
- `schemas.login`: Validate login
- `schemas.searchQuery`: Validate search params

**Usage**:
```javascript
router.post('/books',
  authenticate,
  validate(schemas.createBook),
  controller
)
```

### 7.7 Routes (src/routes/)

**Main Router** (src/routes/index.js):
```javascript
/api
  ├── /health          → Health check
  ├── /auth            → Authentication routes
  ├── /books           → Book routes
  ├── /members         → Member routes (protected)
  ├── /staff           → Staff routes (admin only)
  └── /loans           → Loan routes (protected)
```

**Route Protection**:
- Public: `/api/books` (GET)
- Protected: All other routes (require JWT)
- Admin only: `/api/staff/*`

---

## 8. FRONTEND

### 8.1 Struktur Frontend

Frontend menggunakan **Vanilla JavaScript** dengan arsitektur:

```
HTML (Structure) → CSS (Styling) → JavaScript (Logic)
```

### 8.2 Public Pages

#### 8.2.1 Index Page (public/index.html)

**Fitur**:
- Header dengan tombol login
- Hero section
- Katalog buku (grid layout)
- Search & filter
- Pagination

**Sections**:
```html
<header>        → Logo, Login button
<hero>          → Welcome message
<main>
  <catalog>     → Books grid
  <pagination>  → Page navigation
</main>
```

#### 8.2.2 Public Script (public/public-script.js)

**Class**: `PublicApp`

**Methods**:
```javascript
init()                    // Initialize app
loadBooks(page, search)   // Load books from API
renderBooks(books)        // Render books grid
searchBooks()             // Search functionality
filterByCategory()        // Filter functionality
renderPagination()        // Render pagination
```

**API Calls**:
```javascript
GET /api/books?page=1&limit=12&search=query&category=Programming
```

#### 8.2.3 Login Page (public/login.html)

**Fitur**:
- Login form (email, password)
- Remember me checkbox
- Error message display
- Redirect to dashboard after login

**Form Handling**:
```javascript
1. Capture form submit
2. POST /api/auth/login
3. Save token to localStorage
4. Redirect to /admin/dashboard.html
```

### 8.3 Admin Dashboard

#### 8.3.1 Dashboard Page (public/admin/dashboard.html)

**Layout**:
```html
<header>
  <nav>           → Navigation tabs
  <user-info>     → Logged in user, logout
</nav>

<main>
  <section id="books">      → Book management
  <section id="members">    → Member management
  <section id="loans">      → Loan management
  <section id="staff">      → Staff management (admin only)
</main>

<modals>
  <new-book-modal>
  <edit-book-modal>
  <new-member-modal>
  <edit-member-modal>
  <new-loan-modal>
  <return-loan-modal>
  <new-staff-modal>
  <edit-staff-modal>
</modals>
```

#### 8.3.2 Admin Script (public/admin/admin_dashboard.js)

**Class**: `AdminApp`

**Properties**:
```javascript
token              // JWT token from localStorage
currentUser        // Current logged in staff
currentSection     // Active section (books/members/loans/staff)
```

**Initialization**:
```javascript
init()
  → checkAuth()           // Verify token
  → loadCurrentUser()     // Get user data
  → setupEventListeners() // Bind events
  → loadBooks()           // Load initial data
```

**Book Management**:
```javascript
loadBooks(page, search)     // GET /api/books
createBook(data)            // POST /api/books
editBook(id)                // GET /api/books/:id
updateBook(id, data)        // PUT /api/books/:id
deleteBook(id)              // DELETE /api/books/:id
```

**Member Management**:
```javascript
loadMembers(page, search)   // GET /api/members
createMember(data)          // POST /api/members
editMember(id)              // GET /api/members/:id
updateMember(id, data)      // PUT /api/members/:id
deleteMember(id)            // DELETE /api/members/:id
```

**Loan Management**:
```javascript
loadLoans(status)           // GET /api/loans?status=
createLoan(data)            // POST /api/loans
returnBook(id)              // PUT /api/loans/:id/return
loadMembersForLoan()        // GET /api/members (for dropdown)
loadBooksForLoan()          // GET /api/books (for dropdown)
```

**Staff Management** (Admin only):
```javascript
loadStaff()                 // GET /api/staff
createStaff(data)           // POST /api/staff
editStaff(id)               // GET /api/staff/:id
updateStaff(id, data)       // PUT /api/staff/:id
deleteStaff(id)             // DELETE /api/staff/:id
```

**Utility Methods**:
```javascript
apiCall(endpoint, method, data)  // Generic API call with auth
showModal(modalId)               // Show modal
hideModal(modalId)               // Hide modal
showToast(message, type)         // Show notification
showLoading()                    // Show loading spinner
hideLoading()                    // Hide loading spinner
switchSection(section)           // Switch between tabs
```

**Authentication Flow**:
```javascript
1. Check localStorage for token
2. If no token → redirect to login
3. If token exists → verify with GET /api/auth/me
4. If valid → load dashboard
5. If invalid → clear token, redirect to login
```

**API Call Pattern**:
```javascript
async apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`/api${endpoint}`, options);
  return await response.json();
}
```

### 8.4 Styling (CSS)

#### 8.4.1 Public Styles (public/styles.css)

**Features**:
- Responsive design (mobile-first)
- CSS Grid for book layout
- Flexbox for navigation
- CSS Variables for theming
- Smooth transitions

**Color Scheme**:
```css
--primary-color: #2563eb
--secondary-color: #1e40af
--success-color: #10b981
--danger-color: #ef4444
--warning-color: #f59e0b
--text-color: #1f2937
--bg-color: #f9fafb
```

#### 8.4.2 Admin Styles (public/admin/admin.css)

**Features**:
- Dashboard layout (sidebar + content)
- Table styling
- Modal styling
- Form styling
- Button variants
- Toast notifications

**Responsive Breakpoints**:
```css
@media (max-width: 768px)   // Mobile
@media (max-width: 1024px)  // Tablet
@media (min-width: 1025px)  // Desktop
```

---

## 9. AUTENTIKASI & KEAMANAN

### 9.1 JWT Authentication

**Flow**:
```
1. User login → POST /api/auth/login
2. Server validates credentials
3. Server generates JWT token
4. Client stores token in localStorage
5. Client sends token in Authorization header
6. Server verifies token on protected routes
```

**JWT Payload**:
```javascript
{
  id: staff.id,
  email: staff.email,
  role: staff.role,
  iat: issued_at_timestamp,
  exp: expiration_timestamp
}
```

**Token Expiration**: 24 hours (configurable)

### 9.2 Password Security

**Hashing**:
- Algorithm: bcrypt
- Salt rounds: 10
- Auto-hash on create/update via Sequelize hooks

**Password Requirements**:
- Minimum 6 characters
- No maximum (hashed to fixed length)

### 9.3 Security Middleware

#### Helmet
- Sets security HTTP headers
- XSS protection
- Content Security Policy
- HSTS (disabled for local dev)

#### CORS
- Allows cross-origin requests
- Configured origins based on NODE_ENV
- Credentials: true

#### Rate Limiting
- Window: 15 minutes
- Max requests: 100 (development), 100 (production)
- Applied to /api/* routes

### 9.4 Input Validation

**Joi Schemas**:
- Validate all user inputs
- Strip unknown fields
- Type coercion
- Custom error messages

**Validation Points**:
- Request body (POST, PUT)
- Query parameters (GET)
- URL parameters (GET, PUT, DELETE)

### 9.5 SQL Injection Prevention

**Sequelize ORM**:
- Parameterized queries
- Automatic escaping
- No raw SQL (unless necessary)

### 9.6 XSS Prevention

**Frontend**:
- Use `textContent` instead of `innerHTML` for user data
- Sanitize HTML if needed

**Backend**:
- Helmet CSP headers
- Input validation

---

## 10. CARA MENJALANKAN

### 10.1 Persiapan

**Requirements**:
- Node.js 14+ installed
- XAMPP installed
- Git (optional)

**Checklist**:
- [ ] XAMPP MySQL running
- [ ] Database `library_db` created
- [ ] File `.env` configured
- [ ] Dependencies installed

### 10.2 Instalasi

```bash
# 1. Clone/Download project
cd sistemperpus

# 2. Install dependencies
npm install

# 3. Configure .env
cp .env.example .env  # (if exists)
# Edit .env with your settings

# 4. Create database in phpMyAdmin
# Database name: library_db

# 5. Setup database & seed data
node scripts/setup-database.js

# 6. Start server
npm run dev
```

### 10.3 Menjalankan Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

**With PM2** (production):
```bash
npm run pm2:start    # Start
npm run pm2:stop     # Stop
npm run pm2:restart  # Restart
npm run pm2:logs     # View logs
npm run pm2:monit    # Monitor
```

### 10.4 Akses Aplikasi

**Public Catalog**:
```
http://localhost:3000
```

**Login Page**:
```
http://localhost:3000/login.html
```

**Admin Dashboard**:
```
http://localhost:3000/admin/dashboard.html
```

**API Health Check**:
```
http://localhost:3000/api/health
```

### 10.5 Default Accounts

**Admin**:
- Email: `admin@library.com`
- Password: `adminsuper123`
- Role: admin

**Librarian**:
- Email: `librarian@library.com`
- Password: `librarian123`
- Role: librarian

---

## 11. TESTING

### 11.1 Manual Testing

**Test API dengan cURL**:

```bash
# Health check
curl http://localhost:3000/api/health

# Get books (public)
curl http://localhost:3000/api/books

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"adminsuper123"}'

# Get books (with auth)
curl http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "category": "Programming",
    "total_copies": 5
  }'
```

### 11.2 Automated Testing

**Run Tests**:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**Test Structure**:
```
tests/
├── unit/
│   ├── models/
│   ├── controllers/
│   └── middleware/
└── integration/
    └── api/
```

### 11.3 Testing Checklist

**Authentication**:
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected route without token
- [ ] Access protected route with expired token
- [ ] Logout

**Books**:
- [ ] Get all books (public)
- [ ] Search books
- [ ] Filter by category
- [ ] Create book (authenticated)
- [ ] Update book (authenticated)
- [ ] Delete book (authenticated)
- [ ] Validation errors

**Members**:
- [ ] Get all members (authenticated)
- [ ] Create member
- [ ] Update member
- [ ] Delete member (without active loans)
- [ ] Cannot delete member with active loans

**Loans**:
- [ ] Create loan (book available)
- [ ] Cannot create loan (book unavailable)
- [ ] Return book
- [ ] Check overdue status
- [ ] Filter by status

**Staff** (Admin only):
- [ ] Get all staff
- [ ] Create staff
- [ ] Update staff
- [ ] Delete staff
- [ ] Cannot delete self

---

## 12. TROUBLESHOOTING

### 12.1 Database Connection Error

**Error**: `Unable to connect to the database`

**Solutions**:
1. Check XAMPP MySQL is running (green light)
2. Verify database `library_db` exists in phpMyAdmin
3. Check `.env` credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=        # Empty for XAMPP default
   DB_NAME=library_db
   ```
4. Test MySQL connection:
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

### 12.2 Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
1. Change port in `.env`:
   ```env
   PORT=3001
   ```
2. Or kill process using port 3000:
   ```bash
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### 12.3 Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 12.4 JWT Token Invalid

**Error**: `Token tidak valid atau sudah expired`

**Solutions**:
1. Clear localStorage and login again
2. Check JWT_SECRET in `.env` hasn't changed
3. Token expired (24h) - login again

### 12.5 Validation Error

**Error**: `Validasi input gagal`

**Solutions**:
1. Check error details in response
2. Verify input format matches requirements
3. Check Joi schema in `src/middleware/validation.js`

**Common Issues**:
- ISBN format: Use `9780596517748` or `978-0-596-51774-8`
- Phone format: Use `081234567890` (Indonesian format)
- Email format: Must be valid email
- Category: Must be one of valid categories

### 12.6 CORS Error

**Error**: `Access-Control-Allow-Origin`

**Solution**:
Check CORS configuration in `src/app.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

### 12.7 Frontend Not Loading Data

**Symptoms**: Empty catalog, no books showing

**Solutions**:
1. Open browser console (F12) → Check for errors
2. Check Network tab → Verify API calls
3. Verify backend server is running
4. Test API directly:
   ```bash
   curl http://localhost:3000/api/books
   ```
5. Check if data exists in database:
   ```bash
   node scripts/setup-database.js
   ```

### 12.8 Cannot Delete Member

**Error**: `Tidak dapat menghapus anggota yang memiliki peminjaman aktif`

**Solution**:
This is by design. Return all books first:
1. Go to Loans section
2. Find active loans for this member
3. Return all books
4. Then delete member

### 12.9 Book Not Available

**Error**: `Buku tidak tersedia untuk dipinjam`

**Solutions**:
1. Check `available_copies` in database
2. Return books to increase availability
3. Or increase `total_copies` in book edit

### 12.10 Permission Denied

**Error**: `Anda tidak memiliki akses ke resource ini`

**Solutions**:
1. Check user role (admin vs librarian)
2. Staff management requires admin role
3. Login with admin account for full access

---

## 13. DEPLOYMENT

### 13.1 Production Checklist

**Before Deploy**:
- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Update CORS origins to production domain
- [ ] Enable HSTS in Helmet config
- [ ] Set up SSL certificate
- [ ] Configure firewall
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring

### 13.2 Environment Variables (Production)

```env
PORT=3000
NODE_ENV=production

DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=strong-password-here
DB_NAME=library_db

JWT_SECRET=generate-strong-random-secret-here

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 13.3 PM2 Deployment

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

# Monitor
pm2 monit

# View logs
pm2 logs library-system

# Restart
pm2 restart library-system

# Stop
pm2 stop library-system
```

### 13.4 Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 13.5 Database Backup

```bash
# Backup
mysqldump -u root -p library_db > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p library_db < backup_20260113.sql
```

---

## 14. MAINTENANCE

### 14.1 Regular Tasks

**Daily**:
- Monitor server logs
- Check error rates
- Verify backups

**Weekly**:
- Review user activity
- Check database size
- Update dependencies (if needed)

**Monthly**:
- Security audit
- Performance optimization
- Clean old logs

### 14.2 Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update to latest (careful!)
npm install package@latest
```

### 14.3 Database Maintenance

```bash
# Optimize tables
mysql -u root -p library_db -e "OPTIMIZE TABLE books, members, staff, loans;"

# Check table status
mysql -u root -p library_db -e "SHOW TABLE STATUS;"
```

---

## 15. CHANGELOG

### Version 1.0.0 (2026-01-13)

**Initial Release**:
- ✅ Public book catalog
- ✅ Staff authentication (JWT)
- ✅ Book management (CRUD)
- ✅ Member management (CRUD)
- ✅ Loan management
- ✅ Staff management (admin only)
- ✅ Search & filter functionality
- ✅ Responsive design
- ✅ Security features (Helmet, CORS, Rate Limit)
- ✅ Input validation (Joi)
- ✅ Database seeding script

**Bug Fixes**:
- Fixed ISBN validation to accept both formats (with/without dash)

---

## 16. KONTRIBUTOR

**Developer**: Library System Team
**Version**: 1.0.0
**Last Updated**: 2026-01-13

---

## 17. LISENSI

MIT License

---




