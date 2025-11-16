// js/login.js - Page-Specific JavaScript for login.html

class LoginPageManager {
    constructor() {
        this.app = window.app || {}; // Access the global app instance
        console.log('🔑 Login Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
    }

    cacheDOMElements() {
        this.elements = {
            loginForm: document.getElementById('login-form'),
            passwordInput: document.getElementById('login-password'),
            passwordToggle: document.querySelector('.password-toggle'),
            errorContainer: document.getElementById('login-errors'),
            errorMessage: document.getElementById('error-message'),
        };
    }

    bindEvents() {
        if (!this.elements.loginForm) return;

        // --- Password Visibility Toggle ---
        if (this.elements.passwordToggle) {
            this.elements.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // --- Form Submission ---
        this.elements.loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleLogin();
        });
    }

    togglePasswordVisibility() {
        const input = this.elements.passwordInput;
        const icon = this.elements.passwordToggle.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    handleLogin() {
        console.log('Attempting login...');
        
        // In a real application, you would send this to a server for validation.
        // For now, we will simulate it.

        const identifier = document.getElementById('login-identifier').value;
        const password = this.elements.passwordInput.value;

        // Simple validation simulation
        if (identifier === 'user@tangogi.com' && password === 'password123') {
            // Successful login
            this.showError(null); // Clear any previous errors
            
            // Call the login method from our main AuthManager
            if (this.app.auth) {
                this.app.auth.login(identifier, password);
            }
            
            alert('Login successful! Redirecting to your account...');
            // Redirect to the user's account page
            window.location.href = 'account.html'; // Or index.html
            
        } else {
            // Failed login
            this.showError('Invalid email/phone or password. Please try again.');
        }
    }

    showError(message) {
        if (message) {
            this.elements.errorMessage.textContent = message;
            this.elements.errorContainer.style.display = 'block';
        } else {
            this.elements.errorContainer.style.display = 'none';
        }
    }
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the login page
    if (document.getElementById('login-form')) {
        new LoginPageManager().init();
    }
});