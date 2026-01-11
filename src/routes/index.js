/**
 * Main Routes Index
 * Central routing file untuk semua API endpoints
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const bookRoutes = require('./books');
const memberRoutes = require('./members');
const loanRoutes = require('./loans');
const staffRoutes = require('./staff');

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/members', memberRoutes);
router.use('/loans', loanRoutes);
router.use('/staff', staffRoutes);

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Library Management System API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * API documentation endpoint
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Library Management System API',
        version: '1.0.0',
        endpoints: {
            auth: {
                'POST /api/auth/login': 'Login petugas',
                'GET /api/auth/profile': 'Get profile petugas',
                'PUT /api/auth/change-password': 'Ubah password',
                'POST /api/auth/logout': 'Logout'
            },
            books: {
                'GET /api/books': 'Get katalog buku (public)',
                'GET /api/books/:id': 'Get detail buku',
                'GET /api/books/categories': 'Get kategori buku',
                'POST /api/books': 'Tambah buku (librarian)',
                'PUT /api/books/:id': 'Update buku (librarian)',
                'DELETE /api/books/:id': 'Hapus buku (admin)'
            },
            members: {
                'GET /api/members': 'Get data anggota (librarian)',
                'GET /api/members/:id': 'Get detail anggota',
                'POST /api/members': 'Tambah anggota (librarian)',
                'PUT /api/members/:id': 'Update anggota (librarian)'
            },
            loans: {
                'GET /api/loans': 'Get data peminjaman (librarian)',
                'GET /api/loans/active': 'Get peminjaman aktif',
                'GET /api/loans/overdue': 'Get peminjaman terlambat',
                'GET /api/loans/statistics': 'Get statistik peminjaman',
                'GET /api/loans/:id': 'Get detail peminjaman',
                'POST /api/loans': 'Catat peminjaman baru (librarian)',
                'PUT /api/loans/:id/return': 'Kembalikan buku (librarian)'
            },
            staff: {
                'GET /api/staff': 'Get data staff (admin)',
                'GET /api/staff/:id': 'Get detail staff',
                'GET /api/staff/statistics': 'Get statistik staff',
                'POST /api/staff': 'Tambah staff baru (admin)',
                'PUT /api/staff/:id': 'Update staff (admin)',
                'DELETE /api/staff/:id': 'Hapus staff (admin)',
                'PUT /api/staff/:id/reset-password': 'Reset password staff (admin)'
            }
        }
    });
});

module.exports = router;