/**
 * Library Management System - Main Shared Logic
 */

class LibraryApp {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('token');
        this.currentUser = null;
        this.init();
    }

    init() {
        // Base initialization if needed
        this.setupCommonListeners();
    }

    setupCommonListeners() {
        // Modal close buttons
        document.querySelectorAll('.close-btn, .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.hideModal(modal.id);
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

        // Logout button if exists
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    /**
     * API Call Wrapper
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

        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, config);
            // Handle 401 Unauthorized
            if (response.status === 401) {
                this.handleUnauthorized();
                return { success: false, message: 'Unauthorized' };
            }
            return await response.json();
        } catch (error) {
            console.error('API Call Error:', error);
            return { success: false, message: 'Connection error' };
        }
    }

    handleUnauthorized() {
        // If we get a 401, clear token and redirect to login if not already there
        if (this.token) {
            localStorage.removeItem('token');
            this.token = null;
            if (!window.location.pathname.includes('login.html') &&
                !window.location.pathname.includes('index.html')) {
                window.location.href = 'login.html';
            }
        }
    }

    logout() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }

    /**
     * UI Utilities
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }

    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'flex';
    }

    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID');
    }

    getStatusText(status) {
        const statusMap = {
            'borrowed': 'Dipinjam',
            'returned': 'Dikembalikan',
            'overdue': 'Terlambat'
        };
        return statusMap[status] || status;
    }
}
