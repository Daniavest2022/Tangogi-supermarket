// js/express-delivery.js - Page-Specific JavaScript for express-delivery.html

// --- Global Functions to be called from HTML ---

function startExpressOrder() {
    // Redirects the user to the products page, perhaps with a filter for express items
    window.location.href = 'products.html?delivery=express';
}

function scrollToHowItWorks() {
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
}

function viewAllExpressProducts() {
    window.location.href = 'products.html?delivery=express';
}

function checkServiceArea() {
    // In a real app, this would open a modal or redirect to a page with a map/address input
    alert('Service area check functionality is coming soon!');
}


class ExpressDeliveryManager {
    constructor() {
        console.log('⚡ Express Delivery Page Manager Initialized');
    }

    init() {
        this.loadExpressProducts();
    }

    // This function simulates loading products that are available for express delivery
    loadExpressProducts() {
        const container = document.getElementById('express-products-grid');
        if (!container) return;

        // In a real app, this data would come from an API
        const expressProducts = [
            { name: 'Fresh Milk', imageUrl: 'https://via.placeholder.com/300x200/FFFFFF/000000?text=Fresh+Milk' },
            { name: 'Sliced Bread', imageUrl: 'https://via.placeholder.com/300x200/DEB887/FFFFFF?text=Sliced+Bread' },
            { name: 'Dozen Eggs', imageUrl: 'https://via.placeholder.com/300x200/FFF8DC/000000?text=Eggs' },
            { name: 'Fresh Tomatoes', imageUrl: 'https://via.placeholder.com/300x200/FF6347/FFFFFF?text=Tomatoes' }
        ];

        let productsHTML = '';
        expressProducts.forEach(product => {
            productsHTML += `
                <div class="product-card express-product">
                    <div class="product-image">
                        <img src="${product.imageUrl}" alt="${product.name}">
                        <div class="express-badge"><i class="fas fa-bolt"></i> Express</div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <button class="btn btn-primary btn-sm">Add to Cart</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = productsHTML;
    }
}

// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the express delivery page
    if (document.querySelector('.express-delivery-hero')) {
        new ExpressDeliveryManager().init();
    }
});