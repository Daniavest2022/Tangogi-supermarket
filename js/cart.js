// js/cart.js - CORRECTED VERSION

export class CartManager {
    constructor(app) {
        this.app = app;
        this.items = []; // Holds the cart items
        console.log('🛒 Cart Manager Initialized');
    }

    init() {
        this.loadCartItems();
        // Any other setup for the cart can go here
    }

    // This function now works because storage.js has a .get() method
    loadCartItems() {
        // The '|| []' ensures that if nothing is in storage, we start with an empty cart
        this.items = this.app.storage.get('cart') || [];
        this.updateCartCount();
    }

    saveCart() {
        this.app.storage.set('cart', this.items);
    }
    
    addItem(product, quantity) {
        // Logic to add a product to the this.items array
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        
        this.saveCart();
        this.updateCartCount();
        console.log(`${quantity} of ${product.name} added to cart.`);
        this.app.notifications.show(`${product.name} added to cart!`, 'success');
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }
}