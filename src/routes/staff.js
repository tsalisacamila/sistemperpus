/**
 * Staff Routes
 * Routes untuk manajemen staff (Admin only)
 */

const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staffController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

/**
 * @route GET /api/staff
 * @desc Get all staff
 * @access Private (Admin only)
 */
router.get('/',
    authenticateToken,
    requireAdmin,
    validate(schemas.searchQuery, 'query'),
    staffController.getAllStaff
);

/**
 * @route GET /api/staff/statistics
 * @desc Get staff statistics
 * @access Private (Admin only)
 */
router.get('/statistics',
    authenticateToken,
    requireAdmin,
    staffController.getStaffStatistics
);

/**
 * @route GET /api/staff/:id
 * @desc Get staff by ID
 * @access Private (Admin only)
 */
router.get('/:id',
    authenticateToken,
    requireAdmin,
    staffController.getStaffById
);

/**
 * @route POST /api/staff
 * @desc Create new staff
 * @access Private (Admin only)
 */
router.post('/',
    authenticateToken,
    requireAdmin,
    validate(schemas.createStaff),
    staffController.createStaff
);

/**
 * @route PUT /api/staff/:id
 * @desc Update staff
 * @access Private (Admin only)
 */
router.put('/:id',
    authenticateToken,
    requireAdmin,
    validate(schemas.updateStaff),
    staffController.updateStaff
);

/**
 * @route DELETE /api/staff/:id
 * @desc Delete staff
 * @access Private (Admin only)
 */
router.delete('/:id',
    authenticateToken,
    requireAdmin,
    staffController.deleteStaff
);

/**
 * @route PUT /api/staff/:id/reset-password
 * @desc Reset staff password
 * @access Private (Admin only)
 */
router.put('/:id/reset-password',
    authenticateToken,
    requireAdmin,
    validate({
        newPassword: require('joi').string().min(6).required()
            .messages({
                'string.min': 'Password minimal 6 karakter',
                'any.required': 'Password baru wajib diisi'
            })
    }),
    staffController.resetPassword
);

module.exports = router;