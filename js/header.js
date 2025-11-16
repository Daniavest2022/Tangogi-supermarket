// js/header.js - FINAL FULLY-FEATURED VERSION

export class HeaderManager {
    constructor(app) {
        this.app = app;
        this.elements = {};
        console.log('🛒 HeaderManager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        console.log('HeaderManager: Enhanced initialization complete.');
    }

    cacheDOMElements() {
        // Dark Mode
        this.elements.darkModeToggle = document.getElementById('dark-mode-toggle');

        // Dropdown Buttons
        this.elements.locationBtn = document.getElementById('location-btn');
        this.elements.userBtn = document.getElementById('user-btn');
        
        // Dropdown Menus
        this.elements.locationDropdown = document.getElementById('location-dropdown');
        this.elements.userDropdown = document.getElementById('user-dropdown');

        // ** NEW: Mega Menu Elements **
        this.elements.megaMenuItems = document.querySelectorAll('.mega-menu');

        // ** NEW: Store Locator Button **
        this.elements.storeLocatorBtn = document.getElementById('store-locator-btn');
    }

    bindEvents() {
        // Dark Mode
        if (this.elements.darkModeToggle) {
            this.elements.darkModeToggle.addEventListener('click', () => this.handleThemeToggle());
        }

        // Dropdowns
        if (this.elements.locationBtn) {
            this.elements.locationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('location');
            });
        }
        if (this.elements.userBtn) {
            this.elements.userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('user');
            });
        }

        // ** NEW: Mega Menu Logic **
        this.elements.megaMenuItems.forEach(item => {
            // Show on hover (for desktop)
            item.addEventListener('mouseenter', () => this.toggleMegaMenu(item, true));
            // Hide when mouse leaves (for desktop)
            item.addEventListener('mouseleave', () => this.toggleMegaMenu(item, false));
        });

        // ** NEW: Store Locator Logic **
        if (this.elements.storeLocatorBtn) {
            this.elements.storeLocatorBtn.addEventListener('click', () => {
                // When clicked, go to the stores page
                window.location.href = 'stores.html'; // Make sure you have a stores.html file
            });
        }

        // Global click to close menus
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
            this.closeAllMegaMenus();
        });
    }

    handleThemeToggle() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const icon = this.elements.darkModeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleDropdown(type) {
        const btn = (type === 'location') ? this.elements.locationBtn : this.elements.userBtn;
        const dropdown = (type === 'location') ? this.elements.locationDropdown : this.elements.userDropdown;

        const isActive = dropdown.classList.contains('active');
        this.closeAllDropdowns();
        if (!isActive) {
            btn.classList.add('active');
            dropdown.classList.add('active');
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.location-btn.active, .user-btn.active').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.location-dropdown.active, .user-dropdown.active').forEach(dropdown => dropdown.classList.remove('active'));
    }

    // ** NEW: Mega Menu Functions **
    toggleMegaMenu(menuItem, show) {
        const content = menuItem.querySelector('.mega-menu-content');
        if (content) {
            if (show) {
                this.closeAllMegaMenus(); // Close others before opening a new one
                content.classList.add('active');
                menuItem.classList.add('active');
            } else {
                content.classList.remove('active');
                menuItem.classList.remove('active');
            }
        }
    }

    closeAllMegaMenus() {
        this.elements.megaMenuItems.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.mega-menu-content')?.classList.remove('active');
        });
    }
}