/**
 * Authentication Middleware
 * Middleware untuk autentikasi dan autorisasi petugas
 */

const jwt = require('jsonwebtoken');
const { Staff } = require('../models');

/**
 * Middleware untuk verifikasi JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token akses diperlukan'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get staff data
        const staff = await Staff.findByPk(decoded.staffId);
        if (!staff || !staff.isActive()) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid atau petugas tidak aktif'
            });
        }

        // Attach staff to request
        req.staff = staff;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token sudah kadaluarsa'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error dalam verifikasi token',
            error: error.message
        });
    }
};

/**
 * Middleware untuk verifikasi role admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdmin = (req, res, next) => {
    if (!req.staff || !req.staff.isAdmin()) {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya admin yang diizinkan.'
        });
    }
    next();
};

/**
 * Middleware untuk verifikasi role librarian atau admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireLibrarian = (req, res, next) => {
    if (!req.staff || (req.staff.role !== 'librarian' && req.staff.role !== 'admin')) {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya petugas perpustakaan yang diizinkan.'
        });
    }
    next();
};

/**
 * Generate JWT token untuk staff
 * @param {Object} staff - Staff object
 * @returns {string} JWT token
 */
const generateToken = (staff) => {
    return jwt.sign(
        {
            staffId: staff.id,
            email: staff.email,
            role: staff.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h'
        }
    );
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireLibrarian,
    generateToken
};