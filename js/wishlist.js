// js/wishlist.js - The GLOBAL Wishlist Manager

export class WishlistManager {
    constructor(app) {
        this.app = app;
        this.items = [];
        console.log('❤️ Global Wishlist Manager Initialized');
    }

    init() {
        this.loadWishlist();
    }

    loadWishlist() {
        // Load items from browser storage
        this.items = this.app.storage.get('wishlist_items') || [];
        this.updateWishlistCount();
    }

    saveWishlist() {
        this.app.storage.set('wishlist_items', this.items);
    }

    // This function will be called from other pages (like products.js)
    toggleItem(product) {
        const existingIndex = this.items.findIndex(item => item.id === product.id);

        if (existingIndex > -1) {
            // Item exists, so remove it
            this.items.splice(existingIndex, 1);
            this.app.notifications.show(`${product.name} removed from wishlist.`, 'info');
        } else {
            // Item does not exist, so add it
            this.items.push(product);
            this.app.notifications.show(`${product.name} added to wishlist!`, 'success');
        }

        this.saveWishlist();
        this.updateWishlistCount();
    }

    // This function updates the number on the heart icon in the header
    updateWishlistCount() {
        const count = this.items.length;
        const countElement = document.getElementById('wishlist-count');
        if (countElement) {
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}