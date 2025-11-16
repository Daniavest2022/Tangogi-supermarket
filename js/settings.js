// js/settings.js - Page-Specific JavaScript for settings.html

class SettingsPageManager {
    constructor() {
        this.app = window.app || {};
        console.log('⚙️ Settings Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.loadUserData(); // Load initial data into the forms
    }

    cacheDOMElements() {
        this.elements = {
            navItems: document.querySelectorAll('.settings-nav .nav-item'),
            sections: document.querySelectorAll('.settings-section'),
            avatarUpload: document.getElementById('avatar-upload'),
            changeAvatarBtn: document.getElementById('change-avatar'),
            avatarPreview: document.getElementById('avatar-preview'),
            deleteAccountBtn: document.getElementById('delete-account'),
            deleteModal: document.getElementById('delete-account-modal'),
            cancelDeleteBtn: document.getElementById('cancel-delete'),
            passwordInput: document.getElementById('newPassword'),
            strengthFill: document.querySelector('.strength-fill'),
            strengthText: document.querySelector('.strength-text'),
            allForms: document.querySelectorAll('.settings-form'),
        };
    }

    bindEvents() {
        // --- Tab Navigation ---
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', () => this.handleNavClick(item));
        });

        // --- Avatar Upload ---
        if (this.elements.changeAvatarBtn) {
            this.elements.changeAvatarBtn.addEventListener('click', () => this.elements.avatarUpload.click());
        }
        if (this.elements.avatarUpload) {
            this.elements.avatarUpload.addEventListener('change', (event) => this.previewAvatar(event));
        }

        // --- Form Submissions ---
        this.elements.allForms.forEach(form => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleFormSave(form.id);
            });
        });
        
        // --- Password Strength ---
        if (this.elements.passwordInput) {
            this.elements.passwordInput.addEventListener('input', () => this.checkPasswordStrength());
        }

        // --- Delete Account Modal ---
        if (this.elements.deleteAccountBtn) {
            this.elements.deleteAccountBtn.addEventListener('click', () => this.openModal(this.elements.deleteModal));
        }
        if (this.elements.cancelDeleteBtn) {
            this.elements.cancelDeleteBtn.addEventListener('click', () => this.closeModal(this.elements.deleteModal));
        }
         document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
    }

    loadUserData() {
        // In a real app, you would fetch user data from an API.
        // For now, we'll use the placeholder values already in the HTML.
        console.log("User data loaded into forms.");
    }
    
    handleNavClick(clickedItem) {
        // Deactivate all
        this.elements.navItems.forEach(item => item.classList.remove('active'));
        this.elements.sections.forEach(section => section.classList.remove('active'));

        // Activate clicked item and corresponding section
        clickedItem.classList.add('active');
        const targetId = clickedItem.dataset.target + '-section';
        document.getElementById(targetId)?.classList.add('active');
    }

    previewAvatar(event) {
        const file = event.target.files[0];
        if (file && this.elements.avatarPreview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.elements.avatarPreview.src = e.target.result;
                this.elements.avatarPreview.style.display = 'block';
                document.querySelector('.avatar-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }

    checkPasswordStrength() {
        const password = this.elements.passwordInput.value;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const percentage = (strength / 4) * 100;
        this.elements.strengthFill.style.width = `${percentage}%`;
        
        const colors = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50'];
        this.elements.strengthFill.style.backgroundColor = colors[strength-1] || '#eee';
    }

    handleFormSave(formId) {
        // Simulate saving form data
        console.log(`Saving data for form: ${formId}`);
        if (this.app.notifications) {
            this.app.notifications.show('Settings saved successfully!', 'success');
        } else {
            alert('Settings saved successfully!');
        }
    }
    
    openModal(modal) {
        if (modal) modal.style.display = 'flex';
    }

    closeModal(modal) {
        if (modal) modal.style.display = 'none';
    }
}

// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the settings page
    if (document.querySelector('.settings-hero')) {
        new SettingsPageManager().init();
    }
});