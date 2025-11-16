// js/tracking.js - Page-Specific JavaScript for tracking.html

class TrackingPageManager {
    constructor() {
        this.app = window.app || {};
        console.log('🚚 Tracking Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        // Check URL for an order ID to track automatically
        this.checkURLForOrder();
    }

    cacheDOMElements() {
        this.elements = {
            trackOrderBtn: document.getElementById('track-order'),
            orderSearchInput: document.getElementById('order-search'),
            activeOrdersSection: document.querySelector('.active-orders-section'),
            ratingModal: document.getElementById('rating-modal'),
            starRatingContainer: document.querySelector('.star-rating'),
        };
    }

    bindEvents() {
        if (!this.elements.trackOrderBtn) return;

        // --- Track Order Button ---
        this.elements.trackOrderBtn.addEventListener('click', () => {
            const orderId = this.elements.orderSearchInput.value;
            this.trackOrder(orderId);
        });

        // --- Star Rating in Modal ---
        if (this.elements.starRatingContainer) {
            this.elements.starRatingContainer.addEventListener('mouseover', (event) => {
                if (event.target.matches('.fa-star')) {
                    this.highlightStars(event.target.dataset.rating);
                }
            });
            this.elements.starRatingContainer.addEventListener('mouseout', () => {
                this.resetStars();
            });
            this.elements.starRatingContainer.addEventListener('click', (event) => {
                if (event.target.matches('.fa-star')) {
                    this.selectRating(event.target.dataset.rating);
                }
            });
        }
        
        // --- Modal Closing ---
        document.querySelectorAll('.modal-close, #cancel-rating').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
    }

    trackOrder(orderId) {
        if (!orderId) {
            alert('Please enter an order number.');
            return;
        }
        // In a real app, you would fetch order data from an API here.
        // For now, we'll just show the hardcoded tracking info.
        console.log(`Searching for order: ${orderId}`);
        this.elements.activeOrdersSection.style.display = 'block';
    }

    checkURLForOrder() {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('orderId');
        if (orderId) {
            this.elements.orderSearchInput.value = orderId;
            this.trackOrder(orderId);
        }
    }
    
    // --- Star Rating Logic ---
    highlightStars(rating) {
        const stars = this.elements.starRatingContainer.querySelectorAll('.fa-star');
        stars.forEach(star => {
            star.classList.toggle('hover', star.dataset.rating <= rating);
        });
    }
    
    resetStars() {
        this.elements.starRatingContainer.querySelectorAll('.fa-star').forEach(star => {
            star.classList.remove('hover');
        });
    }
    
    selectRating(rating) {
        const stars = this.elements.starRatingContainer.querySelectorAll('.fa-star');
        // Remove 'selected' from all, then add to the correct ones
        stars.forEach(star => {
            star.classList.toggle('selected', star.dataset.rating <= rating);
        });
        // Store the selected rating
        this.elements.starRatingContainer.dataset.selectedRating = rating;
        console.log(`Rating selected: ${rating}`);
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
    // Only run this script on the tracking page
    if (document.querySelector('.tracking-hero')) {
        new TrackingPageManager().init();
    }
});