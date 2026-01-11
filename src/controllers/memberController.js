/**
 * Member Controller
 * Controller untuk menangani operasi CRUD anggota perpustakaan
 */

const { Member } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all members
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllMembers = async (req, res) => {
    try {
        const { q, status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const whereClause = {};

        if (q) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${q}%` } },
                { member_code: { [Op.like]: `%${q}%` } },
                { email: { [Op.like]: `%${q}%` } }
            ];
        }

        if (status) {
            whereClause.status = status;
        }

        // Get members with pagination
        const { count, rows: members } = await Member.findAndCountAll({
            where: whereClause,
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
            message: 'Data anggota berhasil diambil',
            data: {
                members,
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
        console.error('Get all members error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data anggota',
            error: error.message
        });
    }
};

/**
 * Get member by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMemberById = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await Member.findByPk(id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Detail anggota berhasil diambil',
            data: member
        });

    } catch (error) {
        console.error('Get member by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil detail anggota',
            error: error.message
        });
    }
};

/**
 * Create new member
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createMember = async (req, res) => {
    try {
        const memberData = req.body;

        const member = await Member.create(memberData);

        res.status(201).json({
            success: true,
            message: 'Anggota berhasil ditambahkan',
            data: member
        });

    } catch (error) {
        console.error('Create member error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar',
                error: 'Duplicate email'
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
            message: 'Terjadi kesalahan saat menambahkan anggota',
            error: error.message
        });
    }
};

/**
 * Update member
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const member = await Member.findByPk(id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tidak ditemukan'
            });
        }

        await member.update(updateData);

        res.json({
            success: true,
            message: 'Anggota berhasil diperbarui',
            data: member
        });

    } catch (error) {
        console.error('Update member error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar',
                error: 'Duplicate email'
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
            message: 'Terjadi kesalahan saat memperbarui anggota',
            error: error.message
        });
    }
};

/**
 * Delete member
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await Member.findByPk(id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tidak ditemukan'
            });
        }

        // Check if member has active loans
        const { Loan } = require('../models');
        const activeLoans = await Loan.count({
            where: {
                member_id: id,
                status: ['borrowed', 'overdue']
            }
        });

        if (activeLoans > 0) {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus anggota yang masih memiliki peminjaman aktif'
            });
        }

        await member.destroy();

        res.json({
            success: true,
            message: 'Anggota berhasil dihapus'
        });

    } catch (error) {
        console.error('Delete member error:', error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus anggota karena masih memiliki data terkait'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus anggota',
            error: error.message
        });
    }
};

module.exports = {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
};