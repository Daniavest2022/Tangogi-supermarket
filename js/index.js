// js/index.js - Page-Specific JavaScript for index.html

class HomePageManager {
    constructor(app) {
        this.app = app; // Access the global app instance
        console.log('🏠 Home Page Manager Initialized');
    }

    init() {
        this.setupIntersectionObserver();
        this.loadFeaturedProducts();
    }

    // This function sets up an "observer" that watches for elements entering the screen.
    // It's used for the counting numbers and lazy-loading images.
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Animate number counters
                    if (element.matches('[data-count]')) {
                        this.animateCounter(element);
                    }
                    
                    // Lazy-load images
                    if (element.classList.contains('lazy-load')) {
                        element.src = element.dataset.src;
                        element.classList.remove('lazy-load');
                        element.classList.add('loaded'); // For a nice fade-in effect
                    }

                    // Stop observing this element once its action is complete
                    observer.unobserve(element);
                }
            });
        }, options);

        // Tell the observer to watch all counters and lazy-load images
        const elementsToObserve = document.querySelectorAll('[data-count], .lazy-load');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    // This function handles the number counting animation
    animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000; // Animation duration in ms
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target.toLocaleString() + (element.dataset.suffix || '');
            }
        };
        requestAnimationFrame(updateCount);
    }
    
    // This function loads and displays the featured products
    loadFeaturedProducts() {
        const container = document.getElementById('featured-products');
        const loadingSpinner = document.getElementById('products-loading');
        if (!container || !loadingSpinner) return;

        // In a real app, you would fetch this from an API.
        // Here, we can ask the ProductManager (if it exists) for some products.
        // For simplicity, we'll define a small list here.
        const allProducts = this.getMockProducts();
        
        // Let's feature the first 4 products
        const featuredProducts = allProducts.slice(0, 4);
        
        // Hide spinner and render products
        loadingSpinner.style.display = 'none';
        container.innerHTML = featuredProducts.map(p => this.renderProductCard(p)).join('');
    }
    
    // We need a local version of these functions since products.js may not be loaded
    getMockProducts() {
        return [
            { id: 'prod-001', name: 'Fresh Tomatoes', category: 'fresh-produce', price: 1200, rating: 4.5, imageUrl: 'images/products/tomatoes.jpg', inStock: true },
            { id: 'prod-003', name: 'Organic Bananas', category: 'fresh-produce', price: 800, rating: 4.2, imageUrl: 'images/products/bananas.jpg', inStock: true },
            { id: 'prod-005', name: 'Fresh Carrots', category: 'fresh-produce', price: 600, rating: 4.3, imageUrl: 'images/products/carrots.jpg', inStock: true },
            { id: 'prod-004', name: 'Chicken Breast', category: 'meat', price: 2500, rating: 4.8, imageUrl: 'images/products/chicken-breast.jpg', inStock: false },
        ];
    }

    renderProductCard(product) {
        return `
            <div class="product-card ${!product.inStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
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
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the home page
    if (document.querySelector('.hero-section')) {
        const homeManager = new HomePageManager(window.app);
        homeManager.init();
    }
});