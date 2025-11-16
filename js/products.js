// js/products.js - FINAL, FULLY-FEATURED VERSION

export class ProductManager {
    constructor(app) {
        this.app = app;
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.elements = {};
    }

    async init() {
        if (!document.getElementById('products-grid')) {
            return;
        }
        console.log('🛍️ Product Manager Initialized');
        this.cacheDOM();
        this.bindEvents();
        await this.loadProducts();
        this.applyFilters(); // Initial render
    }
    
    cacheDOM() {
        this.elements = {
            productsGrid: document.getElementById('products-grid'),
            productsLoading: document.getElementById('products-loading'),
            noProductsState: document.getElementById('no-products'),
            categoryFilter: document.getElementById('category-filter'),
            sortFilter: document.getElementById('sort-filter'),
            priceFilter: document.getElementById('price-filter'),
            availabilityFilter: document.getElementById('availability-filter'),
            ratingFilter: document.getElementById('rating-filter'),
            dietaryFilter: document.getElementById('dietary-filter'),
            viewBtns: document.querySelectorAll('.view-btn'),
            paginationContainer: document.getElementById('pagination-container'),
            paginationNumbers: document.querySelector('.pagination-numbers'),
            paginationPrevBtn: document.querySelector('.pagination-btn.prev'),
            paginationNextBtn: document.querySelector('.pagination-btn.next'),
            productsCount: document.getElementById('products-count'),
        };
    }

    async loadProducts() {
        this.showLoadingState();
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
            this.allProducts = this.getMockProducts();
        } catch (error) { console.error('Error loading products:', error); }
    }

    getMockProducts() {
        // ... (Your large list of mock products goes here. I'll use a short version for brevity)
        return [
            { id: 'prod-001', name: 'Fresh Tomatoes', category: 'vegetables', price: 1200, rating: 4.5, imageUrl: 'images/products/tomatoes.jpg', inStock: true, dietary: 'organic' },
            { id: 'prod-002', name: 'Premium Basmati Rice', category: 'grains', price: 4500, rating: 4.0, imageUrl: 'images/products/flour.jpg', inStock: true, dietary: null },
            { id: 'prod-003', name: 'Organic Bananas', category: 'fruits', price: 800, rating: 4.2, imageUrl: 'images/products/bananas.jpg', inStock: true, dietary: 'organic' },
            { id: 'prod-004', name: 'Chicken Breast', category: 'meat', price: 2500, rating: 4.8, imageUrl: 'images/products/chicken-breast.jpg', inStock: false, dietary: null },
            { id: 'prod-005', name: 'Fresh Carrots', category: 'vegetables', price: 600, rating: 4.3, imageUrl: 'images/products/carrots.jpg', inStock: true, dietary: 'organic' },
        ];
    }

    bindEvents() {
        const filters = [
            this.elements.categoryFilter, this.elements.sortFilter, this.elements.priceFilter,
            this.elements.availabilityFilter, this.elements.ratingFilter, this.elements.dietaryFilter
        ];
        filters.forEach(filter => {
            if (filter) filter.addEventListener('change', () => this.applyFilters());
        });
        
        this.elements.viewBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
        });

        this.elements.paginationNextBtn.addEventListener('click', () => this.changePage(this.currentPage + 1));
        this.elements.paginationPrevBtn.addEventListener('click', () => this.changePage(this.currentPage - 1));
    }

    // In js/products.js, replace the applyFilters function with this:

applyFilters() {
    let processed = [...this.allProducts];

    // 1. Category Filter
    const category = this.elements.categoryFilter.value;
    if (category) {
        processed = processed.filter(p => p.category === category);
    }

    // 2. Availability Filter
    const availability = this.elements.availabilityFilter.value;
    if (availability === 'in-stock') {
        processed = processed.filter(p => p.inStock);
    } else if (availability === 'out-of-stock') {
        processed = processed.filter(p => !p.inStock);
    }

    // 3. Price Filter
    const priceRange = this.elements.priceFilter.value;
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        processed = processed.filter(p => p.price >= min && p.price <= max);
    }

    // 4. Rating Filter
    const minRating = Number(this.elements.ratingFilter.value);
    if (minRating) {
        processed = processed.filter(p => p.rating >= minRating);
    }
    
    // 5. Dietary Filter
    const dietary = this.elements.dietaryFilter.value;
    if (dietary) {
        processed = processed.filter(p => p.dietary === dietary);
    }

    // 6. Sorting Logic
    const sortBy = this.elements.sortFilter.value;
    switch (sortBy) {
        case 'price-asc':
            processed.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            processed.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            processed.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            processed.sort((a, b) => a.name.localeCompare(b.name));
            break;
        // 'featured', 'newest', 'bestselling' would need more data, but this covers the main ones.
    }

    this.filteredProducts = processed;
    this.currentPage = 1; // Reset to first page after filtering
    this.updateProductsDisplay();
}
    
    updateProductsDisplay() {
        this.hideLoadingState();
        this.renderProducts();
        this.updatePagination();
        this.updateProductCount();
    }
    
    renderProducts() {
        if (!this.elements.productsGrid) return;
        
        const total = this.filteredProducts.length;
        if (total === 0) {
            this.elements.noProductsState.hidden = false;
            this.elements.productsGrid.innerHTML = '';
            this.elements.paginationContainer.hidden = true;
        } else {
            this.elements.noProductsState.hidden = true;
            const startIndex = (this.currentPage - 1) * this.productsPerPage;
            const endIndex = startIndex + this.productsPerPage;
            const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
            this.elements.productsGrid.innerHTML = productsToShow.map(p => this.renderProductCard(p)).join('');
        }
    }

    renderProductCard(product) {
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image"><img src="${product.imageUrl}" alt="${product.name}"></div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>₦${product.price.toLocaleString()}</p>
                    <button class="btn btn-primary add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;
    }
    
    switchView(view) {
        this.currentView = view;
        this.elements.productsGrid.dataset.view = view; // Assumes your CSS uses [data-view="list"]
        this.elements.viewBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
        // You might need a specific render function for the list view if the HTML is very different
    }

    updatePagination() {
        const totalProducts = this.filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / this.productsPerPage);
        
        this.elements.paginationContainer.hidden = totalPages <= 1;
        this.elements.paginationPrevBtn.disabled = this.currentPage === 1;
        this.elements.paginationNextBtn.disabled = this.currentPage === totalPages;

        // Generate page number buttons (simplified)
        this.elements.paginationNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => this.changePage(i);
            this.elements.paginationNumbers.appendChild(pageBtn);
        }
    }

    changePage(pageNumber) {
        this.currentPage = pageNumber;
        this.updateProductsDisplay();
    }

    updateProductCount() {
        this.elements.productsCount.textContent = `${this.filteredProducts.length} Products Found`;
    }

    showLoadingState() {
        this.elements.productsLoading.classList.remove('hidden');
        this.elements.productsGrid.classList.add('hidden');
    }

    hideLoadingState() {
        this.elements.productsLoading.classList.add('hidden');
        this.elements.productsGrid.classList.remove('hidden');
    }
}
// js/products.js

// ... (all your existing ProductManager class code is here) ...


// ADD THIS BLOCK TO THE END OF THE FILE
document.addEventListener('DOMContentLoaded', () => {
    // Ensure we are on the products page before running
    if (document.getElementById('products-grid')) {
        const productManager = new ProductManager(window.app);
        productManager.init();
    }
});