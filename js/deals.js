// js/deals.js - Page-Specific JavaScript for deals.html

class DealsPageManager {
    constructor() {
        this.app = window.app || {}; // Access the global app instance
        console.log('💰 Deals Page Manager Initialized');
    }

    init() {
        this.startCountdown();
        this.bindEvents();
        this.loadDeals(); // Initial load
    }

    startCountdown() {
        const countdownTimer = document.getElementById('countdown-timer');
        if (!countdownTimer) return;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2); // Set target for 2 days from now

        setInterval(() => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                countdownTimer.innerHTML = '<div class="countdown-finished">Sale Ended</div>';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
            document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }

    bindEvents() {
        const dealsContainer = document.getElementById('deals-container');
        if (dealsContainer) {
            dealsContainer.addEventListener('click', (event) => {
                const target = event.target;
                if (target.closest('.btn-add-cart')) {
                    this.handleAddToCart(target.closest('.btn-add-cart'));
                }
                if (target.closest('.btn-wishlist')) {
                    this.handleWishlistToggle(target.closest('.btn-wishlist'));
                }
            });
        }
        
        // Filter functionality
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', () => this.applyFilters());
        });
    }
    
    applyFilters() {
        console.log("Applying filters...");
        // In a real app, you would filter your data source and re-render.
        // For now, we just simulate a reload.
        this.loadDeals();
    }

    loadDeals() {
        const dealsContainer = document.getElementById('deals-container');
        if (!dealsContainer) return;
        
        // This is a placeholder. In a real app, you'd fetch this data.
        const dealsHTML = `
            <div class="deal-card">
                <div class="deal-badge new">New</div>
                <div class="deal-image"><img src="images/deals/deal-1.jpg" alt="Deal"></div>
                <div class="deal-content">
                    <span class="deal-category">Fruits</span>
                    <h3 class="deal-title">Fresh Fruits Basket</h3>
                    <div class="deal-pricing">
                        <span class="deal-price">₦3,200</span>
                        <span class="deal-original-price">₦4,000</span>
                    </div>
                    <div class="deal-actions">
                        <button class="btn-add-cart" data-product-id="deal-001"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                        <button class="btn-wishlist"><i class="fas fa-heart"></i></button>
                    </div>
                </div>
            </div>
            <!-- Add more deal cards as needed -->
        `;
        dealsContainer.innerHTML = dealsHTML;
    }

    handleAddToCart(button) {
        const productId = button.dataset.productId;
        // Find the full product info from a data source if needed
        const mockProduct = { id: productId, name: "Special Deal Product", price: 3200 };
        
        if (this.app.cart) {
            this.app.cart.addItem(mockProduct, 1);
        }
        
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            button.disabled = false;
        }, 2000);
    }
    
    handleWishlistToggle(button) {
        button.classList.toggle('active');
        if (this.app.notifications) {
            const message = button.classList.contains('active') ? 'Added to wishlist!' : 'Removed from wishlist.';
            this.app.notifications.show(message, 'info');
        }
    }
}

// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the deals page
    if (document.querySelector('.deals-hero')) {
        new DealsPageManager().init();
    }
});