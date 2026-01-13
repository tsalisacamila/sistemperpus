# 📡 API DOCUMENTATION - SISTEM PERPUSTAKAAN

Base URL: `http://localhost:3000/api`

---

## 🔐 AUTHENTICATION

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "admin@library.com",
  "password": "adminsuper123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "staff": {
      "id": 1,
      "staff_code": "STF001",
      "name": "Administrator",
      "email": "admin@library.com",
      "role": "admin"
    }
  }
}
```

### Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 📚 BOOKS (Public & Protected)

### Get All Books (Public)
**GET** `/api/books`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title or author
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "message": "Katalog buku berhasil diambil",
  "data": {
    "books": [
      {
        "id": 1,
        "title": "JavaScript: The Good Parts",
        "author": "Douglas Crockford",
        "isbn": "9780596517748",
        "category": "Programming",
        "publisher": "O'Reilly Media",
        "publication_year": 2008,
        "total_copies": 5,
        "available_copies": 5
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 5,
      "itemsPerPage": 10
    }
  }
}
```

### Get Book by ID (Public)
**GET** `/api/books/:id`

### Create Book (Protected - Admin/Librarian)
**POST** `/api/books`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "isbn": "9780134494166",
  "category": "Programming",
  "publisher": "Prentice Hall",
  "publication_year": 2017,
  "total_copies": 3
}
```

### Update Book (Protected - Admin/Librarian)
**PUT** `/api/books/:id`

### Delete Book (Protected - Admin/Librarian)
**DELETE** `/api/books/:id`

---

## 👥 MEMBERS (Protected)

### Get All Members
**GET** `/api/members`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`, `limit`, `search`

### Get Member by ID
**GET** `/api/members/:id`

### Create Member
**POST** `/api/members`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "address": "Jl. Example No. 123"
}
```

### Update Member
**PUT** `/api/members/:id`

### Delete Member
**DELETE** `/api/members/:id`

---

## 📖 LOANS (Protected)

### Get All Loans
**GET** `/api/loans`

**Query Parameters:**
- `status`: borrowed, returned, overdue
- `member_id`: Filter by member
- `book_id`: Filter by book

### Get Loan by ID
**GET** `/api/loans/:id`

### Create Loan (Borrow Book)
**POST** `/api/loans`

**Request Body:**
```json
{
  "member_id": 1,
  "book_id": 1,
  "notes": "Peminjaman untuk tugas kuliah"
}
```

### Return Book
**PUT** `/api/loans/:id/return`

**Request Body:**
```json
{
  "notes": "Buku dikembalikan dalam kondisi baik"
}
```

---

## 👨‍💼 STAFF (Protected - Admin Only)

### Get All Staff
**GET** `/api/staff`

### Create Staff
**POST** `/api/staff`

**Request Body:**
```json
{
  "name": "New Librarian",
  "email": "librarian2@library.com",
  "password": "password123",
  "role": "librarian"
}
```

### Update Staff
**PUT** `/api/staff/:id`

### Delete Staff
**DELETE** `/api/staff/:id`

---

## 🏥 HEALTH CHECK

### Health Check
**GET** `/api/health`

**Response:**
```json
{
  "success": true,
  "message": "Library Management System API is running",
  "timestamp": "2026-01-13T06:14:34.934Z",
  "version": "1.0.0"
}
```

---

## ⚠️ ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Format email tidak valid"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token tidak valid atau sudah expired"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

