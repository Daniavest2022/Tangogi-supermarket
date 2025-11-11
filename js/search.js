// js/search.js

// The "export" keyword here is the crucial fix.
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
        console.log(`Performing search for: ${query}`);
        if (this.app.products) {
            this.app.products.handleSearch(query);
        }
    }
}