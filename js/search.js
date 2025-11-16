// js/search.js - FINAL CORRECTED VERSION

export class SearchManager {
    constructor(app) {
        this.app = app;
        console.log('🔍 Search Manager Initialized');
    }

    init() {
        console.log('Search Manager is running.');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });

            searchInput.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }
    }

    performSearch(query) {
        console.log(`SearchManager is telling ProductManager to search for: ${query}`);
        
        // Check if the ProductManager and its handleSearch function are available
        if (this.app.products && typeof this.app.products.handleSearch === 'function') {
            
            // Call the handleSearch function in the ProductManager
            this.app.products.handleSearch(query);

        } else {
            // If we're not on the products page (or the function doesn't exist),
            // redirect to the products page with the search query in the URL.
            console.log('Not on products page or handleSearch not found. Redirecting...');
            window.location.href = `/products.html?search=${encodeURIComponent(query)}`;
        }
    }
}