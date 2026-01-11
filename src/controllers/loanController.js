/**
 * Loan Controller
 * Controller untuk menangani operasi peminjaman buku
 */

const { Loan, Book, Member, Staff } = require('../models');
const { Op } = require('sequelize');

/**
 * Create new loan (Pencatatan peminjaman oleh petugas)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createLoan = async (req, res) => {
    try {
        const { member_id, book_id, loan_date, notes } = req.body;
        const staff_id = req.staff.id;

        // Validate member exists and is active
        const member = await Member.findByPk(member_id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tidak ditemukan'
            });
        }

        if (!member.isActive()) {
            return res.status(400).json({
                success: false,
                message: 'Anggota tidak aktif'
            });
        }

        // Validate book exists and is available
        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Buku tidak ditemukan'
            });
        }

        if (!book.isAvailable()) {
            return res.status(400).json({
                success: false,
                message: 'Buku tidak tersedia untuk dipinjam'
            });
        }

        // Check if member has overdue loans
        const overdueLoans = await Loan.count({
            where: {
                member_id,
                status: 'overdue'
            }
        });

        if (overdueLoans > 0) {
            return res.status(400).json({
                success: false,
                message: 'Anggota memiliki peminjaman yang terlambat. Harap kembalikan buku terlebih dahulu.'
            });
        }

        // Create loan
        const loanData = {
            member_id,
            book_id,
            staff_id,
            loan_date: loan_date || new Date(),
            notes
        };

        const loan = await Loan.create(loanData);

        // Update book availability
        await book.borrowBook();

        // Get loan with associations
        const loanWithDetails = await Loan.findByPk(loan.id, {
            include: [
                { model: Member, as: 'Member' },
                { model: Book, as: 'Book' },
                { model: Staff, as: 'Staff' }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Peminjaman berhasil dicatat',
            data: loanWithDetails
        });

    } catch (error) {
        console.error('Create loan error:', error);

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
            message: 'Terjadi kesalahan saat mencatat peminjaman',
            error: error.message
        });
    }
};

/**
 * Get all loans with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllLoans = async (req, res) => {
    try {
        const { status, member_id, book_id, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const whereClause = {};

        if (status) {
            whereClause.status = status;
        }

        if (member_id) {
            whereClause.member_id = member_id;
        }

        if (book_id) {
            whereClause.book_id = book_id;
        }

        // Update overdue status before fetching
        await Loan.updateOverdueStatus();

        // Get loans with pagination
        const { count, rows: loans } = await Loan.findAndCountAll({
            where: whereClause,
            include: [
                { model: Member, as: 'Member' },
                { model: Book, as: 'Book' },
                { model: Staff, as: 'Staff' }
            ],
            order: [['loan_date', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            success: true,
            message: 'Data peminjaman berhasil diambil',
            data: {
                loans,
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
        console.error('Get all loans error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data peminjaman',
            error: error.message
        });
    }
};

/**
 * Get loan by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLoanById = async (req, res) => {
    try {
        const { id } = req.params;

        const loan = await Loan.findByPk(id, {
            include: [
                { model: Member, as: 'Member' },
                { model: Book, as: 'Book' },
                { model: Staff, as: 'Staff' }
            ]
        });

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Data peminjaman tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Detail peminjaman berhasil diambil',
            data: loan
        });

    } catch (error) {
        console.error('Get loan by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil detail peminjaman',
            error: error.message
        });
    }
};

/**
 * Return book (Pengembalian buku)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const loan = await Loan.findByPk(id, {
            include: [
                { model: Member, as: 'Member' },
                { model: Book, as: 'Book' },
                { model: Staff, as: 'Staff' }
            ]
        });

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Data peminjaman tidak ditemukan'
            });
        }

        if (loan.status === 'returned') {
            return res.status(400).json({
                success: false,
                message: 'Buku sudah dikembalikan sebelumnya'
            });
        }

        // Return the book
        await loan.returnBook();

        // Update notes if provided
        if (notes) {
            loan.notes = notes;
            await loan.save();
        }

        // Update book availability
        const book = await Book.findByPk(loan.book_id);
        await book.returnBook();

        // Reload loan with updated data
        await loan.reload();

        res.json({
            success: true,
            message: 'Buku berhasil dikembalikan',
            data: loan
        });

    } catch (error) {
        console.error('Return book error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengembalikan buku',
            error: error.message
        });
    }
};

/**
 * Get active loans (borrowed and overdue)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getActiveLoans = async (req, res) => {
    try {
        const { member_id } = req.query;

        // Update overdue status first
        await Loan.updateOverdueStatus();

        const activeLoans = await Loan.getActiveLoans(member_id);

        res.json({
            success: true,
            message: 'Peminjaman aktif berhasil diambil',
            data: activeLoans
        });

    } catch (error) {
        console.error('Get active loans error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil peminjaman aktif',
            error: error.message
        });
    }
};

/**
 * Get overdue loans
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getOverdueLoans = async (req, res) => {
    try {
        // Update overdue status first
        await Loan.updateOverdueStatus();

        const overdueLoans = await Loan.findAll({
            where: {
                status: 'overdue'
            },
            include: [
                { model: Member, as: 'Member' },
                { model: Book, as: 'Book' },
                { model: Staff, as: 'Staff' }
            ],
            order: [['due_date', 'ASC']]
        });

        res.json({
            success: true,
            message: 'Peminjaman terlambat berhasil diambil',
            data: overdueLoans
        });

    } catch (error) {
        console.error('Get overdue loans error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil peminjaman terlambat',
            error: error.message
        });
    }
};

/**
 * Get loan statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLoanStatistics = async (req, res) => {
    try {
        // Update overdue status first
        await Loan.updateOverdueStatus();

        const stats = await Promise.all([
            Loan.count({ where: { status: 'borrowed' } }),
            Loan.count({ where: { status: 'overdue' } }),
            Loan.count({ where: { status: 'returned' } }),
            Loan.count()
        ]);

        const [borrowed, overdue, returned, total] = stats;

        res.json({
            success: true,
            message: 'Statistik peminjaman berhasil diambil',
            data: {
                borrowed,
                overdue,
                returned,
                total,
                active: borrowed + overdue
            }
        });

    } catch (error) {
        console.error('Get loan statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil statistik peminjaman',
            error: error.message
        });
    }
};

module.exports = {
    createLoan,
    getAllLoans,
    getLoanById,
    returnBook,
    getActiveLoans,
    getOverdueLoans,
    getLoanStatistics
};