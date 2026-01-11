/**
 * Admin Dashboard JavaScript
 * Handles admin functionality including staff management and full CRUD
 */

class AdminDashboard {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('token');
        this.currentUser = null;
        this.currentPage = 1;
        this.itemsPerPage = 10;

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        // Load default section (catalog/books)
        this.loadBooks();
        this.loadCategories();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.nav-btn'); // Handle icon clicks
                if (target) {
                    this.switchSection(target.dataset.section);
                }
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });



        // Book Management
        const newBookBtn = document.getElementById('newBookBtn');
        if (newBookBtn) {
            newBookBtn.addEventListener('click', () => {
                this.showModal('newBookModal');
            });
        }

        document.getElementById('newBookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createBook();
        });

        document.getElementById('editBookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBook();
        });

        document.getElementById('searchBooksBtn').addEventListener('click', () => {
            this.searchBooks();
        });

        document.getElementById('searchBooks').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBooks();
            }
        });

        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.searchBooks();
        });

        // Event delegation for book buttons
        const booksGrid = document.getElementById('booksGrid');
        if (booksGrid) {
            booksGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-edit-book')) {
                    const bookId = e.target.dataset.bookId;
                    this.editBook(parseInt(bookId));
                }
                if (e.target.classList.contains('btn-delete-book')) {
                    const bookId = e.target.dataset.bookId;
                    const bookTitle = e.target.dataset.bookTitle;
                    this.deleteBook(parseInt(bookId), bookTitle);
                }
            });
        }

        // Loan Management  
        const newLoanBtn = document.getElementById('newLoanBtn');
        if (newLoanBtn) {
            newLoanBtn.addEventListener('click', () => {
                this.showNewLoanModal();
            });
        }

        const newLoanForm = document.getElementById('newLoanForm');
        if (newLoanForm) {
            newLoanForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createLoan();
            });
        }

        // Member Management
        const newMemberBtn = document.getElementById('newMemberBtn');
        if (newMemberBtn) {
            newMemberBtn.addEventListener('click', () => {
                this.showModal('newMemberModal');
            });
        }

        const newMemberForm = document.getElementById('newMemberForm');
        if (newMemberForm) {
            newMemberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createMember();
            });
        }

        const editMemberForm = document.getElementById('editMemberForm');
        if (editMemberForm) {
            editMemberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateMember();
            });
        }

        // Event delegation for member and loan buttons
        const membersTable = document.getElementById('membersTable');
        if (membersTable) {
            membersTable.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-edit-member')) {
                    const memberId = e.target.dataset.memberId;
                    this.editMember(parseInt(memberId));
                }
                if (e.target.classList.contains('btn-delete-member')) {
                    const memberId = e.target.dataset.memberId;
                    const memberName = e.target.dataset.memberName;
                    this.deleteMember(parseInt(memberId), memberName);
                }
            });
        }

        const loansTable = document.getElementById('loansTable');
        if (loansTable) {
            loansTable.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-return-book')) {
                    const loanId = e.target.dataset.loanId;
                    this.returnBook(parseInt(loanId));
                }
            });
        }


        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    /**
     * Check authentication status
     */
    async checkAuthStatus() {
        if (!this.token) {
            window.location.href = '../index.html';
            return;
        }

        try {
            const response = await this.apiCall('/auth/profile', 'GET');
            if (response.success) {
                this.currentUser = response.data;
                if (this.currentUser.role !== 'admin') {
                    alert('Akses ditolak. Halaman ini hanya untuk Admin.');
                    window.location.href = '../index.html';
                    return;
                }
                document.getElementById('userName').textContent = this.currentUser.name;
            } else {
                this.logout();
            }
        } catch (error) {
            this.logout();
        }
    }

    /**
     * Logout function
     */
    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    }

    /**
     * Switch between sections
     */
    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Load section data
        switch (sectionName) {
            case 'loans':
                this.loadLoans();
                this.loadLoanStatistics();
                break;
            case 'members':
                this.loadMembers();
                break;
            case 'staff':
                this.loadStaff();
                this.loadStaffStatistics();
                break;
        }
    }

    /**
     * Load staff data
     */
    async loadStaff() {
        try {
            this.showLoading();
            const response = await this.apiCall('/staff', 'GET');

            if (response.success) {
                this.renderStaff(response.data.staff);
            }
        } catch (error) {
            this.showToast('Gagal memuat data staff', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Load staff statistics
     */
    async loadStaffStatistics() {
        try {
            const response = await this.apiCall('/staff/statistics', 'GET');

            if (response.success) {
                this.renderStaffStatistics(response.data);
            }
        } catch (error) {
            console.error('Failed to load staff statistics:', error);
        }
    }

    /**
     * Render staff statistics
     */
    renderStaffStatistics(stats) {
        const statsGrid = document.getElementById('staffStats');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Staff</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.admins}</div>
                <div class="stat-label">Admin</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.librarians}</div>
                <div class="stat-label">Librarian</div>
            </div>
        `;
    }

    /**
     * Render staff table
     */
    renderStaff(staff) {
        const tbody = document.querySelector('#staffTable tbody');

        if (staff.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Tidak ada data staff.</td></tr>';
            return;
        }

        tbody.innerHTML = staff.map(s => `
            <tr>
                <td>${s.staff_code}</td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td><span class="role-badge role-${s.role}">${s.role === 'admin' ? 'Admin' : 'Librarian'}</span></td>
                <td><span class="status-badge status-${s.status}">${s.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</span></td>
                <td>${this.formatDate(s.created_at)}</td>
                <td>
                    ${s.id !== this.currentUser.id ?
                `<button class="btn btn-sm btn-primary btn-edit-staff" data-staff-id="${s.id}">Edit</button>
                    <button class="btn btn-sm btn-danger btn-delete-staff" data-staff-id="${s.id}" data-staff-name="${s.name}">Hapus</button>` :
                '<span class="text-muted">Akun Sendiri</span>'
            }
                </td>
            </tr>
        `).join('');
    }

    /**
     * Create new staff
     */
    async createStaff() {
        try {
            const formData = new FormData(document.getElementById('newStaffForm'));
            const staffData = Object.fromEntries(formData);

            this.showLoading();
            const response = await this.apiCall('/staff', 'POST', staffData);

            if (response.success) {
                this.showToast('Staff berhasil ditambahkan', 'success');
                this.hideModal('newStaffModal');
                document.getElementById('newStaffForm').reset();
                this.loadStaff();
                this.loadStaffStatistics();
            } else {
                this.showToast(response.message || 'Gagal menambahkan staff', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat menambahkan staff', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Edit staff
     */
    async editStaff(staffId) {
        try {
            const response = await this.apiCall(`/staff/${staffId}`, 'GET');

            if (response.success) {
                const staff = response.data;
                document.getElementById('editStaffId').value = staff.id;
                document.getElementById('editStaffName').value = staff.name;
                document.getElementById('editStaffEmail').value = staff.email;
                document.getElementById('editStaffRole').value = staff.role;
                document.getElementById('editStaffStatus').value = staff.status;

                this.showModal('editStaffModal');
            }
        } catch (error) {
            this.showToast('Gagal memuat data staff', 'error');
        }
    }

    /**
     * Update staff
     */
    async updateStaff() {
        try {
            const staffId = document.getElementById('editStaffId').value;
            const formData = new FormData(document.getElementById('editStaffForm'));
            const staffData = Object.fromEntries(formData);

            this.showLoading();
            const response = await this.apiCall(`/staff/${staffId}`, 'PUT', staffData);

            if (response.success) {
                this.showToast('Staff berhasil diperbarui', 'success');
                this.hideModal('editStaffModal');
                this.loadStaff();
                this.loadStaffStatistics();
            } else {
                this.showToast(response.message || 'Gagal memperbarui staff', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat memperbarui staff', 'error');
        } finally {
            this.hideLoading();
        }
    }



    /**
     * Delete staff
     */
    async deleteStaff(staffId, staffName) {
        if (!confirm(`Apakah Anda yakin ingin menghapus staff "${staffName}"?`)) {
            return;
        }

        try {
            this.showLoading();
            const response = await this.apiCall(`/staff/${staffId}`, 'DELETE');

            if (response.success) {
                this.showToast('Staff berhasil dihapus', 'success');
                this.loadStaff();
                this.loadStaffStatistics();
            } else {
                this.showToast(response.message || 'Gagal menghapus staff', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat menghapus staff', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Load books with full CRUD including delete
     */
    async loadBooks() {
        try {
            this.showLoading();
            const response = await this.apiCall('/books', 'GET');

            if (response.success) {
                this.renderBooks(response.data.books);
            }
        } catch (error) {
            this.showToast('Gagal memuat katalog buku', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Render books with full admin privileges (including delete)
     */
    renderBooks(books) {
        const grid = document.getElementById('booksGrid');

        if (books.length === 0) {
            grid.innerHTML = '<div class="no-books">Tidak ada buku ditemukan.</div>';
            return;
        }

        grid.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-meta">
                        <span class="book-author">oleh ${book.author}</span>
                        ${book.category ? `<span class="book-category">${book.category}</span>` : ''}
                    </div>
                    ${book.description ? `<div class="book-description">${book.description}</div>` : ''}
                </div>
                <div class="book-footer">
                    <div class="book-availability ${book.available_copies > 0 ? 'available' : 'unavailable'}">
                        ${book.available_copies > 0 ?
                `✅ Tersedia: ${book.available_copies} dari ${book.total_copies}` :
                '❌ Tidak tersedia'
            }
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-sm btn-primary" onclick="adminApp.editBook(${book.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="adminApp.deleteBook(${book.id}, '${book.title}')">Hapus</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Delete book (admin only)
     */
    async deleteBook(bookId, bookTitle) {
        if (!confirm(`Apakah Anda yakin ingin menghapus buku "${bookTitle}"?`)) {
            return;
        }

        try {
            this.showLoading();
            const response = await this.apiCall(`/books/${bookId}`, 'DELETE');

            if (response.success) {
                this.showToast('Buku berhasil dihapus', 'success');
                this.loadBooks();
            } else {
                this.showToast(response.message || 'Gagal menghapus buku', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat menghapus buku', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Load categories
     */
    async loadCategories() {
        try {
            const response = await this.apiCall('/books/categories', 'GET');
            if (response.success) {
                const select = document.getElementById('categoryFilter');
                if (select) {
                    select.innerHTML = '<option value="">Semua Kategori</option>';

                    response.data.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category;
                        option.textContent = category;
                        select.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    /**
     * Placeholder functions for other sections
     */
    /**
     * Load loans
     */
    async loadLoans() {
        try {
            this.showLoading();
            const response = await this.apiCall('/loans', 'GET');
            if (response.success) {
                this.renderLoans(response.data.loans);
            }
        } catch (error) {
            this.showToast('Gagal memuat data peminjaman', 'error');
            console.error(error);
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Render loans table
     */
    renderLoans(loans) {
        const tbody = document.querySelector('#loansTable tbody');
        if (!tbody) return;

        if (loans.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Tidak ada data peminjaman.</td></tr>';
            return;
        }

        tbody.innerHTML = loans.map(loan => `
            <tr>
                <td>${loan.loan_code || loan.id}</td>
                <td>${loan.Member?.name || 'N/A'}</td>
                <td>${loan.Book?.title || 'N/A'}</td>
                <td>${this.formatDate(loan.loan_date)}</td>
                <td>${this.formatDate(loan.due_date)}</td>
                <td><span class="status-badge status-${loan.status}">${loan.status}</span></td>
                <td>
                    ${loan.status === 'borrowed' ?
                `<button class="btn btn-sm btn-success btn-return-book" data-loan-id="${loan.id}">Kembalikan</button>` :
                '-'}
                </td>
            </tr>
        `).join('');
    }

    /**
     * Load loan statistics
     */
    async loadLoanStatistics() {
        try {
            const response = await this.apiCall('/loans/statistics', 'GET');
            if (response.success) {
                this.renderLoanStats(response.data);
            }
        } catch (error) {
            console.error('Failed to load loan stats', error);
        }
    }

    renderLoanStats(stats) {
        const container = document.getElementById('loanStats');
        if (!container) return;

        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.active || 0}</div>
                <div class="stat-label">Sedang Dipinjam</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.total || 0}</div>
                <div class="stat-label">Total Peminjaman</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.overdue || 0}</div>
                <div class="stat-label">Terlambat</div>
            </div>
        `;
    }

    /**
     * Load members
     */
    async loadMembers() {
        try {
            this.showLoading();
            const response = await this.apiCall('/members', 'GET');
            if (response.success) {
                this.renderMembers(response.data.members);
            }
        } catch (error) {
            this.showToast('Gagal memuat data anggota', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderMembers(members) {
        const tbody = document.querySelector('#membersTable tbody');
        if (!tbody) return;

        if (members.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Tidak ada data anggota.</td></tr>';
            return;
        }

        tbody.innerHTML = members.map(member => `
            <tr>
                <td>${member.member_code}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone || '-'}</td>
                <td><span class="status-badge status-${member.status}">${member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary btn-edit-member" data-member-id="${member.id}">Edit</button>
                    <button class="btn btn-sm btn-danger btn-delete-member" data-member-id="${member.id}" data-member-name="${member.name}">Hapus</button>
                </td>
            </tr>
        `).join('');
    }

    // Actions for new features
    async returnBook(loanId) {
        if (!confirm('Konfirmasi pengembalian buku?')) return;

        try {
            this.showLoading();
            const response = await this.apiCall(`/loans/${loanId}/return`, 'PUT');
            if (response.success) {
                this.showToast('Buku berhasil dikembalikan', 'success');
                this.loadLoans();
                this.loadLoanStatistics();
            } else {
                this.showToast(response.message, 'error');
            }
        } catch (e) {
            this.showToast('Gagal memproses pengembalian', 'error');
        } finally {
            this.hideLoading();
        }
    }


    /**
     * Utility functions
     */
    async apiCall(endpoint, method = 'GET', data = null) {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.apiBase}${endpoint}`, config);
        return await response.json();
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID');
    }

    /**
     * BOOK MANAGEMENT FUNCTIONS
     */
    async loadBooks(page = 1) {
        try {
            this.showLoading();
            const query = document.getElementById('searchBooks').value;
            const category = document.getElementById('categoryFilter').value;

            const params = new URLSearchParams({
                page,
                limit: this.itemsPerPage
            });

            if (query) params.append('q', query);
            if (category) params.append('category', category);

            const response = await this.apiCall(`/books?${params}`, 'GET');

            if (response.success) {
                this.renderBooks(response.data.books);
                this.renderPagination(response.data.pagination, 'books');
            }
        } catch (error) {
            this.showToast('Gagal memuat katalog buku', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async loadCategories() {
        try {
            const response = await this.apiCall('/books/categories', 'GET');
            if (response.success && response.data) {
                const select = document.getElementById('categoryFilter');
                select.innerHTML = '<option value="">Semua Kategori</option>';
                response.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    searchBooks() {
        this.currentPage = 1;
        this.loadBooks(1);
    }

    renderBooks(books) {
        const grid = document.getElementById('booksGrid');

        if (books.length === 0) {
            grid.innerHTML = '<div class="no-books">Tidak ada buku ditemukan.</div>';
            return;
        }

        grid.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-meta">
                        <span class="book-author">oleh ${book.author}</span>
                        ${book.category ? `<span class="book-category">${book.category}</span>` : ''}
                    </div>
                    ${book.description ? `<div class="book-description">${book.description}</div>` : ''}
                </div>
                <div class="book-footer">
                    <div class="book-availability ${book.available_copies > 0 ? 'available' : 'unavailable'}">
                        ${book.available_copies > 0 ?
                `✅ Tersedia: ${book.available_copies} dari ${book.total_copies}` :
                '❌ Tidak tersedia'
            }
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-sm btn-primary btn-edit-book" data-book-id="${book.id}">Edit</button>
                        <button class="btn btn-sm btn-danger btn-delete-book" data-book-id="${book.id}" data-book-title="${book.title}">Hapus</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async createBook() {
        try {
            const formData = new FormData(document.getElementById('newBookForm'));
            const bookData = Object.fromEntries(formData);

            this.showLoading();
            const response = await this.apiCall('/books', 'POST', bookData);

            if (response.success) {
                this.showToast('Buku berhasil ditambahkan', 'success');
                this.hideModal('newBookModal');
                document.getElementById('newBookForm').reset();
                this.loadBooks();
            } else {
                this.showToast(response.message || 'Gagal menambahkan buku', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat menambahkan buku', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async editBook(bookId) {
        try {
            this.showLoading();
            const response = await this.apiCall(`/books/${bookId}`, 'GET');

            if (response.success) {
                const book = response.data;
                document.getElementById('editBookId').value = book.id;
                document.getElementById('editBookTitle').value = book.title;
                document.getElementById('editBookAuthor').value = book.author;
                document.getElementById('editBookISBN').value = book.isbn || '';
                document.getElementById('editBookCategory').value = book.category || '';
                document.getElementById('editBookPublisher').value = book.publisher || '';
                document.getElementById('editBookYear').value = book.publication_year || '';
                document.getElementById('editBookCopies').value = book.total_copies;
                document.getElementById('editBookDescription').value = book.description || '';

                this.showModal('editBookModal');
            } else {
                this.showToast('Gagal memuat data buku', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat memuat data buku', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async updateBook() {
        try {
            const bookId = document.getElementById('editBookId').value;
            const formData = new FormData(document.getElementById('editBookForm'));
            const bookData = Object.fromEntries(formData);

            this.showLoading();
            const response = await this.apiCall(`/books/${bookId}`, 'PUT', bookData);

            if (response.success) {
                this.showToast('Buku berhasil diperbarui', 'success');
                this.hideModal('editBookModal');
                this.loadBooks();
            } else {
                this.showToast(response.message || 'Gagal memperbarui buku', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat memperbarui buku', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async deleteBook(bookId, bookTitle) {
        if (!confirm(`Apakah Anda yakin ingin menghapus buku "${bookTitle}"?`)) {
            return;
        }

        try {
            this.showLoading();
            const response = await this.apiCall(`/books/${bookId}`, 'DELETE');

            if (response.success) {
                this.showToast('Buku berhasil dihapus', 'success');
                this.loadBooks();
            } else {
                this.showToast(response.message || 'Gagal menghapus buku', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat menghapus buku', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * LOAN MANAGEMENT FUNCTIONS
     */
    async showNewLoanModal() {
        console.log('Opening loan modal...'); // DEBUG

        await this.loadMembersForSelect();
        await this.loadBooksForSelect();

        // Set loan date to today
        const today = new Date();
        document.getElementById('loanDate').value = today.toISOString().split('T')[0];

        // Set default due date (7 days from today)
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + 7);
        document.getElementById('loanDueDate').value = dueDate.toISOString().split('T')[0];

        // Add event listener to auto-update due date when loan date changes
        const loanDateInput = document.getElementById('loanDate');
        loanDateInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            const newDueDate = new Date(selectedDate);
            newDueDate.setDate(newDueDate.getDate() + 7);
            document.getElementById('loanDueDate').value = newDueDate.toISOString().split('T')[0];
        });

        this.showModal('newLoanModal');
    }

    async loadMembersForSelect() {
        console.log('Loading members...'); // DEBUG
        try {
            const response = await this.apiCall('/members?limit=100', 'GET');
            console.log('Members response:', response); // DEBUG

            if (response.success) {
                const select = document.getElementById('loanMember');
                select.innerHTML = '<option value="">Pilih Anggota...</option>';

                response.data.members.forEach(member => {
                    if (member.status === 'active') {
                        const option = document.createElement('option');
                        option.value = member.id;
                        option.textContent = `${member.member_code} - ${member.name}`;
                        select.appendChild(option);
                    }
                });

                console.log('Loaded', response.data.members.length, 'members'); // DEBUG
            } else {
                console.error('Failed to load members:', response.message);
                this.showToast('Gagal memuat daftar anggota: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Failed to load members:', error);
            this.showToast('Gagal memuat daftar anggota', 'error');
        }
    }

    async loadBooksForSelect() {
        console.log('Loading books...'); // DEBUG
        try {
            const response = await this.apiCall('/books?limit=100', 'GET');
            console.log('Books response:', response); // DEBUG

            if (response.success) {
                const select = document.getElementById('loanBook');
                select.innerHTML = '<option value="">Pilih Buku...</option>';

                response.data.books.forEach(book => {
                    if (book.available_copies > 0) {
                        const option = document.createElement('option');
                        option.value = book.id;
                        option.textContent = `${book.title} (Tersedia: ${book.available_copies})`;
                        select.appendChild(option);
                    }
                });

                console.log('Loaded', response.data.books.length, 'books'); // DEBUG
            } else {
                console.error('Failed to load books:', response.message);
                this.showToast('Gagal memuat daftar buku: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Failed to load books:', error);
            this.showToast('Gagal memuat daftar buku', 'error');
        }
    }

    async createLoan() {
        try {
            const formData = new FormData(document.getElementById('newLoanForm'));
            const loanData = Object.fromEntries(formData);

            // Convert string IDs to integers
            loanData.member_id = parseInt(loanData.member_id);
            loanData.book_id = parseInt(loanData.book_id);

            // Remove due_date - backend will calculate it automatically from loan_date
            delete loanData.due_date;

            console.log('Creating loan with data:', loanData); // DEBUG

            this.showLoading();
            const response = await this.apiCall('/loans', 'POST', loanData);

            console.log('Create loan response:', response); // DEBUG

            if (response.success) {
                this.showToast('Peminjaman berhasil ditambahkan', 'success');
                this.hideModal('newLoanModal');
                document.getElementById('newLoanForm').reset();
                this.loadLoans();
                this.loadLoanStatistics();
            } else {
                console.error('Failed to create loan:', response); // DEBUG
                console.error('Validation errors:', JSON.stringify(response.errors, null, 2)); // DETAILED
                this.showToast(response.message || 'Gagal menambahkan peminjaman', 'error');
            }
        } catch (error) {
            console.error('Create loan error:', error); // DEBUG
            this.showToast('Terjadi kesalahan saat menambahkan peminjaman', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * MEMBER MANAGEMENT FUNCTIONS
     */
    async createMember() {
        try {
            const formData = new FormData(document.getElementById('newMemberForm'));
            const memberData = Object.fromEntries(formData);

            console.log('Creating member with data:', memberData); // DEBUG

            this.showLoading();
            const response = await this.apiCall('/members', 'POST', memberData);

            console.log('Create member response:', response); // DEBUG

            if (response.success) {
                this.showToast('Anggota berhasil ditambahkan', 'success');
                this.hideModal('newMemberModal');
                document.getElementById('newMemberForm').reset();
                this.loadMembers();
            } else {
                console.error('Failed to create member:', response); // DEBUG
                console.error('Validation errors:', JSON.stringify(response.errors, null, 2)); // DETAILED
                this.showToast(response.message || 'Gagal menambahkan anggota', 'error');
            }
        } catch (error) {
            console.error('Create member error:', error); // DEBUG
            this.showToast('Terjadi kesalahan saat menambahkan anggota', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async editMember(memberId) {
        try {
            this.showLoading();
            const response = await this.apiCall(`/members/${memberId}`, 'GET');

            if (response.success) {
                const member = response.data;
                document.getElementById('editMemberId').value = member.id;
                document.getElementById('editMemberName').value = member.name;
                document.getElementById('editMemberEmail').value = member.email;
                document.getElementById('editMemberPhone').value = member.phone || '';
                document.getElementById('editMemberAddress').value = member.address || '';
                document.getElementById('editMemberStatus').value = member.status;

                this.showModal('editMemberModal');
            } else {
                this.showToast('Gagal memuat data anggota', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat memuat data anggota', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async updateMember() {
        try {
            const memberId = document.getElementById('editMemberId').value;
            const formData = new FormData(document.getElementById('editMemberForm'));
            const memberData = Object.fromEntries(formData);

            this.showLoading();
            const response = await this.apiCall(`/members/${memberId}`, 'PUT', memberData);

            if (response.success) {
                this.showToast('Anggota berhasil diperbarui', 'success');
                this.hideModal('editMemberModal');
                this.loadMembers();
            } else {
                this.showToast(response.message || 'Gagal memperbarui anggota', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat memperbarui anggota', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async deleteMember(memberId, memberName) {
        if (!confirm(`Apakah Anda yakin ingin menghapus anggota "${memberName}"?`)) {
            return;
        }

        try {
            this.showLoading();
            const response = await this.apiCall(`/members/${memberId}`, 'DELETE');

            if (response.success) {
                this.showToast('Anggota berhasil dihapus', 'success');
                this.loadMembers();
            } else {
                this.showToast(response.message || 'Gagal menghapus anggota', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat menghapus anggota', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderPagination(pagination, type) {
        const container = document.getElementById(`${type}Pagination`);
        if (!container) return;

        let html = '';

        html += `<button ${!pagination.hasPrevPage ? 'disabled' : ''} 
                    onclick="adminApp.changePage(${pagination.currentPage - 1}, '${type}')">
                    « Sebelumnya
                 </button>`;

        for (let i = 1; i <= pagination.totalPages; i++) {
            html += `<button class="${i === pagination.currentPage ? 'active' : ''}" 
                        onclick="adminApp.changePage(${i}, '${type}')">
                        ${i}
                     </button>`;
        }

        html += `<button ${!pagination.hasNextPage ? 'disabled' : ''} 
                    onclick="adminApp.changePage(${pagination.currentPage + 1}, '${type}')">
                    Selanjutnya »
                 </button>`;

        container.innerHTML = html;
    }

    changePage(page, type) {
        this.currentPage = page;
        if (type === 'books') {
            this.loadBooks(page);
        }
    }
}

// Initialize the admin dashboard
const adminApp = new AdminDashboard();