/**
 * Main Application File
 * Entry point untuk Library Management System
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database and models
const { testConnection, syncDatabase } = require('./config/database');
require('./models'); // Initialize models and associations

// Import routes
const apiRoutes = require('./routes');

/**
 * Create Express application
 */
const app = express();

/**
 * Security middleware
 */
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            upgradeInsecureRequests: null,
        },
    },
    hsts: false, // Disable HSTS for local development
}));

/**
 * CORS configuration
 */
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

/**
 * Rate limiting
 */
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === 'development' ? 500 : 100), // Higher limit for development
    message: {
        success: false,
        message: 'Terlalu banyak request dari IP ini, coba lagi nanti.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

/**
 * Body parsing middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request logging middleware (development only)
 */
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

/**
 * Static files middleware
 */
app.use(express.static('public'));

/**
 * API Routes
 */
app.use('/api', apiRoutes);

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Library Management System',
        version: '1.0.0',
        description: 'Sistem Manajemen Perpustakaan dengan Node.js dan MySQL',
        features: [
            'Katalog buku untuk anggota',
            'Pencatatan peminjaman oleh petugas',
            'Manajemen anggota perpustakaan',
            'Tracking peminjaman dan pengembalian',
            'Sistem autentikasi petugas'
        ],
        api_docs: '/api'
    });
});

/**
 * 404 handler
 */
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan',
        path: req.originalUrl
    });
});

/**
 * Global error handler
 */
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);

    // Sequelize errors
    if (error.name === 'SequelizeConnectionError') {
        return res.status(503).json({
            success: false,
            message: 'Database connection error'
        });
    }

    if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
            field: err.path,
            message: err.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validationErrors
        });
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Default error
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test database connection
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ Failed to connect to database. Exiting...');
            process.exit(1);
        }

        // Sync database (create tables if they don't exist)
        if (process.env.NODE_ENV === 'development') {
            await syncDatabase(false); // Don't force drop tables
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Library Management System running on port ${PORT}`);
            console.log(`📚 Environment: ${process.env.NODE_ENV}`);
            console.log(`🌐 API Documentation: http://localhost:${PORT}/api`);
            console.log(`💻 Health Check: http://localhost:${PORT}/api/health`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;