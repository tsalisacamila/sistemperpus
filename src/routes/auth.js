/**
 * Authentication Routes
 * Routes untuk autentikasi petugas
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

/**
 * @route POST /api/auth/login
 * @desc Login petugas
 * @access Public
 */
router.post('/login',
    validate(schemas.login),
    authController.login
);

/**
 * @route GET /api/auth/profile
 * @desc Get current staff profile
 * @access Private
 */
router.get('/profile',
    authenticateToken,
    authController.getProfile
);

/**
 * @route PUT /api/auth/change-password
 * @desc Change password
 * @access Private
 */
router.put('/change-password',
    authenticateToken,
    validate({
        currentPassword: require('joi').string().required(),
        newPassword: require('joi').string().min(6).required()
    }),
    authController.changePassword
);

/**
 * @route POST /api/auth/logout
 * @desc Logout (client-side token removal)
 * @access Private
 */
router.post('/logout',
    authenticateToken,
    authController.logout
);

module.exports = router;