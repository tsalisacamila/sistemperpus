/**
 * Public Script for index.html
 * Handles public catalog browsing and login redirect
 */

class PublicLibrary {
    constructor() {
        this.apiBase = '/api';
        this.currentPage = 1;
        this.itemsPerPage = 10;

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.loadBooks();
        this.loadCategories();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Login button
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showModal('loginModal');
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Search books
        document.getElementById('searchBooksBtn').addEventListener('click', () => {
            this.searchBooks();
        });

        document.getElementById('searchBooks').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBooks();
            }
        });

        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.searchBooks();
        });

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
     * Login and redirect based on role
     */
    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            this.showLoading();
            const response = await this.apiCall('/auth/login', 'POST', {
                email,
                password
            });

            if (response.success) {
                // Store token
                localStorage.setItem('token', response.data.token);

                const userRole = response.data.staff.role;

                this.showToast('Login berhasil! Mengalihkan ke dashboard...', 'success');

                // Redirect based on role
                setTimeout(() => {
                    if (userRole === 'admin') {
                        window.location.href = 'admin/dashboard.html';
                    } else {
                        window.location.href = 'librarian/dashboard.html';
                    }
                }, 1500);

            } else {
                this.showToast(response.message || 'Login gagal', 'error');
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan saat login', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Load books (catalog)
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
                this.renderPagination(response.data.pagination);
            }
        } catch (error) {
            this.showToast('Gagal memuat katalog buku', 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Search books
     */
    searchBooks() {
        this.currentPage = 1;
        this.loadBooks(1);
    }

    /**
     * Load book categories
     */
    async loadCategories() {
        try {
            const response = await this.apiCall('/books/categories', 'GET');
            if (response.success) {
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

    /**
     * Render books grid
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
                    ${book.publisher ? `<div class="book-publisher">${book.publisher} (${book.publication_year})</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    /**
     * Render pagination
     */
    renderPagination(pagination) {
        const container = document.getElementById('booksPagination');
        if (!container) return;

        let html = '';

        // Previous button
        html += `<button ${!pagination.hasPrevPage ? 'disabled' : ''} 
                    onclick="publicApp.changePage(${pagination.currentPage - 1})">
                    &laquo; Sebelumnya
                 </button>`;

        // Page numbers (show max 5 pages)
        const startPage = Math.max(1, pagination.currentPage - 2);
        const endPage = Math.min(pagination.totalPages, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="${i === pagination.currentPage ? 'active' : ''}" 
                        onclick="publicApp.changePage(${i})">
                        ${i}
                     </button>`;
        }

        // Next button
        html += `<button ${!pagination.hasNextPage ? 'disabled' : ''} 
                    onclick="publicApp.changePage(${pagination.currentPage + 1})">
                    Selanjutnya &raquo;
                 </button>`;

        container.innerHTML = html;
    }

    /**
     * Change page
     */
    changePage(page) {
        this.currentPage = page;
        this.loadBooks(page);
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
}

// Initialize the public library app
const publicApp = new PublicLibrary();