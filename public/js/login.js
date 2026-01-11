/**
 * Login Page Logic
 */

class LoginApp extends LibraryApp {
    constructor() {
        super();
        this.setupLoginListener();

        // Redirect if already logged in
        if (this.token) {
            window.location.href = 'dashboard.html';
        }
    }

    setupLoginListener() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.querySelector('button[type="submit"]');

        try {
            btn.disabled = true;
            btn.textContent = 'Memproses...';

            const response = await this.apiCall('/auth/login', 'POST', {
                email,
                password
            });

            if (response.success) {
                localStorage.setItem('token', response.data.token);
                this.showToast('Login berhasil! Mengalihkan...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.showToast(response.message || 'Login gagal', 'error');
                btn.disabled = false;
                btn.textContent = 'Masuk';
            }
        } catch (error) {
            this.showToast('Terjadi kesalahan koneksi', 'error');
            btn.disabled = false;
            btn.textContent = 'Masuk';
        }
    }
}

// Init
const app = new LoginApp();
