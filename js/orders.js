// js/orders.js - Page-Specific JavaScript for orders.html

class OrdersPageManager {
    constructor() {
        this.app = window.app || {};
        // Sample data - in a real app, this would come from a server or localStorage
        this.orders = [
            { id: 'TGO-789123', date: '2024-01-15', total: 12450, status: 'delivered', items: [ { name: 'Fresh Tomatoes' }, { name: 'Basmati Rice' } ] },
            { id: 'TGO-789124', date: '2024-01-16', total: 8750, status: 'processing', items: [ { name: 'Organic Bananas' }, { name: 'Whole Wheat Bread' } ] },
            { id: 'TGO-789122', date: '2024-01-14', total: 5500, status: 'cancelled', items: [ { name: 'Fresh Milk' } ] },
            { id: 'TGO-789121', date: '2023-12-20', total: 25000, status: 'delivered', items: [ { name: 'Chicken Breast' }, { name: 'Olive Oil' } ] }
        ];
        this.filteredOrders = [];

        console.log('📦 Orders Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.applyFilters(); // Initial render
    }

    cacheDOMElements() {
        this.elements = {
            container: document.getElementById('orders-container'),
            emptyState: document.getElementById('empty-orders'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            searchInput: document.getElementById('orders-search'),
            sortSelect: document.getElementById('orders-sort'),
            orderDetailsModal: document.getElementById('order-details-modal'),
            cancelModal: document.getElementById('cancel-order-modal'),
        };
    }

    bindEvents() {
        // --- Filter button clicks ---
        this.elements.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.applyFilters();
            });
        });

        // --- Search and Sort ---
        this.elements.searchInput.addEventListener('input', () => this.applyFilters());
        this.elements.sortSelect.addEventListener('change', () => this.applyFilters());

        // --- Event delegation for order card buttons ---
        this.elements.container.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            if (!target) return;

            if (target.classList.contains('view-details-btn')) {
                this.openModal(this.elements.orderDetailsModal);
            } else if (target.classList.contains('cancel-order-btn')) {
                this.openModal(this.elements.cancelModal);
            }
        });
        
        // --- Modal closing ---
        document.querySelectorAll('.modal-close, #cancel-cancellation').forEach(button => {
             button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.closeModal(modal);
             });
        });
    }

    applyFilters() {
        let orders = [...this.orders];
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        // Status filter
        if (activeFilter !== 'all') {
            orders = orders.filter(order => order.status === activeFilter);
        }

        // Search filter
        const searchTerm = this.elements.searchInput.value.toLowerCase();
        if (searchTerm) {
            orders = orders.filter(order => order.id.toLowerCase().includes(searchTerm));
        }
        
        // Sort
        const sortBy = this.elements.sortSelect.value;
        switch(sortBy) {
            case 'oldest':
                orders.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'price-high':
                orders.sort((a, b) => b.total - a.total);
                break;
            case 'price-low':
                orders.sort((a, b) => a.total - b.total);
                break;
            default: // newest
                orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        this.filteredOrders = orders;
        this.renderOrders();
    }

    renderOrders() {
        if (this.filteredOrders.length === 0) {
            this.elements.container.innerHTML = '';
            this.elements.emptyState.style.display = 'block';
        } else {
            this.elements.emptyState.style.display = 'none';
            this.elements.container.innerHTML = this.filteredOrders.map(order => this.createOrderCardHTML(order)).join('');
        }
    }

    createOrderCardHTML(order) {
        // This is a simplified version of your detailed card to keep the JS clean
        // You would expand this to include the progress bar, items preview, etc.
        const statusClass = order.status;
        const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        
        return `
            <div class="order-card" data-status="${order.status}">
                <div class="order-header">
                    <div class="order-meta">
                        <h3 class="order-number">${order.id}</h3>
                        <span class="order-date">Placed on ${new Date(order.date).toDateString()}</span>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <span class="order-total">₦${order.total.toLocaleString()}</span>
                    </div>
                </div>
                <div class="order-items-preview">
                    <!-- Preview of items would go here -->
                    <p>${order.items.length} item(s)</p>
                </div>
                <div class="order-footer">
                     <div class="order-actions">
                        <button class="btn btn-outline btn-sm view-details-btn">View Details</button>
                        ${order.status === 'processing' ? '<button class="btn btn-outline btn-sm cancel-order-btn">Cancel</button>' : ''}
                        ${order.status === 'delivered' ? '<button class="btn btn-primary btn-sm reorder-btn">Reorder</button>' : ''}
                    </div>
                </div>
            </div>
        `;
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
    // Only run this script on the orders page
    if (document.querySelector('.orders-hero')) {
        new OrdersPageManager().init();
    }
});