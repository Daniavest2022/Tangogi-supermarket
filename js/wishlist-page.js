// js/wishlist.js - Page-Specific JavaScript for wishlist.html

class WishlistPageManager {
    constructor() {
        this.app = window.app || {};
        // Sample data - in a real app, this would be loaded from the user's account
        this.wishlistItems = [
            { id: 1, name: 'Fresh Organic Apples', price: 850, oldPrice: 1000, rating: 4.5, inStock: true, imageUrl: 'https://via.placeholder.com/300x200' },
            { id: 2, name: 'Premium Basmati Rice', price: 4500, oldPrice: 4500, rating: 4.0, inStock: true, imageUrl: 'https://via.placeholder.com/300x200' },
            { id: 3, name: 'Chicken Breast', price: 2200, oldPrice: 2800, rating: 4.8, inStock: false, imageUrl: 'https://via.placeholder.com/300x200' }
        ];

        console.log('❤️ Wishlist Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.renderWishlist();
    }

    cacheDOMElements() {
        this.elements = {
            wishlistGrid: document.getElementById('wishlist-items'),
            emptyState: document.getElementById('empty-wishlist'),
            shareBtn: document.getElementById('share-wishlist'),
            clearBtn: document.getElementById('clear-wishlist'),
            shareModal: document.getElementById('share-modal'),
            clearModal: document.getElementById('clear-confirm-modal'),
            modalCloseButtons: document.querySelectorAll('.modal-close'),
        };
    }

    bindEvents() {
        if (!this.elements.wishlistGrid) return;
        
        // --- Main Action Buttons ---
        this.elements.shareBtn.addEventListener('click', () => this.openModal(this.elements.shareModal));
        this.elements.clearBtn.addEventListener('click', () => this.openModal(this.elements.clearModal));
        
        // --- Modal Closing ---
        this.elements.modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(btn.closest('.modal')));
        });
        document.getElementById('cancel-clear')?.addEventListener('click', () => this.closeModal(this.elements.clearModal));

        // --- Wishlist Item Actions (using event delegation) ---
        this.elements.wishlistGrid.addEventListener('click', (event) => {
            const target = event.target;
            const itemElement = target.closest('.wishlist-item');
            if (!itemElement) return;
            
            const itemId = itemElement.dataset.itemId; // Assuming you add data-item-id to the element

            if (target.closest('.wishlist-remove')) {
                this.removeItem(itemId);
            }
            if (target.closest('.add-to-cart')) {
                // In a real app, find product by ID and pass to cart manager
                this.app.cart?.addItem({ id: itemId, name: "Wishlist Item" }, 1);
            }
        });
        
        // --- Clear All Confirmation ---
        document.getElementById('confirm-clear')?.addEventListener('click', () => this.clearWishlist());
    }
    
    renderWishlist() {
        if (this.wishlistItems.length === 0) {
            this.elements.wishlistGrid.style.display = 'none';
            this.elements.emptyState.style.display = 'block';
        } else {
            this.elements.wishlistGrid.style.display = 'grid';
            this.elements.emptyState.style.display = 'none';
            this.elements.wishlistGrid.innerHTML = this.wishlistItems.map(item => this.createItemHTML(item)).join('');
        }
        document.getElementById('wishlist-total').textContent = this.wishlistItems.length;
    }
    
    createItemHTML(item) {
        // This is a simplified version of your detailed card
        return `
            <div class="wishlist-item" data-item-id="${item.id}">
                <div class="item-image">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <button class="wishlist-remove" title="Remove"><i class="fas fa-times"></i></button>
                </div>
                <div class="item-info">
                    <h3 class="item-name">${item.name}</h3>
                    <div class="item-price">
                        <span class="current-price">₦${item.price.toLocaleString()}</span>
                        ${item.oldPrice > item.price ? `<span class="original-price">₦${item.oldPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="item-stock">
                        <span class="stock-status ${item.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-primary add-to-cart" ${!item.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    removeItem(itemId) {
        this.wishlistItems = this.wishlistItems.filter(item => item.id != itemId);
        this.renderWishlist();
        this.app.notifications?.show('Item removed from wishlist.', 'info');
    }
    
    clearWishlist() {
        this.wishlistItems = [];
        this.renderWishlist();
        this.closeModal(this.elements.clearModal);
        this.app.notifications?.show('Wishlist has been cleared.', 'success');
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
    // Only run this script on the wishlist page
    if (document.querySelector('.wishlist-hero')) {
        new WishlistPageManager().init();
    }
});