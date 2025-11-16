// js/main.js - Main Application Logic

// A simple notification handler
class NotificationManager {
    show(message, type = 'info') {
        console.log(`[Notification (${type})]: ${message}`);
        // In the future, you can create a popup element here.
    }
}

// A simple class to handle browser's localStorage
class StorageManager {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    }
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

// The main App class that holds everything together
class App {
    constructor() {
        console.log('🚀 Tangogi App Initializing...');
        this.notifications = new NotificationManager();
        this.storage = new StorageManager();
        // You can add other managers like WishlistManager here later
    }

    init() {
        this.initDarkMode();
        this.initHeaderUI();
        console.log('✅ Tangogi App Initialized Successfully');
    }

    // --- All the functionality for your header buttons ---
    initHeaderUI() {
        // Dropdown Toggle Logic
        const dropdownToggles = document.querySelectorAll('#user-btn, #location-btn');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdownId = toggle.id.replace('-btn', '-dropdown');
                const dropdown = document.getElementById(dropdownId);
                
                // Close other open dropdowns
                document.querySelectorAll('.user-dropdown.active, .location-dropdown.active').forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });

                dropdown.classList.toggle('active');
            });
        });

        // Close dropdowns if clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.user-dropdown.active, .location-dropdown.active').forEach(d => {
                d.classList.remove('active');
            });
        });

        // Prevent dropdowns from closing when clicking inside them
        document.querySelectorAll('.user-dropdown, .location-dropdown').forEach(d => {
            d.addEventListener('click', e => e.stopPropagation());
        });

        // Mobile Menu Toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        // NOTE: Your HTML doesn't have a mobile navigation element yet.
        // When you create one (e.g., <div id="mobile-navigation">...</div>), this will work.
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
                mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
                // document.getElementById('mobile-navigation').classList.toggle('active');
            });
            
    }

    // --- Add this code for the Stores button ---
    const storeLocatorBtn = document.getElementById('store-locator-btn');
    if (storeLocatorBtn) {
        storeLocatorBtn.addEventListener('click', () => {
            window.location.href = 'stores.html'; // Navigate to stores page
        });
    }
}

// --- Dark Mode Functionality ---
    initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const themeIcon = darkModeToggle.querySelector('i');
        const themeText = darkModeToggle.querySelector('.theme-text');

        // Check for saved theme in storage
        if (this.storage.get('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light';
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                this.storage.set('theme', 'dark');
                themeIcon.className = 'fas fa-sun';
                themeText.textContent = 'Light';
            } else {
                this.storage.set('theme', 'light');
                themeIcon.className = 'fas fa-moon';
                themeText.textContent = 'Dark';
            }
        });
    }
}

// --- Initialize the App ---
document.addEventListener('DOMContentLoaded', () => {
    // Create the global app object that other scripts can use
    window.app = new App();
    window.app.init();
});