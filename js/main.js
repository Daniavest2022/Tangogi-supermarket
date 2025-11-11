// js/main.js - CORRECTED VERSION

import { HeaderManager } from './header.js';
import { CartManager } from './cart.js';
// import { WishlistManager } from './wishlist.js'; // REMOVED - File does not exist
import { ProductManager } from './products.js';
import { SearchManager } from './search.js';
import { NotificationManager } from './notifications.js';
import { StorageManager } from './storage.js';
// import { ThemeManager } from './theme.js'; // REMOVED - File does not exist
import { PageRouter } from './router.js';

// NEW MANAGERS BASED ON YOUR FILE STRUCTURE
import { AuthManager } from './auth.js';
import { OrderManager } from './orders.js';
import { CategoryManager } from './categories.js';
import { DealManager } from './deals.js';
import { RecipeManager } from './recipes.js';
import { FormManager } from './forms.js';
import { SettingsManager } from './settings.js';
import { FAQManager } from './faq.js';
import { HelpManager } from './help.js';


class TangogiApp {
    constructor() {
        this.storage = new StorageManager();
        this.state = this.storage.loadState();
        
        // Core Managers
        this.header = new HeaderManager(this);
        this.cart = new CartManager(this);
        // this.wishlist = new WishlistManager(this); // REMOVED
        this.products = new ProductManager(this);
        this.search = new SearchManager(this);
        this.notifications = new NotificationManager();
        // this.theme = new ThemeManager(); // REMOVED
        this.router = new PageRouter(this);
        
        // NEW MANAGERS
        this.auth = new AuthManager(this);
        this.orders = new OrderManager(this);
        this.categories = new CategoryManager(this);
        this.deals = new DealManager(this);
        this.recipes = new RecipeManager(this);
        this.forms = new FormManager(this);
        this.settings = new SettingsManager(this);
        this.faq = new FAQManager(this);
        this.help = new HelpManager(this);
    }

    async init() {
        console.log('🛒 Tangogi Supermarket Initialized');
        
        // Initialize core managers
        this.header.init();
        this.cart.init();
        // this.wishlist.init(); // REMOVED
        this.products.init(); // This should now run successfully
        this.search.init();
        // this.theme.init(); // REMOVED
        
        // Initialize new managers
        this.auth.init();
        this.orders.init();
        this.categories.init();
        this.deals.init();
        this.recipes.init();
        this.forms.init();
        this.settings.init();
        this.faq.init();
        this.help.init();
        
        await this.router.init();
        this.bindGlobalEvents();
    }

    bindGlobalEvents() {
        window.addEventListener('online', () => this.notifications.show('Connection restored', 'success'));
        window.addEventListener('offline', () => this.notifications.show('You are offline', 'warning'));
        
        // Global error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.notifications.show('Something went wrong', 'error');
        });
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.storage.saveState(this.state);
    }

    getState() {
        return this.state;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM Content Loaded - Initializing TangogiApp');
    window.app = new TangogiApp();
    await window.app.init();
});