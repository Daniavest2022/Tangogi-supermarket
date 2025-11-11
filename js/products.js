// js/products.js - FINAL CORRECTED VERSION

export class ProductManager {
    constructor(app) {
        this.app = app;
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.currentFilters = { /* ... */ };
        this.elements = {};
    }

    async init() {
        if (!document.getElementById('products-grid')) {
            return; 
        }

        console.log('🛍️ Product Manager Initialized');
        this.cacheDOM();
        await this.loadProducts();
        this.filteredProducts = [...this.allProducts];
        this.bindEvents();
        this.applyURLParameters();
        this.updateProductsDisplay();
    }

    cacheDOM() {
        this.elements = {
            productsGrid: document.getElementById('products-grid'),
            productsLoading: document.getElementById('products-loading'),
            paginationContainer: document.getElementById('pagination-container'),
            paginationNumbers: document.querySelector('.pagination-numbers'),
            paginationPrevBtn: document.querySelector('.pagination-btn.prev'),
            paginationNextBtn: document.querySelector('.pagination-btn.next'),
            paginationInfo: document.getElementById('pagination-info'),
        };
    }

    async loadProducts() {
        this.showLoadingState();
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            this.allProducts = this.getMockProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    getMockProducts() {
        return [
            { id: 'prod-001', name: 'Fresh Tomatoes', category: 'fresh-produce', price: 1200, rating: 4.5, imageUrl: 'images/products/tomatoes.jpg', inStock: true },
            { id: 'prod-002', name: 'Premium Basmati Rice', category: 'pantry-staples', price: 4500, rating: 4.0, imageUrl: 'images/products/flour.jpg', inStock: true }, // Using flour as a placeholder
            { id: 'prod-003', name: 'Organic Bananas', category: 'fresh-produce', price: 800, rating: 4.2, imageUrl: 'images/products/bananas.jpg', inStock: true },
            { id: 'prod-004', name: 'Chicken Breast', category: 'meat', price: 2500, rating: 4.8, imageUrl: 'images/products/chicken-breast.jpg', inStock: false },
            { id: 'prod-005', name: 'Fresh Carrots', category: 'fresh-produce', price: 600, rating: 4.3, imageUrl: 'images/products/carrots.jpg', inStock: true },
            { id: 'prod-009', name: 'Fresh Onions', category: 'fresh-produce', price: 900, rating: 4.7, imageUrl: 'images/products/onions.jpg', inStock: true },
            { id: 'prod-004', name: 'Turkey', category: 'meat', price: 2500, rating: 4.8, imageUrl: 'images/products/turkey.jpg', inStock: false },
        ];
    }
    bindEvents() {
        // Placeholder
    }

    applyURLParameters() {
        // Placeholder
    }
    
    updateProductsDisplay() {
        this.hideLoadingState();
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (this.filteredProducts.length === 0) {
            this.elements.productsGrid.innerHTML = '<p>No products found.</p>';
            return;
        }

        this.renderProducts(productsToShow);
        this.updatePagination(); 
    }

    renderProducts(products) {
        if (!this.elements.productsGrid) return;
        this.elements.productsGrid.innerHTML = products.map(p => this.renderProductCard(p)).join('');
    }

    renderProductCard(product) {
        return `
            <div class="product-card ${!product.inStock ? 'out-of-stock' : ''}">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">${'★'.repeat(Math.round(product.rating))}</div>
                    <div class="product-price">
                        <span class="price">₦${product.price.toLocaleString()}</span>
                    </div>
                    <button class="btn btn-primary add-to-cart" ${!product.inStock ? 'disabled' : ''}>
                        ${!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
    }

    updatePagination() {
        if (!this.elements.paginationContainer) return;
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        // ... (rest of pagination logic)
    }

    showLoadingState() {
        if (this.elements.productsLoading) {
            this.elements.productsLoading.classList.remove('hidden');
        }
        if (this.elements.productsGrid) {
            this.elements.productsGrid.classList.add('hidden');
        }
    }

    hideLoadingState() {
        if (this.elements.productsLoading) {
            this.elements.productsLoading.classList.add('hidden');
        }
        if (this.elements.productsGrid) {
            this.elements.productsGrid.classList.remove('hidden');
        }
    }

}