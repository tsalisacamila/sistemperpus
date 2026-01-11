/**
 * Book Controller
 * Controller untuk menangani operasi CRUD buku (Katalog)
 */

const { Book } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all books (Katalog untuk anggota)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllBooks = async (req, res) => {
    try {
        const { q, category, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const whereClause = {};

        if (q) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${q}%` } },
                { author: { [Op.like]: `%${q}%` } },
                { description: { [Op.like]: `%${q}%` } }
            ];
        }

        if (category) {
            whereClause.category = category;
        }

        // Get books with pagination
        const { count, rows: books } = await Book.findAndCountAll({
            where: whereClause,
            order: [['title', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            success: true,
            message: 'Katalog buku berhasil diambil',
            data: {
                books,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit),
                    hasNextPage,
                    hasPrevPage
                }
            }
        });

    } catch (error) {
        console.error('Get all books error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil katalog buku',
            error: error.message
        });
    }
};

/**
 * Get book by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Buku tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Detail buku berhasil diambil',
            data: book
        });

    } catch (error) {
        console.error('Get book by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil detail buku',
            error: error.message
        });
    }
};

/**
 * Create new book (Admin/Librarian only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createBook = async (req, res) => {
    try {
        const bookData = req.body;

        // Set available_copies equal to total_copies for new book
        if (bookData.total_copies) {
            bookData.available_copies = bookData.total_copies;
        }

        const book = await Book.create(bookData);

        res.status(201).json({
            success: true,
            message: 'Buku berhasil ditambahkan',
            data: book
        });

    } catch (error) {
        console.error('Create book error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'ISBN sudah terdaftar',
                error: 'Duplicate ISBN'
            });
        }

        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validasi data gagal',
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menambahkan buku',
            error: error.message
        });
    }
};

/**
 * Update book (Admin/Librarian only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Buku tidak ditemukan'
            });
        }

        // If total_copies is updated, adjust available_copies proportionally
        if (updateData.total_copies && updateData.total_copies !== book.total_copies) {
            const borrowedCopies = book.total_copies - book.available_copies;
            updateData.available_copies = Math.max(0, updateData.total_copies - borrowedCopies);
        }

        await book.update(updateData);

        res.json({
            success: true,
            message: 'Buku berhasil diperbarui',
            data: book
        });

    } catch (error) {
        console.error('Update book error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'ISBN sudah terdaftar',
                error: 'Duplicate ISBN'
            });
        }

        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validasi data gagal',
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memperbarui buku',
            error: error.message
        });
    }
};

/**
 * Delete book (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Buku tidak ditemukan'
            });
        }

        // Check if book has active loans
        const { Loan } = require('../models');
        const activeLoans = await Loan.count({
            where: {
                book_id: id,
                status: ['borrowed', 'overdue']
            }
        });

        if (activeLoans > 0) {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus buku yang sedang dipinjam'
            });
        }

        await book.destroy();

        res.json({
            success: true,
            message: 'Buku berhasil dihapus'
        });

    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus buku',
            error: error.message
        });
    }
};

/**
 * Get book categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCategories = async (req, res) => {
    try {
        const categories = [
            'Programming',
            'Database',
            'Management',
            'Computer Science',
            'Web Development',
            'Mobile Development',
            'Other'
        ];

        res.json({
            success: true,
            message: 'Kategori buku berhasil diambil',
            data: categories
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil kategori',
            error: error.message
        });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getCategories
};