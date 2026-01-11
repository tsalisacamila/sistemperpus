/**
 * Loan Model
 * Model untuk entitas Peminjaman Buku
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Loan Model - Representasi peminjaman buku
 * @class Loan
 */
const Loan = sequelize.define('Loan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    loan_code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true, // Changed to true - will be set by beforeCreate hook
        validate: {
            notEmpty: {
                msg: 'Kode peminjaman tidak boleh kosong'
            },
            is: {
                args: /^LN\d{6,}$/,
                msg: 'Format kode peminjaman tidak valid (contoh: LN000001)'
            }
        }
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'members',
            key: 'id'
        }
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'books',
            key: 'id'
        }
    },
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'staff',
            key: 'id'
        }
    },
    loan_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: {
                msg: 'Format tanggal pinjam tidak valid'
            }
        }
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true, // Changed to true - will be set by beforeCreate hook
        validate: {
            isDate: {
                msg: 'Format tanggal kembali tidak valid'
            },
            isAfterLoanDate(value) {
                if (value && this.loan_date && value <= this.loan_date) {
                    throw new Error('Tanggal kembali harus setelah tanggal pinjam');
                }
            }
        }
    },
    return_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: 'Format tanggal pengembalian tidak valid'
            }
        }
    },
    status: {
        type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
        defaultValue: 'borrowed',
        validate: {
            isIn: {
                args: [['borrowed', 'returned', 'overdue']],
                msg: 'Status harus borrowed, returned, atau overdue'
            }
        }
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'loans',
    indexes: [
        {
            unique: true,
            fields: ['loan_code']
        },
        {
            fields: ['status']
        },
        {
            fields: ['loan_date', 'due_date']
        }
    ]
});

/**
 * Instance method untuk mengecek apakah peminjaman terlambat
 * @returns {boolean} Overdue status
 */
Loan.prototype.isOverdue = function () {
    if (this.status === 'returned') {
        return false;
    }

    const today = new Date();
    const dueDate = new Date(this.due_date);
    return today > dueDate;
};

/**
 * Instance method untuk menghitung hari keterlambatan
 * @returns {number} Days overdue (0 if not overdue)
 */
Loan.prototype.getDaysOverdue = function () {
    if (this.status === 'returned') {
        return 0;
    }

    const today = new Date();
    const dueDate = new Date(this.due_date);

    if (today <= dueDate) {
        return 0;
    }

    const diffTime = today - dueDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Instance method untuk mengembalikan buku
 * @returns {Promise<Loan>} Updated loan instance
 */
Loan.prototype.returnBook = async function () {
    if (this.status === 'returned') {
        throw new Error('Buku sudah dikembalikan sebelumnya');
    }

    this.return_date = new Date();
    this.status = 'returned';
    return await this.save();
};

/**
 * Static method untuk generate kode peminjaman baru
 * @returns {Promise<string>} Generated loan code
 */
Loan.generateLoanCode = async function () {
    const lastLoan = await this.findOne({
        order: [['id', 'DESC']]
    });

    let nextNumber = 1;
    if (lastLoan && lastLoan.loan_code) {
        const lastNumber = parseInt(lastLoan.loan_code.replace('LN', ''));
        nextNumber = lastNumber + 1;
    }

    return `LN${nextNumber.toString().padStart(6, '0')}`;
};

/**
 * Static method untuk menghitung tanggal kembali (7 hari dari tanggal pinjam)
 * @param {Date} loanDate - Loan date
 * @returns {Date} Due date
 */
Loan.calculateDueDate = function (loanDate = new Date()) {
    const dueDate = new Date(loanDate);
    dueDate.setDate(dueDate.getDate() + 7); // 7 hari dari tanggal pinjam
    return dueDate;
};

/**
 * Static method untuk mendapatkan peminjaman aktif
 * @param {number} memberId - Member ID (optional)
 * @returns {Promise<Loan[]>} Active loans
 */
Loan.getActiveLoans = async function (memberId = null) {
    const whereClause = {
        status: ['borrowed', 'overdue']
    };

    if (memberId) {
        whereClause.member_id = memberId;
    }

    return await this.findAll({
        where: whereClause,
        include: ['Member', 'Book', 'Staff'],
        order: [['loan_date', 'DESC']]
    });
};

/**
 * Static method untuk update status overdue
 * @returns {Promise<number>} Number of updated records
 */
Loan.updateOverdueStatus = async function () {
    const { Op } = require('sequelize');

    const [updatedCount] = await this.update(
        { status: 'overdue' },
        {
            where: {
                status: 'borrowed',
                due_date: {
                    [Op.lt]: new Date()
                }
            }
        }
    );

    return updatedCount;
};

/**
 * Hook untuk generate loan code dan calculate due date sebelum create
 */
Loan.beforeCreate(async (loan) => {
    if (!loan.loan_code) {
        loan.loan_code = await Loan.generateLoanCode();
    }

    if (!loan.due_date && loan.loan_date) {
        loan.due_date = Loan.calculateDueDate(loan.loan_date);
    }
});

module.exports = Loan;