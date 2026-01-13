require('dotenv').config();
const { sequelize, testConnection, syncDatabase } = require('../src/config/database');
const { Staff, Book, Member } = require('../src/models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('Seeding initial data...');

        // Create admin user
        const adminExists = await Staff.findOne({ where: { email: 'admin@library.com' } });
        if (!adminExists) {
            await Staff.create({
                staff_code: 'STF001',
                name: 'Administrator',
                email: 'admin@library.com',
                password: 'adminsuper123',
                role: 'admin'
            });
            console.log('admin user created (admin@library.com / adminsuper123)');
        } else {
            console.log('admin user already exists');
        }

        // Create sample librarian
        const librarianExists = await Staff.findOne({ where: { email: 'librarian@library.com' } });
        if (!librarianExists) {
            await Staff.create({
                staff_code: 'STF002',
                name: 'Pustakawan',
                email: 'librarian@library.com',
                password: 'librarian123', 
                role: 'librarian'
            });
            console.log('Librarian user created (librarian@library.com / librarian123)');
        } else {
            console.log('Librarian user already exists');
        }

        // Create sample books
        const bookCount = await Book.count();
        if (bookCount === 0) {
            const sampleBooks = [
                {
                    title: 'JavaScript: The Good Parts',
                    author: 'Douglas Crockford',
                    isbn: '9780596517748',
                    category: 'Programming',
                    publisher: "O'Reilly Media",
                    publication_year: 2008,
                    total_copies: 5,
                    available_copies: 5
                },
                {
                    title: 'Clean Code',
                    author: 'Robert C. Martin',
                    isbn: '9780132350884',
                    category: 'Programming',
                    publisher: 'Prentice Hall',
                    publication_year: 2008,
                    total_copies: 3,
                    available_copies: 3
                },
                {
                    title: 'Database System Concepts',
                    author: 'Abraham Silberschatz',
                    isbn: '9780078022159',
                    category: 'Database',
                    publisher: 'McGraw-Hill',
                    publication_year: 2019,
                    total_copies: 4,
                    available_copies: 4
                },
                {
                    title: 'Web Development with Node and Express',
                    author: 'Ethan Brown',
                    isbn: '9781492053514',
                    category: 'Web Development',
                    publisher: "O'Reilly Media",
                    publication_year: 2019,
                    total_copies: 6,
                    available_copies: 6
                },
                {
                    title: 'Introduction to Algorithms',
                    author: 'Thomas H. Cormen',
                    isbn: '9780262033848',
                    category: 'Computer Science',
                    publisher: 'MIT Press',
                    publication_year: 2009,
                    total_copies: 4,
                    available_copies: 4
                }
            ];

            await Book.bulkCreate(sampleBooks);
            console.log(`${sampleBooks.length} sample books created`);
        } else {
            console.log(`Books already exist (${bookCount} books)`);
        }

        // Create sample members
        const memberCount = await Member.count();
        if (memberCount === 0) {
            const sampleMembers = [
                {
                    name: 'Budi Santoso',
                    email: 'budi@example.com',
                    phone: '081234567892',
                    address: 'Jl. Merdeka No. 123, Jakarta'
                },
                {
                    name: 'Siti Nurhaliza',
                    email: 'siti@example.com',
                    phone: '081234567893',
                    address: 'Jl. Sudirman No. 456, Bandung'
                },
                {
                    name: 'Ahmad Rizki',
                    email: 'ahmad@example.com',
                    phone: '081234567894',
                    address: 'Jl. Gatot Subroto No. 789, Surabaya'
                }
            ];

            await Member.bulkCreate(sampleMembers);
            console.log(`${sampleMembers.length} sample members created`);
        } else {
            console.log(`Members already exist (${memberCount} members)`);
        }

        console.log('\nDatabase seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
};

/**
 * Main setup function
 */
const setup = async () => {
    try {
        console.log('🚀 Starting database setup...\n');

        // Test connection
        console.log(' Testing database connection...');
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error(' Failed to connect to database. Please check:');
            console.error('   1. XAMPP MySQL is running');
            console.error('   2. Database "library_db" exists in phpMyAdmin');
            console.error('   3. .env file has correct credentials');
            process.exit(1);
        }

        
        console.log('\n📊 Creating database tables...');
        await syncDatabase(false); 

        // Seed data
        console.log('\n');
        await seedData();

        console.log('\nSetup completed successfully!');
        console.log('\nYou can now login with:');
        console.log('   Admin: admin@library.com / adminsuper123');
        console.log('   Librarian: librarian@library.com / librarian123');
        console.log('\nStart the server with: npm run dev');

        process.exit(0);
    } catch (error) {
        console.error('\n Setup failed:', error.message);
        process.exit(1);
    }
};


setup();