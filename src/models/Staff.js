/**
 * Staff Model
 * Model untuk entitas Petugas Perpustakaan
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

/**
 * Staff Model - Representasi petugas perpustakaan
 * @class Staff
 */
const Staff = sequelize.define('Staff', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    staff_code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Kode petugas tidak boleh kosong'
            },
            is: {
                args: /^STF\d{3,}$/,
                msg: 'Format kode petugas tidak valid (contoh: STF001)'
            }
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Nama petugas tidak boleh kosong'
            },
            len: {
                args: [2, 255],
                msg: 'Nama harus antara 2-255 karakter'
            }
        }
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Format email tidak valid'
            },
            notEmpty: {
                msg: 'Email tidak boleh kosong'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'Password minimal 6 karakter'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'librarian'),
        defaultValue: 'librarian',
        validate: {
            isIn: {
                args: [['admin', 'librarian']],
                msg: 'Role harus admin atau librarian'
            }
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: 'staff',
    indexes: [
        {
            unique: true,
            fields: ['staff_code']
        },
        {
            unique: true,
            fields: ['email']
        }
    ]
});

/**
 * Instance method untuk mengecek status aktif petugas
 * @returns {boolean} Status aktif
 */
Staff.prototype.isActive = function () {
    return this.status === 'active';
};

/**
 * Instance method untuk mengecek role admin
 * @returns {boolean} Is admin
 */
Staff.prototype.isAdmin = function () {
    return this.role === 'admin';
};

/**
 * Instance method untuk validasi password
 * @param {string} password - Password to validate
 * @returns {Promise<boolean>} Password match status
 */
Staff.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/**
 * Instance method untuk mengubah password
 * @param {string} newPassword - New password
 * @returns {Promise<Staff>} Updated staff instance
 */
Staff.prototype.changePassword = async function (newPassword) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(newPassword, saltRounds);
    return await this.save();
};

/**
 * Static method untuk generate kode petugas baru
 * @returns {Promise<string>} Generated staff code
 */
Staff.generateStaffCode = async function () {
    const lastStaff = await this.findOne({
        order: [['id', 'DESC']]
    });

    let nextNumber = 1;
    if (lastStaff && lastStaff.staff_code) {
        const lastNumber = parseInt(lastStaff.staff_code.replace('STF', ''));
        nextNumber = lastNumber + 1;
    }

    return `STF${nextNumber.toString().padStart(3, '0')}`;
};

/**
 * Static method untuk login authentication
 * @param {string} email - Staff email
 * @param {string} password - Staff password
 * @returns {Promise<Staff|null>} Authenticated staff or null
 */
Staff.authenticate = async function (email, password) {
    const staff = await this.findOne({
        where: {
            email,
            status: 'active'
        }
    });

    if (!staff) {
        return null;
    }

    const isValidPassword = await staff.validatePassword(password);
    if (!isValidPassword) {
        return null;
    }

    return staff;
};

/**
 * Hook untuk hash password sebelum create
 */
Staff.beforeCreate(async (staff) => {
    if (!staff.staff_code) {
        staff.staff_code = await Staff.generateStaffCode();
    }

    if (staff.password) {
        const saltRounds = 10;
        staff.password = await bcrypt.hash(staff.password, saltRounds);
    }
});

/**
 * Hook untuk hash password sebelum update jika password berubah
 */
Staff.beforeUpdate(async (staff) => {
    if (staff.changed('password')) {
        const saltRounds = 10;
        staff.password = await bcrypt.hash(staff.password, saltRounds);
    }
});

module.exports = Staff;