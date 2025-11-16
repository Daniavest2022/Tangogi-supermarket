// js/recipes.js - Page-Specific JavaScript for recipes.html

class RecipesPageManager {
    constructor() {
        this.app = window.app || {}; // Access the global app instance
        console.log('🍳 Recipes Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        // You would normally load recipes from an API here
        // For now, the recipes are hardcoded in the HTML
    }

    cacheDOMElements() {
        this.elements = {
            categoryFilters: document.querySelectorAll('.category-filter'),
            recipeGrid: document.getElementById('recipes-container'),
            recipeCards: document.querySelectorAll('.recipe-card'),
            addIngredientsModal: document.getElementById('add-ingredients-modal'),
        };
    }

    bindEvents() {
        if (!this.elements.recipeGrid) return;

        // --- Category Filtering ---
        this.elements.categoryFilters.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.categoryFilters.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.dataset.category;
                this.filterRecipes(category);
            });
        });
        
        // --- Event Delegation for Recipe Cards ---
        this.elements.recipeGrid.addEventListener('click', (event) => {
            const target = event.target;
            
            if (target.closest('.save-recipe-btn')) {
                this.handleSaveRecipe(target.closest('.save-recipe-btn'));
            }
            
            if (target.closest('.add-to-cart')) {
                this.openAddIngredientsModal(target.closest('.recipe-card'));
            }
        });

        // --- Modal Closing ---
        document.querySelectorAll('.modal-close, #cancel-add-ingredients').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.closeModal(modal);
            });
        });
    }

    filterRecipes(category) {
        this.elements.recipeCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    handleSaveRecipe(button) {
        button.classList.toggle('active');
        const icon = button.querySelector('i');
        const notification = document.getElementById('save-recipe-notification');

        if (button.classList.contains('active')) {
            icon.classList.remove('far'); // far is for regular (outline)
            icon.classList.add('fas');    // fas is for solid
            notification.querySelector('span').textContent = "Recipe saved to your collection!";
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            notification.querySelector('span').textContent = "Recipe removed from your collection.";
        }

        // Show feedback notification
        notification.style.display = 'flex';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    openAddIngredientsModal(recipeCard) {
        // In a real app, you would fetch the ingredients for this specific recipe
        const recipeName = recipeCard.querySelector('.recipe-title').textContent;
        document.getElementById('recipe-name').textContent = recipeName;

        this.openModal(this.elements.addIngredientsModal);
    }
    
    openModal(modal) {
        if (modal) modal.style.display = 'flex';
    }

    closeModal(modal) {
        if (modal) modal.style.display = 'none';
    }
}


// Initialize the manager when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run this script on the recipes page
    if (document.querySelector('.recipes-hero')) {
        new RecipesPageManager().init();
    }
});