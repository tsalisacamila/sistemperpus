/**
 * Validation Middleware
 * Middleware untuk validasi input menggunakan Joi
 */

const Joi = require('joi');

/**
 * Generic validation middleware
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, query, params)
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessages = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validasi input gagal',
                errors: errorMessages
            });
        }

        // Replace request property with validated value
        req[property] = value;
        next();
    };
};

/**
 * Validation schemas
 */
const schemas = {
    // Book validation schemas
    createBook: Joi.object({
        title: Joi.string().min(1).max(255).required()
            .messages({
                'string.empty': 'Judul buku tidak boleh kosong',
                'string.max': 'Judul buku maksimal 255 karakter',
                'any.required': 'Judul buku wajib diisi'
            }),
        author: Joi.string().min(1).max(255).required()
            .messages({
                'string.empty': 'Nama penulis tidak boleh kosong',
                'any.required': 'Nama penulis wajib diisi'
            }),
        isbn: Joi.string().pattern(/^(97[89])[\d\-]{10,17}$/).allow('').optional()
            .messages({
                'string.pattern.base': 'Format ISBN tidak valid (contoh: 9780596517748 atau 978-0-596-51774-8)'
            }),
        category: Joi.string().valid('Programming', 'Database', 'Management', 'Computer Science', 'Web Development', 'Mobile Development', 'Other').optional(),
        publisher: Joi.string().max(255).optional(),
        publication_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
        total_copies: Joi.number().integer().min(1).default(1),
        description: Joi.string().optional()
    }),

    updateBook: Joi.object({
        title: Joi.string().min(1).max(255).optional(),
        author: Joi.string().min(1).max(255).optional(),
        isbn: Joi.string().pattern(/^(97[89])[\d\-]{10,17}$/).allow('').optional()
            .messages({
                'string.pattern.base': 'Format ISBN tidak valid (contoh: 9780596517748 atau 978-0-596-51774-8)'
            }),
        category: Joi.string().valid('Programming', 'Database', 'Management', 'Computer Science', 'Web Development', 'Mobile Development', 'Other').optional(),
        publisher: Joi.string().max(255).optional(),
        publication_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
        total_copies: Joi.number().integer().min(1).optional(),
        description: Joi.string().optional()
    }),

    // Member validation schemas
    createMember: Joi.object({
        name: Joi.string().min(2).max(255).required()
            .messages({
                'string.min': 'Nama minimal 2 karakter',
                'any.required': 'Nama wajib diisi'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Format email tidak valid',
                'any.required': 'Email wajib diisi'
            }),
        phone: Joi.string().pattern(/^(\+62|62|0)[0-9]{8,12}$/).max(15).optional()
            .messages({
                'string.pattern.base': 'Format nomor telepon tidak valid (contoh: 081234567890 atau +6281234567890)',
                'string.max': 'Nomor telepon maksimal 15 karakter'
            }),
        address: Joi.string().optional()
    }),

    updateMember: Joi.object({
        name: Joi.string().min(2).max(255).optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().pattern(/^(\+62|62|0)[0-9]{8,12}$/).max(15).optional(),
        address: Joi.string().optional(),
        status: Joi.string().valid('active', 'inactive').optional()
    }),

    // Staff validation schemas
    createStaff: Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
            .messages({
                'string.min': 'Password minimal 6 karakter',
                'any.required': 'Password wajib diisi'
            }),
        role: Joi.string().valid('admin', 'librarian').default('librarian')
    }),

    updateStaff: Joi.object({
        name: Joi.string().min(2).max(255).optional(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid('admin', 'librarian').optional(),
        status: Joi.string().valid('active', 'inactive').optional()
    }),

    // Loan validation schemas
    createLoan: Joi.object({
        member_id: Joi.number().integer().positive().required()
            .messages({
                'any.required': 'ID anggota wajib diisi',
                'number.positive': 'ID anggota harus berupa angka positif'
            }),
        book_id: Joi.number().integer().positive().required()
            .messages({
                'any.required': 'ID buku wajib diisi',
                'number.positive': 'ID buku harus berupa angka positif'
            }),
        loan_date: Joi.date().optional().default(new Date()),
        notes: Joi.string().optional().allow('').allow(null)
    }),

    // Authentication validation schemas
    login: Joi.object({
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Format email tidak valid',
                'any.required': 'Email wajib diisi'
            }),
        password: Joi.string().required()
            .messages({
                'any.required': 'Password wajib diisi'
            })
    }),

    // Search validation schemas
    searchQuery: Joi.object({
        q: Joi.string().optional(),
        category: Joi.string().optional(),
        status: Joi.string().optional(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10)
    })
};

module.exports = {
    validate,
    schemas
};