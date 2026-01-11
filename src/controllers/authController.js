/**
 * Authentication Controller
 * Controller untuk menangani autentikasi petugas
 */

const { Staff } = require('../models');
const { generateToken } = require('../middleware/auth');

/**
 * Login petugas
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Authenticate staff
        const staff = await Staff.authenticate(email, password);

        if (!staff) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password tidak valid'
            });
        }

        // Generate token
        const token = generateToken(staff);

        // Return success response
        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                staff: {
                    id: staff.id,
                    staff_code: staff.staff_code,
                    name: staff.name,
                    email: staff.email,
                    role: staff.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login',
            error: error.message
        });
    }
};

/**
 * Get current staff profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
    try {
        const staff = req.staff;

        res.json({
            success: true,
            message: 'Profil petugas berhasil diambil',
            data: {
                id: staff.id,
                staff_code: staff.staff_code,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                status: staff.status,
                created_at: staff.created_at
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil profil',
            error: error.message
        });
    }
};

/**
 * Change password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const staff = req.staff;

        // Validate current password
        const isValidPassword = await staff.validatePassword(currentPassword);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password saat ini tidak valid'
            });
        }

        // Change password
        await staff.changePassword(newPassword);

        res.json({
            success: true,
            message: 'Password berhasil diubah'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengubah password',
            error: error.message
        });
    }
};

/**
 * Logout (client-side token removal)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = async (req, res) => {
    try {
        // Since we're using stateless JWT, logout is handled client-side
        // This endpoint is mainly for logging purposes

        res.json({
            success: true,
            message: 'Logout berhasil'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat logout',
            error: error.message
        });
    }
};

module.exports = {
    login,
    getProfile,
    changePassword,
    logout
};