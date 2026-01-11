/**
 * Book Model
 * Model untuk entitas Buku dalam sistem perpustakaan
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Book Model - Representasi koleksi buku perpustakaan
 * @class Book
 */
const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Judul buku tidak boleh kosong'
            },
            len: {
                args: [1, 255],
                msg: 'Judul buku harus antara 1-255 karakter'
            }
        }
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Nama penulis tidak boleh kosong'
            }
        }
    },
    isbn: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(100),
        validate: {
            isIn: {
                args: [['Programming', 'Database', 'Management', 'Computer Science', 'Web Development', 'Mobile Development', 'Other']],
                msg: 'Kategori tidak valid'
            }
        }
    },
    publisher: {
        type: DataTypes.STRING(255)
    },
    publication_year: {
        type: DataTypes.INTEGER,
        validate: {
            min: {
                args: 1900,
                msg: 'Tahun publikasi minimal 1900'
            },
            max: {
                args: new Date().getFullYear(),
                msg: 'Tahun publikasi tidak boleh melebihi tahun sekarang'
            }
        }
    },
    total_copies: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: {
                args: [1],
                msg: 'Jumlah total buku minimal 1'
            }
        }
    },
    available_copies: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            isInt: {
                msg: 'Jumlah buku tersedia harus berupa angka'
            },
            min: {
                args: [0],
                msg: 'Jumlah buku tersedia tidak boleh negatif'
            }
        }
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'books',
    indexes: [
        {
            fields: ['title']
        },
        {
            fields: ['author']
        },
        {
            fields: ['category']
        }
    ]
});

/**
 * Instance method untuk mengecek ketersediaan buku
 * @returns {boolean} Status ketersediaan
 */
Book.prototype.isAvailable = function () {
    return this.available_copies > 0;
};

/**
 * Instance method untuk mengurangi stok buku saat dipinjam
 * @returns {Promise<Book>} Updated book instance
 */
Book.prototype.borrowBook = async function () {
    if (this.available_copies <= 0) {
        throw new Error('Buku tidak tersedia untuk dipinjam');
    }

    this.available_copies -= 1;
    return await this.save();
};

/**
 * Instance method untuk menambah stok buku saat dikembalikan
 * @returns {Promise<Book>} Updated book instance
 */
Book.prototype.returnBook = async function () {
    if (this.available_copies >= this.total_copies) {
        throw new Error('Semua buku sudah dikembalikan');
    }

    this.available_copies += 1;
    return await this.save();
};

/**
 * Static method untuk mencari buku berdasarkan kriteria
 * @param {string} query - Search query
 * @param {string} category - Book category
 * @returns {Promise<Book[]>} Array of books
 */
Book.searchBooks = async function (query = '', category = '') {
    const { Op } = require('sequelize');

    const whereClause = {};

    if (query) {
        whereClause[Op.or] = [
            { title: { [Op.like]: `%${query}%` } },
            { author: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } }
        ];
    }

    if (category) {
        whereClause.category = category;
    }

    return await this.findAll({
        where: whereClause,
        order: [['title', 'ASC']]
    });
};

module.exports = Book;