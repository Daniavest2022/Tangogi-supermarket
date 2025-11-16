// js/cart.js - FULLY FEATURED VERSION FOR CART PAGE

export class CartManager {
    constructor(app) {
        this.app = app;
        this.items = [];
        this.elements = {}; // To store HTML elements
        console.log('🛒 Cart Manager Initialized');
    }

    init() {
        this.loadCart();
        // ** NEW: Check if we are on the cart page before doing page-specific logic **
        if (document.querySelector('.cart-content')) {
            this.cacheCartPageElements();
            this.bindCartPageEvents();
            this.renderCartPage();
        }
    }

    // ** NEW: Finds all the elements we need on the cart page **
    cacheCartPageElements() {
        this.elements.container = document.getElementById('cart-items-container');
        this.elements.emptyMessage = document.getElementById('empty-cart-message');
        this.elements.subtotal = document.getElementById('cart-subtotal');
        this.elements.tax = document.getElementById('cart-tax');
        this.elements.shipping = document.getElementById('cart-shipping');
        this.elements.total = document.getElementById('cart-total');
    }

    // ** NEW: Listens for clicks on quantity and remove buttons **
    bindCartPageEvents() {
        if (this.elements.container) {
            this.elements.container.addEventListener('click', (event) => {
                const target = event.target;
                const itemElement = target.closest('.cart-item');
                if (!itemElement) return;
                
                const productId = itemElement.dataset.productId;

                if (target.matches('.quantity-btn.increase')) {
                    this.updateQuantity(productId, 1);
                } else if (target.matches('.quantity-btn.decrease')) {
                    this.updateQuantity(productId, -1);
                } else if (target.matches('.remove-item')) {
                    this.removeItem(productId);
                }
            });
        }
    }

    // --- Core Cart Logic ---

    loadCart() {
        this.items = this.app.storage.get('cart_items') || [];
        this.updateCartCount(); // Updates the header icon
    }

    saveCart() {
        this.app.storage.set('cart_items', this.items);
    }

    addItem(product, quantity) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        this.saveCart();
        this.updateCartCount();
        this.app.notifications.show(`${product.name} was added to your cart!`, 'success');
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeItem(productId);
        } else {
            this.saveCart();
            this.renderCartPage(); // Re-render the whole page to update totals
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartPage();
        this.updateCartCount();
        this.app.notifications.show(`Item removed from cart.`, 'info');
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // ** NEW: Renders the entire cart page content **
    renderCartPage() {
        if (!this.elements.container) return; // Make sure we are on the right page

        if (this.items.length === 0) {
            this.elements.container.innerHTML = '';
            this.elements.emptyMessage.style.display = 'block';
        } else {
            this.elements.emptyMessage.style.display = 'none';
            this.elements.container.innerHTML = this.items.map(item => this.renderCartItem(item)).join('');
        }
        
        this.calculateTotals();
    }

    // ** NEW: Creates the HTML for a single cart item **
    renderCartItem(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">₦${item.price.toLocaleString()}</span>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="remove-item" aria-label="Remove ${item.name}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }

    // ** NEW: Calculates and displays subtotal, tax, and total **
    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.05; // 5% tax
        const shipping = 500; // Fixed shipping
        const total = subtotal + tax + shipping;

        this.elements.subtotal.textContent = `₦${subtotal.toLocaleString()}`;
        this.elements.tax.textContent = `₦${tax.toLocaleString()}`;
        this.elements.shipping.textContent = `₦${shipping.toLocaleString()}`;
        this.elements.total.textContent = `₦${total.toLocaleString()}`;
    }
}