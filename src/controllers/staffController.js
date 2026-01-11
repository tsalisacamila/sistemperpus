/**
 * Staff Controller
 * Controller untuk menangani manajemen staff (Admin only)
 */

const { Staff } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all staff (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllStaff = async (req, res) => {
    try {
        const { q, role, status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const whereClause = {};

        if (q) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${q}%` } },
                { staff_code: { [Op.like]: `%${q}%` } },
                { email: { [Op.like]: `%${q}%` } }
            ];
        }

        if (role) {
            whereClause.role = role;
        }

        if (status) {
            whereClause.status = status;
        }

        // Get staff with pagination (exclude password)
        const { count, rows: staff } = await Staff.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            success: true,
            message: 'Data staff berhasil diambil',
            data: {
                staff,
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
        console.error('Get all staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data staff',
            error: error.message
        });
    }
};

/**
 * Get staff by ID (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Staff.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Detail staff berhasil diambil',
            data: staff
        });

    } catch (error) {
        console.error('Get staff by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil detail staff',
            error: error.message
        });
    }
};

/**
 * Create new staff (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createStaff = async (req, res) => {
    try {
        const staffData = req.body;

        const staff = await Staff.create(staffData);

        // Return staff data without password
        const staffResponse = await Staff.findByPk(staff.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(201).json({
            success: true,
            message: 'Staff berhasil ditambahkan',
            data: staffResponse
        });

    } catch (error) {
        console.error('Create staff error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Email atau kode staff sudah terdaftar',
                error: 'Duplicate entry'
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
            message: 'Terjadi kesalahan saat menambahkan staff',
            error: error.message
        });
    }
};

/**
 * Update staff (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const staff = await Staff.findByPk(id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff tidak ditemukan'
            });
        }

        // Prevent admin from changing their own role to librarian
        if (req.staff.id === parseInt(id) && updateData.role === 'librarian') {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat mengubah role admin sendiri'
            });
        }

        await staff.update(updateData);

        // Return updated staff data without password
        const updatedStaff = await Staff.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        res.json({
            success: true,
            message: 'Staff berhasil diperbarui',
            data: updatedStaff
        });

    } catch (error) {
        console.error('Update staff error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Email atau kode staff sudah terdaftar',
                error: 'Duplicate entry'
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
            message: 'Terjadi kesalahan saat memperbarui staff',
            error: error.message
        });
    }
};

/**
 * Delete staff (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Staff.findByPk(id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff tidak ditemukan'
            });
        }

        // Prevent admin from deleting themselves
        if (req.staff.id === parseInt(id)) {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus akun sendiri'
            });
        }

        // Check if staff has active loans
        const { Loan } = require('../models');
        const activeLoans = await Loan.count({
            where: {
                staff_id: id,
                status: ['borrowed', 'overdue']
            }
        });

        if (activeLoans > 0) {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus staff yang memiliki peminjaman aktif'
            });
        }

        await staff.destroy();

        res.json({
            success: true,
            message: 'Staff berhasil dihapus'
        });

    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus staff',
            error: error.message
        });
    }
};

/**
 * Reset staff password (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const staff = await Staff.findByPk(id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff tidak ditemukan'
            });
        }

        await staff.changePassword(newPassword);

        res.json({
            success: true,
            message: 'Password staff berhasil direset'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mereset password',
            error: error.message
        });
    }
};

/**
 * Get staff statistics (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStaffStatistics = async (req, res) => {
    try {
        const stats = await Promise.all([
            Staff.count({ where: { role: 'admin' } }),
            Staff.count({ where: { role: 'librarian' } }),
            Staff.count({ where: { status: 'active' } }),
            Staff.count({ where: { status: 'inactive' } }),
            Staff.count()
        ]);

        const [admins, librarians, active, inactive, total] = stats;

        res.json({
            success: true,
            message: 'Statistik staff berhasil diambil',
            data: {
                admins,
                librarians,
                active,
                inactive,
                total
            }
        });

    } catch (error) {
        console.error('Get staff statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil statistik staff',
            error: error.message
        });
    }
};

module.exports = {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    resetPassword,
    getStaffStatistics
};