// js/stores.js - Page-Specific JavaScript for stores.html

// --- Global Functions to be called from HTML ---
// These are needed for the inline `onclick` attributes

function getDirections(address) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
}

function callStore(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}


class StoreLocatorManager {
    constructor() {
        this.app = window.app || {};
        console.log('🏬 Store Locator Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
    }

    cacheDOMElements() {
        this.elements = {
            searchInput: document.getElementById('store-search'),
            areaFilter: document.getElementById('area-filter'),
            servicesFilter: document.getElementById('services-filter'),
            storesGrid: document.getElementById('stores-grid'),
            storeCards: document.querySelectorAll('.store-card'),
        };
    }

    bindEvents() {
        if (!this.elements.storesGrid) return;

        // --- Filtering Events ---
        this.elements.searchInput.addEventListener('input', () => this.filterStores());
        this.elements.areaFilter.addEventListener('change', () => this.filterStores());
        this.elements.servicesFilter.addEventListener('change', () => this.filterStores());

        // --- Event Delegation for "View All Hours" ---
        this.elements.storesGrid.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('view-hours')) {
                this.toggleHours(target);
            }
        });
    }

    filterStores() {
        const searchTerm = this.elements.searchInput.value.toLowerCase();
        const area = this.elements.areaFilter.value;
        const service = this.elements.servicesFilter.value;

        this.elements.storeCards.forEach(card => {
            const cardName = card.querySelector('.store-name').textContent.toLowerCase();
            const cardAddress = card.querySelector('.store-address span').textContent.toLowerCase();
            const cardArea = card.dataset.area;
            const cardServices = card.dataset.services;

            const matchesSearch = cardName.includes(searchTerm) || cardAddress.includes(searchTerm);
            const matchesArea = area === "" || cardArea === area;
            const matchesService = service === "" || cardServices.includes(service);

            if (matchesSearch && matchesArea && matchesService) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    toggleHours(button) {
        const storeCard = button.closest('.store-card');
        const fullHours = storeCard.querySelector('.full-hours');
        
        if (fullHours.style.display === 'none' || fullHours.style.display === '') {
            fullHours.style.display = 'block';
            button.textContent = 'Hide Hours';
        } else {
            fullHours.style.display = 'none';
            button.textContent = 'View All Hours';
        }
    }
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the stores page
    if (document.querySelector('.stores-hero')) {
        new StoreLocatorManager().init();
    }
}); 