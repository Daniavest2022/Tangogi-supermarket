// js/router.js - CORRECTED VERSION

// The "export" keyword here is the fix.
export class PageRouter {
    constructor(app) {
        this.app = app;
        this.routes = {
            '/products.html': 'handleProductsPage',
            '/categories.html': 'handleCategoriesPage'
            // Add other pages here
        };
        console.log('🚀 Page Router Initialized');
    }

    async init() {
        this.handlePageSpecificLogic();
    }

    handlePageSpecificLogic() {
        const path = window.location.pathname;
        const handlerName = this.routes[path];

        if (handlerName && typeof this[handlerName] === 'function') {
            console.log(`Router is handling logic for: ${path}`);
            this[handlerName]();
        }
    }

    handleProductsPage() {
        // This is where logic specific to the products page would go
        // For example, initializing a special filter widget.
        console.log('Executing logic for the Products page.');
        if (this.app.products) {
            // The product manager is already initialized by main.js,
            // but you could call extra functions here if needed.
        }
    }

    handleCategoriesPage() {
        // This is where logic for the categories page goes.
        console.log('Executing logic for the Categories page.');
        if (this.app.categories && typeof this.app.categories.loadCategories === 'function') {
            this.app.categories.loadCategories();
        } else {
             console.error("CategoryManager or loadCategories method not available!");
        }
    }
}