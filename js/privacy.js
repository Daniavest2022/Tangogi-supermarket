// js/privacy.js - Page-Specific JavaScript for privacy.html

class PrivacyPageManager {
    constructor() {
        console.log('🔒 Privacy Page Manager Initialized');
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // --- Tab Navigation ---
        const navItems = document.querySelectorAll('.privacy-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => this.handleNavClick(item));
        });

        // --- Modal Triggers ---
        const viewChangesBtn = document.getElementById('view-changes');
        if (viewChangesBtn) {
            viewChangesBtn.addEventListener('click', () => this.openModal('policy-changes-modal'));
        }

        const rightsButtons = document.querySelectorAll('[data-right]');
        rightsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const rightType = button.dataset.right;
                this.openRightsRequestModal(rightType);
            });
        });

        // --- Modal Closing ---
        const modalCloseButtons = document.querySelectorAll('.modal .modal-close');
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // --- Cookie Toggles ---
        const saveCookieBtn = document.getElementById('save-cookie-preferences');
        if (saveCookieBtn) {
            saveCookieBtn.addEventListener('click', () => this.saveCookiePreferences());
        }
    }

    handleNavClick(clickedItem) {
        // 1. Remove 'active' from all nav items and sections
        document.querySelectorAll('.privacy-nav .nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.privacy-section').forEach(section => section.classList.remove('active'));

        // 2. Add 'active' to the clicked item
        clickedItem.classList.add('active');

        // 3. Find and show the corresponding content section
        const targetId = clickedItem.dataset.target + '-section';
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Scroll to the section smoothly
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex'; // Use flex to center it
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    openRightsRequestModal(rightType) {
        const modal = document.getElementById('rights-request-modal');
        const title = document.getElementById('rights-modal-title');
        const requestTypeInput = document.getElementById('request-type');

        if (modal && title && requestTypeInput) {
            // Capitalize the first letter for the title
            const formattedRight = rightType.charAt(0).toUpperCase() + rightType.slice(1);
            title.textContent = `Request to ${formattedRight} Data`;
            requestTypeInput.value = rightType;
            this.openModal('rights-request-modal');
        }
    }

    saveCookiePreferences() {
        const analyticsAllowed = document.getElementById('analytics-cookies').checked;
        const marketingAllowed = document.getElementById('marketing-cookies').checked;

        console.log('Saving cookie preferences:', { analyticsAllowed, marketingAllowed });
        // Here you would save these preferences to localStorage or a cookie
        alert('Your cookie preferences have been saved!');
    }
}

// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // We only want this script to run on the privacy page, so we check for a unique element
    if (document.querySelector('.privacy-hero')) {
        new PrivacyPageManager().init();
    }
});