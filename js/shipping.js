// js/shipping.js - Page-Specific JavaScript for shipping.html

class ShippingPageManager {
    constructor() {
        this.app = window.app || {};
        // Data for the shipping calculator and map
        this.areaData = {
            lagos: ['Ikeja', 'Victoria Island', 'Lekki', 'Surulere'],
            abuja: ['Maitama', 'Wuse', 'Garki', 'Asokoro'],
            rivers: ['Port Harcourt GRA', 'Trans Amadi'],
        };
        console.log('🚚 Shipping Page Manager Initialized');
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
    }

    cacheDOMElements() {
        this.elements = {
            // Map elements
            mapStates: document.querySelectorAll('.nigeria-map .state'),
            stateDetails: document.querySelectorAll('.coverage-details .state-details'),
            // Calculator elements
            stateSelect: document.getElementById('delivery-state'),
            areaSelect: document.getElementById('delivery-area'),
            calculateBtn: document.getElementById('calculate-shipping'),
            resultsContainer: document.getElementById('shipping-results'),
            // FAQ items
            faqItems: document.querySelectorAll('.shipping-faq-section .faq-item'),
            // Modals
            learnInternationalBtn: document.getElementById('learn-international'),
            internationalModal: document.getElementById('international-modal'),
            modalCloseButtons: document.querySelectorAll('.modal-close'),
        };
    }

    bindEvents() {
        // --- Interactive Map ---
        this.elements.mapStates.forEach(stateEl => {
            stateEl.addEventListener('click', () => this.showStateDetails(stateEl.dataset.state));
        });

        // --- Shipping Calculator ---
        if (this.elements.stateSelect) {
            this.elements.stateSelect.addEventListener('change', () => this.populateAreas());
        }
        if (this.elements.calculateBtn) {
            this.elements.calculateBtn.addEventListener('click', () => this.calculateShipping());
        }
        
        // --- Accordion Functionality ---
        this.elements.faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            if (questionButton) {
                questionButton.addEventListener('click', () => item.classList.toggle('active'));
            }
        });

        // --- Modals ---
        if (this.elements.learnInternationalBtn) {
            this.elements.learnInternationalBtn.addEventListener('click', () => this.openModal(this.elements.internationalModal));
        }
        this.elements.modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModal(button.closest('.modal')));
        });
    }
    
    showStateDetails(state) {
        // Deactivate all
        this.elements.mapStates.forEach(el => el.classList.remove('selected'));
        this.elements.stateDetails.forEach(el => el.classList.remove('active'));

        // Activate the selected one
        document.querySelector(`.nigeria-map .state[data-state="${state}"]`).classList.add('selected');
        document.querySelector(`.coverage-details .state-details[data-state="${state}"]`).classList.add('active');
    }

    populateAreas() {
        const selectedState = this.elements.stateSelect.value;
        const areas = this.areaData[selectedState] || [];
        
        this.elements.areaSelect.innerHTML = '<option value="">Select Area</option>'; // Reset
        this.elements.areaSelect.disabled = areas.length === 0;

        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.toLowerCase().replace(/ /g, '-');
            option.textContent = area;
            this.elements.areaSelect.appendChild(option);
        });
    }

    calculateShipping() {
        // This is a simulation. A real app would use a more complex pricing engine.
        const orderValue = Number(document.getElementById('order-value').value) || 0;
        let cost = 500; // Base cost

        if (orderValue >= 5000) {
            cost = 0; // Free delivery
        }

        // Update the results UI
        document.getElementById('delivery-cost').textContent = cost === 0 ? 'Free' : `₦${cost.toLocaleString()}`;
        this.elements.resultsContainer.style.display = 'block';
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
    // Only run this script on the shipping page
    if (document.querySelector('.shipping-hero')) {
        new ShippingPageManager().init();
    }
});