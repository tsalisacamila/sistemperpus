/**
 * Members Routes
 * Routes untuk operasi CRUD anggota perpustakaan
 */

const express = require('express');
const router = express.Router();

const memberController = require('../controllers/memberController');
const { authenticateToken, requireLibrarian } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

/**
 * @route GET /api/members
 * @desc Get all members
 * @access Private (Librarian/Admin)
 */
router.get('/',
    authenticateToken,
    requireLibrarian,
    validate(schemas.searchQuery, 'query'),
    memberController.getAllMembers
);

/**
 * @route GET /api/members/:id
 * @desc Get member by ID
 * @access Private (Librarian/Admin)
 */
router.get('/:id',
    authenticateToken,
    requireLibrarian,
    memberController.getMemberById
);

/**
 * @route POST /api/members
 * @desc Create new member
 * @access Private (Librarian/Admin)
 */
router.post('/',
    authenticateToken,
    requireLibrarian,
    validate(schemas.createMember),
    memberController.createMember
);

/**
 * @route PUT /api/members/:id
 * @desc Update member
 * @access Private (Librarian/Admin)
 */
router.put('/:id',
    authenticateToken,
    requireLibrarian,
    validate(schemas.updateMember),
    memberController.updateMember
);

/**
 * @route DELETE /api/members/:id
 * @desc Delete member
 * @access Private (Admin only)
 */
router.delete('/:id',
    authenticateToken,
    requireLibrarian,
    memberController.deleteMember
);

module.exports = router;