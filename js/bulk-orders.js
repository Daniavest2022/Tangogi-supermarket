// js/bulk-orders.js - CORRECTED VERSION

// --- Global Functions to be called from HTML ---
// We define these ONLY if they haven't been defined before to avoid errors.

if (typeof openBulkOrderForm !== 'function') {
    window.openBulkOrderForm = function() {
        const modal = document.getElementById('bulk-order-modal');
        if (modal) modal.style.display = 'flex';
    }
}

if (typeof closeBulkOrderModal !== 'function') {
    window.closeBulkOrderModal = function() {
        const modal = document.getElementById('bulk-order-modal');
        if (modal) modal.style.display = 'none';
    }
}

if (typeof scrollToPricing !== 'function') {
    window.scrollToPricing = function() {
        document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    }
}

if (typeof contactSales !== 'function') {
    window.contactSales = function() {
        window.location.href = 'mailto:bulkorders@tangogi.com';
    }
}


class BulkOrderManager {
    constructor() {
        // ... (constructor can be empty for this page)
        console.log('📦 Bulk Order Page Manager Initialized');
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const form = document.getElementById('bulk-order-form');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    handleFormSubmit() {
        alert('Thank you for your request! Our sales team will be in touch within 24 hours.');
        closeBulkOrderModal(); // Use the global function to close the modal
    }
}

// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.bulk-orders-hero')) {
        new BulkOrderManager().init();
    }
});