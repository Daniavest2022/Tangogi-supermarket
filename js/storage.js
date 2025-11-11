// js/storage.js - CORRECTED VERSION

export class StorageManager {
    constructor() {
        this.prefix = 'tangogi_';
    }

    // THIS IS THE MISSING FUNCTION THAT cart.js NEEDS
    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting item "${key}" from storage:`, error);
            return null;
        }
    }

    // This function will also be needed by cart.js to save the cart
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item "${key}" in storage:`, error);
        }
    }

    // These are your existing functions for managing the whole app state
    saveState(state) {
        this.set('app_state', state);
    }

    loadState() {
        return this.get('app_state') || {};
    }
}