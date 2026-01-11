/**
 * Member Model
 * Model untuk entitas Anggota Perpustakaan
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Member Model - Representasi anggota perpustakaan
 * @class Member
 */
const Member = sequelize.define('Member', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    member_code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true, // Changed to true - will be set by beforeCreate hook
        validate: {
            notEmpty: {
                msg: 'Kode anggota tidak boleh kosong'
            },
            is: {
                args: /^MEM\d{3,}$/,
                msg: 'Format kode anggota tidak valid (contoh: MEM001)'
            }
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Nama anggota tidak boleh kosong'
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
    phone: {
        type: DataTypes.STRING(20),
        validate: {
            is: {
                args: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
                msg: 'Format nomor telepon tidak valid'
            }
        }
    },
    address: {
        type: DataTypes.TEXT
    },
    join_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: 'members',
    indexes: [
        {
            unique: true,
            fields: ['member_code']
        },
        {
            unique: true,
            fields: ['email']
        }
    ]
});

/**
 * Instance method untuk mengecek status aktif anggota
 * @returns {boolean} Status aktif
 */
Member.prototype.isActive = function () {
    return this.status === 'active';
};

/**
 * Instance method untuk mengaktifkan anggota
 * @returns {Promise<Member>} Updated member instance
 */
Member.prototype.activate = async function () {
    this.status = 'active';
    return await this.save();
};

/**
 * Instance method untuk menonaktifkan anggota
 * @returns {Promise<Member>} Updated member instance
 */
Member.prototype.deactivate = async function () {
    this.status = 'inactive';
    return await this.save();
};

/**
 * Static method untuk generate kode anggota baru
 * @returns {Promise<string>} Generated member code
 */
Member.generateMemberCode = async function () {
    const lastMember = await this.findOne({
        order: [['id', 'DESC']]
    });

    let nextNumber = 1;
    if (lastMember && lastMember.member_code) {
        const lastNumber = parseInt(lastMember.member_code.replace('MBR', ''));
        nextNumber = lastNumber + 1;
    }

    return `MBR${nextNumber.toString().padStart(3, '0')}`;
};

/**
 * Static method untuk mencari anggota berdasarkan kriteria
 * @param {string} query - Search query
 * @param {string} status - Member status
 * @returns {Promise<Member[]>} Array of members
 */
Member.searchMembers = async function (query = '', status = '') {
    const { Op } = require('sequelize');

    const whereClause = {};

    if (query) {
        whereClause[Op.or] = [
            { name: { [Op.like]: `%${query}%` } },
            { member_code: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } }
        ];
    }

    if (status) {
        whereClause.status = status;
    }

    return await this.findAll({
        where: whereClause,
        order: [['name', 'ASC']]
    });
};

/**
 * Hook untuk generate member code sebelum create
 */
Member.beforeCreate(async (member) => {
    if (!member.member_code) {
        member.member_code = await Member.generateMemberCode();
    }
});

module.exports = Member;