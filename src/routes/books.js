/**
 * Books Routes
 * Routes untuk operasi CRUD buku (Katalog)
 */

const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const { authenticateToken, requireLibrarian, requireAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

/**
 * @route GET /api/books
 * @desc Get all books (Katalog untuk anggota)
 * @access Public
 */
router.get('/',
    validate(schemas.searchQuery, 'query'),
    bookController.getAllBooks
);

/**
 * @route GET /api/books/categories
 * @desc Get book categories
 * @access Public
 */
router.get('/categories',
    bookController.getCategories
);

/**
 * @route GET /api/books/:id
 * @desc Get book by ID
 * @access Public
 */
router.get('/:id',
    bookController.getBookById
);

/**
 * @route POST /api/books
 * @desc Create new book
 * @access Private (Librarian/Admin)
 */
router.post('/',
    authenticateToken,
    requireLibrarian,
    validate(schemas.createBook),
    bookController.createBook
);

/**
 * @route PUT /api/books/:id
 * @desc Update book
 * @access Private (Librarian/Admin)
 */
router.put('/:id',
    authenticateToken,
    requireLibrarian,
    validate(schemas.updateBook),
    bookController.updateBook
);

/**
 * @route DELETE /api/books/:id
 * @desc Delete book
 * @access Private (Admin only)
 */
router.delete('/:id',
    authenticateToken,
    requireAdmin,
    bookController.deleteBook
);

module.exports = router;