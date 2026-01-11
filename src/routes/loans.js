/**
 * Loans Routes
 * Routes untuk operasi peminjaman buku
 */

const express = require('express');
const router = express.Router();

const loanController = require('../controllers/loanController');
const { authenticateToken, requireLibrarian } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

/**
 * @route GET /api/loans
 * @desc Get all loans with filters
 * @access Private (Librarian/Admin)
 */
router.get('/',
    authenticateToken,
    requireLibrarian,
    validate(schemas.searchQuery, 'query'),
    loanController.getAllLoans
);

/**
 * @route GET /api/loans/active
 * @desc Get active loans (borrowed and overdue)
 * @access Private (Librarian/Admin)
 */
router.get('/active',
    authenticateToken,
    requireLibrarian,
    loanController.getActiveLoans
);

/**
 * @route GET /api/loans/overdue
 * @desc Get overdue loans
 * @access Private (Librarian/Admin)
 */
router.get('/overdue',
    authenticateToken,
    requireLibrarian,
    loanController.getOverdueLoans
);

/**
 * @route GET /api/loans/statistics
 * @desc Get loan statistics
 * @access Private (Librarian/Admin)
 */
router.get('/statistics',
    authenticateToken,
    requireLibrarian,
    loanController.getLoanStatistics
);

/**
 * @route GET /api/loans/:id
 * @desc Get loan by ID
 * @access Private (Librarian/Admin)
 */
router.get('/:id',
    authenticateToken,
    requireLibrarian,
    loanController.getLoanById
);

/**
 * @route POST /api/loans
 * @desc Create new loan (Pencatatan peminjaman)
 * @access Private (Librarian/Admin)
 */
router.post('/',
    authenticateToken,
    requireLibrarian,
    validate(schemas.createLoan),
    loanController.createLoan
);

/**
 * @route PUT /api/loans/:id/return
 * @desc Return book (Pengembalian buku)
 * @access Private (Librarian/Admin)
 */
router.put('/:id/return',
    authenticateToken,
    requireLibrarian,
    loanController.returnBook
);

module.exports = router;