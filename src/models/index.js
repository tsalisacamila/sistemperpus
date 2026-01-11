/**
 * Models Index
 * Central file untuk mengatur semua model dan relasi database
 */

const { sequelize } = require('../config/database');

// Import semua model
const Book = require('./Book');
const Member = require('./Member');
const Staff = require('./Staff');
const Loan = require('./Loan');

/**
 * Setup relasi antar model
 */

// Relasi Loan dengan Member (Many-to-One)
Loan.belongsTo(Member, {
    foreignKey: 'member_id',
    as: 'Member'
});
Member.hasMany(Loan, {
    foreignKey: 'member_id',
    as: 'Loans'
});

// Relasi Loan dengan Book (Many-to-One)
Loan.belongsTo(Book, {
    foreignKey: 'book_id',
    as: 'Book'
});
Book.hasMany(Loan, {
    foreignKey: 'book_id',
    as: 'Loans'
});

// Relasi Loan dengan Staff (Many-to-One)
Loan.belongsTo(Staff, {
    foreignKey: 'staff_id',
    as: 'Staff'
});
Staff.hasMany(Loan, {
    foreignKey: 'staff_id',
    as: 'Loans'
});

/**
 * Export semua model dan sequelize instance
 */
module.exports = {
    sequelize,
    Book,
    Member,
    Staff,
    Loan
};